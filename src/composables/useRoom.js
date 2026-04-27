import { ref, onUnmounted } from 'vue'
import { doc, onSnapshot, collection, setDoc, serverTimestamp, getDocs, deleteDoc } from 'firebase/firestore'
import { db } from '../firebase'

export function useRoom(roomId) {
  const roomData = ref(null)
  const participants = ref([])
  const answers = ref([])
  const loading = ref(true)

  const roomRef = doc(db, 'rooms', roomId)

  // Listen to room basic info
  const unsubRoom = onSnapshot(roomRef, (docSnap) => {
    if (docSnap.exists()) {
      roomData.value = docSnap.data()
    }
    loading.value = false
  })

  // Listen to participants
  const unsubParticipants = onSnapshot(collection(roomRef, 'participants'), (snap) => {
    participants.value = snap.docs.map(doc => doc.data())
  })

  // Listen to answers
  const unsubAnswers = onSnapshot(collection(roomRef, 'answers'), (snap) => {
    answers.value = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  })

  const updateRoomState = async (data) => {
    await setDoc(roomRef, { ...data, updatedAt: serverTimestamp() }, { merge: true })
  }

  const clearAnswers = async () => {
    const answersRef = collection(roomRef, 'answers')
    const snapshot = await getDocs(answersRef)
    await Promise.all(snapshot.docs.map(d => deleteDoc(d.ref)))
  }

  onUnmounted(() => {
    unsubRoom()
    unsubParticipants()
    unsubAnswers()
  })

  return {
    roomData,
    participants,
    answers,
    loading,
    updateRoomState,
    clearAnswers
  }
}
