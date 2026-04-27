<template>
  <div class="container text-center mt-4">
    <h2>加入房間: {{ roomId }}</h2>
    
    <div class="card mt-4 fade-in" style="max-width: 400px; margin: 0 auto;">
      <h3>請輸入你的暱稱</h3>
      <div class="mt-2 mb-2">
        <input 
          type="text" 
          v-model="nickname" 
          placeholder="例如：小明" 
          @keyup.enter="joinRoom"
        />
      </div>
      <button @click="joinRoom" :disabled="!nickname.trim() || isLoading">
        {{ isLoading ? '加入中...' : '進入房間' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'

const props = defineProps(['roomId'])
const router = useRouter()
const nickname = ref('')
const isLoading = ref(false)

const joinRoom = async () => {
  if (!nickname.value.trim()) return
  
  const name = nickname.value.trim()
  isLoading.value = true
  
  try {
    localStorage.setItem(`qa_nickname_${props.roomId}`, name)
    
    // 將參與者加入 rooms/:roomId/participants/:nickname
    const participantRef = doc(db, 'rooms', props.roomId, 'participants', name)
    await setDoc(participantRef, {
      nickname: name,
      joinedAt: serverTimestamp()
    })
    
    router.push(`/room/${props.roomId}`)
  } catch (error) {
    console.error("加入房間失敗: ", error)
    alert("加入失敗，請檢查網路連線或房間是否存在")
  } finally {
    isLoading.value = false
  }
}
</script>
