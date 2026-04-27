<template>
  <div class="container participant-page">
    <div class="header-section fade-in">
      <div>
        <p class="room-label">正在參與房間</p>
        <h2>{{ roomId }}</h2>
      </div>
      <div class="user-badge glass">
        <span class="dot online"></span>
        {{ nickname }}
      </div>
    </div>

    <div class="main-content fade-in mt-3">
      <!-- 等待中 -->
      <div v-if="status === 'waiting'" class="card text-center">
        <div class="waiting-animation">
          <div class="pulse"></div>
        </div>
        <h3 class="mt-4">等待主持人出題...</h3>
        <p class="text-gray-500">準備好你的答案了嗎？</p>
      </div>
      
      <!-- 收集答案中 -->
      <div v-else-if="status === 'collecting'" class="card">
        <div class="question-box mb-3">
          <p class="text-sm text-primary">目前的題目：</p>
          <h3 v-if="questionText" class="mt-1">{{ questionText }}</h3>
          <h3 v-else class="mt-1 italic text-gray-500">請聽主持人發問...</h3>
        </div>
        
        <div v-if="!roomData?.skipAnswering" class="input-section mt-3">
          <label class="text-sm font-semibold mb-1 block">你的答案</label>
          <input 
            type="text" 
            v-model="answer" 
            placeholder="在這邊輸入答案..." 
            class="mb-2"
            @keyup.enter="submitAnswer"
          />
          <button 
            @click="submitAnswer" 
            :disabled="!answer.trim() || isSubmitting" 
            class="full-width"
            :class="{ 'btn-success': showSuccessHint }"
          >
            <span v-if="isSubmitting">傳送中...</span>
            <span v-else-if="showSuccessHint">已更新 ✓</span>
            <span v-else>{{ hasSubmitted ? '更新答案' : '送出答案' }}</span>
          </button>
          
          <div v-if="hasSubmitted" class="success-msg mt-2 fade-in">
            <span class="icon">✓</span> 答案已送出，主持人翻牌前皆可修改。
          </div>
        </div>
        <div v-else class="slideshow-view-mode text-center py-4 glass fade-in">
          <div class="view-icon">🎞️</div>
          <p class="font-bold">自動播放模式中</p>
          <p class="text-sm text-gray-500">此場次僅供觀看題目，不需回答</p>
        </div>
      </div>
      
      <!-- 翻牌中 -->
      <div v-else-if="status === 'revealed'" class="card text-center">
        <div class="reveal-icon">🎴</div>
        <template v-if="!roomData?.skipAnswering">
          <h3>翻牌揭曉中！</h3>
          <p class="text-gray-500">請看主持人螢幕，看看大家的驚喜答案。</p>
          
          <div v-if="answer" class="my-answer mt-4">
            <p class="text-sm text-gray-500">你剛才的答案：</p>
            <p class="font-bold text-lg">{{ answer }}</p>
          </div>
        </template>
        <template v-else>
          <h3>準備進入下一題</h3>
          <p class="text-gray-500">請稍候...</p>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'
import { useRoom } from '../composables/useRoom'

const props = defineProps(['roomId'])
const router = useRouter()

const nickname = ref('')
const answer = ref('')
const isSubmitting = ref(false)
const hasSubmitted = ref(false)
const showSuccessHint = ref(false)

// Use Composable
const { roomData } = useRoom(props.roomId)

// Map roomData to local refs for template
const status = ref('waiting')
const questionText = ref('')

watch(roomData, (newData) => {
  if (newData) {
    const newQuestionText = newData.questionText || ''
    
    // BUG FIX: 只要題目內容變了，就代表是新的一題，必須清空本地答案
    if (newQuestionText !== questionText.value) {
      answer.value = ''
      hasSubmitted.value = false
      showSuccessHint.value = false
    }

    status.value = newData.status || 'waiting'
    questionText.value = newQuestionText
    
    if (status.value === 'waiting') {
      answer.value = ''
      hasSubmitted.value = false
    }
  }
})

onMounted(() => {
  const savedName = localStorage.getItem(`qa_nickname_${props.roomId}`)
  if (!savedName) {
    router.push(`/join/${props.roomId}`)
    return
  }
  nickname.value = savedName
  
  // Update presence
  const participantRef = doc(db, 'rooms', props.roomId, 'participants', savedName)
  setDoc(participantRef, {
    nickname: savedName,
    lastActive: serverTimestamp()
  }, { merge: true })
})

const submitAnswer = async () => {
  if (!answer.value.trim() || isSubmitting.value) return
  
  isSubmitting.value = true
  try {
    const answerRef = doc(db, 'rooms', props.roomId, 'answers', nickname.value)
    await setDoc(answerRef, {
      nickname: nickname.value,
      answer: answer.value.trim(),
      timestamp: serverTimestamp()
    })
    
    if (hasSubmitted.value) {
      showSuccessHint.value = true
      setTimeout(() => {
        showSuccessHint.value = false
      }, 2000)
    }

    hasSubmitted.value = true

  } catch (error) {
    console.error("送出答案失敗: ", error)
    alert("送出失敗，請重試！")
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.participant-page {
  padding-top: 1rem;
  padding-bottom: 1rem;
}
.header-section { display: flex; justify-content: space-between; align-items: center; }
.room-label { font-size: 0.75rem; font-weight: 600; color: var(--primary-color); text-transform: uppercase; margin-bottom: 0.25rem; }
.user-badge { padding: 0.5rem 1rem; border-radius: 999px; font-weight: 600; display: flex; align-items: center; gap: 0.5rem; }
.dot { width: 8px; height: 8px; border-radius: 50%; }
.dot.online { background-color: #10b981; box-shadow: 0 0 8px rgba(16, 185, 129, 0.5); }
.waiting-animation { height: 100px; display: flex; align-items: center; justify-content: center; }
.pulse { width: 40px; height: 40px; background-color: var(--primary-color); border-radius: 50%; animation: pulse 2s infinite; }
@keyframes pulse {
  0% { transform: scale(0.8); opacity: 0.8; box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4); }
  70% { transform: scale(1.1); opacity: 0.3; box-shadow: 0 0 0 20px rgba(99, 102, 241, 0); }
  100% { transform: scale(0.8); opacity: 0.8; box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); }
}
.question-box { padding: 1.25rem; background-color: var(--accent-color); border-radius: var(--border-radius); }
.question-box h3 { margin-bottom: 0; }
.text-primary { color: var(--primary-color); font-weight: 600; }
.full-width { width: 100%; }
.btn-success { background-color: #10b981 !important; }
.success-msg { color: #166534; font-size: 0.875rem; background-color: #dcfce7; padding: 0.75rem; border-radius: 12px; display: flex; align-items: center; gap: 0.5rem; }
.reveal-icon { font-size: 4rem; margin-bottom: 1rem; }
.my-answer { padding: 1rem; border-top: 1px solid #e2e8f0; }
.font-bold { font-weight: 700; }
.text-lg { font-size: 1.25rem; }
.italic { font-style: italic; }
.slideshow-view-mode { border-radius: 16px; background: rgba(255, 255, 255, 0.4); }
.view-icon { font-size: 2.5rem; margin-bottom: 0.5rem; }
</style>
