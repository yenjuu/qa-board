import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { doc, setDoc, getDoc, getDocs, deleteDoc, collection, serverTimestamp, query, orderBy, limit } from 'firebase/firestore'
import { db } from '../firebase'

export function useHome() {
  const router = useRouter()
  const isLoading = ref(false)
  const isFetching = ref(false)
  const existingRooms = ref([])

  const fetchRooms = async () => {
    isFetching.value = true
    const minWait = new Promise(resolve => setTimeout(resolve, 600)) // 確保轉圈體感
    try {
      const q = query(collection(db, 'rooms'), orderBy('createdAt', 'desc'), limit(20))
      const querySnapshot = await getDocs(q)
      existingRooms.value = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      await minWait
    } catch (error) {
      console.error("抓取房間列表失敗: ", error)
    } finally {
      isFetching.value = false
    }
  }

  const createRoom = async (name) => {
    const roomId = name.trim().toUpperCase()
    if (!roomId || isLoading.value) return

    isLoading.value = true
    try {
      const roomRef = doc(db, 'rooms', roomId)
      const roomSnap = await getDoc(roomRef)
      
      if (roomSnap.exists()) {
        const confirmGo = confirm("此房間代碼已存在，要直接進入嗎？")
        if (!confirmGo) {
          isLoading.value = false
          return false
        }
      } else {
        await setDoc(roomRef, {
          status: 'waiting', 
          questionMode: 'oral',
          questionText: '',
          createdAt: serverTimestamp()
        })
      }
      
      router.push(`/host/${roomId}`)
      return true
    } catch (error) {
      console.error("建立失敗: ", error)
      alert("建立失敗，請檢查 Firebase 設定與權限。")
      return false
    } finally {
      isLoading.value = false
    }
  }

  const deleteRoom = async (id) => {
    if (!confirm(`確定要刪除房間 ${id} 嗎？`)) return
    try {
      await deleteDoc(doc(db, 'rooms', id))
      await fetchRooms() // Refresh list
    } catch (error) {
      console.error("刪除失敗: ", error)
      alert("刪除失敗")
    }
  }

  const generateRandomId = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    let result = ''
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
      if (i === 2) result += '-'
    }
    return result
  }

  return {
    isLoading,
    isFetching,
    existingRooms,
    fetchRooms,
    createRoom,
    deleteRoom,
    generateRandomId
  }
}
