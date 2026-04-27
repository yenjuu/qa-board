<template>
  <div class="container host-container">
    <div class="header-section fade-in">
      <div class="header-left">
        <p class="room-label">房間代碼: {{ roomId }}</p>
        <h2>主持人控制台</h2>
      </div>
      
      <div class="header-right">
        <div class="control-toolbar">
          <div class="join-info-bar glass">
            <span class="url-text">{{ shortJoinUrl }}</span>
            <div class="bar-actions">
              <button @click="copyToClipboard" class="btn-mini">{{ copyStatus }}</button>
              <button @click="showQRModal = true" class="btn-mini-icon" title="顯示 QR Code">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect><line x1="7" y1="7" x2="7.01" y2="7"></line><line x1="17" y1="7" x2="17.01" y2="7"></line><line x1="17" y1="17" x2="17.01" y2="17"></line><line x1="7" y1="17" x2="7.01" y2="17"></line></svg>
              </button>
            </div>
          </div>
          <button @click="showBankModal = true" class="btn-setup-premium">
            <span class="icon">⚙️</span> <span class="btn-text">出題設定</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 主顯示區 -->
    <div class="display-panel fade-in">
      <div class="active-question-card glass mb-4">
        <div class="flex-between mb-3 status-header">
          <div class="status-info">
            <span class="status-tag" :class="isCollecting ? 'collecting' : isRevealed ? 'revealed' : 'waiting'">
              {{ isCollecting ? '回答中' : isRevealed ? '已翻牌' : '準備中' }}
            </span>
            <span class="mode-badge" v-if="roomData?.selectedSetId">
              📚 {{ currentSet?.name }} ({{ (roomData?.currentQuestionIndex || 0) + 1 }} / {{ currentSet?.questions.length }})
            </span>
            <span class="mode-badge manual" v-else>
              🎤 即興模式
            </span>
          </div>
        </div>

        <div class="question-display text-center">
          <h1 v-if="roomData?.questionMode === 'written' && roomData?.questionText" class="fade-in">{{ roomData.questionText }}</h1>
          <h1 v-else-if="roomData?.questionMode === 'oral'" class="italic text-gray-500 fade-in">口頭詢問中...</h1>
          <h1 v-else class="text-gray-400 fade-in">等待主持人出題...</h1>
        </div>

        <div class="main-actions mt-4">
          <template v-if="roomData?.selectedSetId">
            <button v-if="!isCollecting && !isRevealed" @click="goNextQuestion" class="btn-primary btn-lg full-width shadow-primary">
              {{ roomData.currentQuestionIndex === -1 ? '🚀 開始第一題' : '發布下一題' }}
            </button>
            <div v-else-if="isCollecting" class="flex-gap">
              <button @click="revealAnswers" class="btn-danger btn-lg flex-1 shadow-danger">🃏 結束收集並翻牌</button>
            </div>
            <div v-else-if="isRevealed" class="flex-gap">
              <button @click="goNextQuestion" class="btn-primary btn-lg flex-1 shadow-primary" v-if="hasNextQuestion">
                下一題 ({{ (roomData.currentQuestionIndex || 0) + 2 }} / {{ currentSet?.questions.length }})
              </button>
              <button @click="resetRoom" class="btn-success btn-lg flex-1 shadow-success">🔄 重新開始本題</button>
            </div>
          </template>

          <template v-else>
            <div v-if="isCollecting" class="flex-gap">
              <button @click="revealAnswers" class="btn-danger btn-lg flex-1 shadow-danger">🃏 結束收集並翻牌</button>
            </div>
            <div v-else-if="isRevealed" class="flex-gap">
              <button @click="showBankModal = true" class="btn-primary btn-lg flex-1 shadow-primary">📢 出下一題</button>
              <button @click="resetRoom" class="btn-success btn-lg flex-1 shadow-success">🔄 重新開始本題</button>
            </div>
            <button v-else @click="showBankModal = true" class="btn-primary btn-lg full-width shadow-primary">
              🎤 點擊設定出題
            </button>
          </template>
        </div>
      </div>

      <div class="panel-header glass mb-3">
        <div class="status-row">
          <div class="status-title">
            <h3>回答狀況 <span class="count">({{ answers.length }} / {{ participants.length }})</span></h3>
          </div>
          <div class="mini-participant-list">
            <div v-for="p in participants" :key="p.nickname" class="mini-tag" :class="{ 'answered': hasAnswered(p.nickname) }">
              <span class="dot"></span>
              {{ p.nickname }}
            </div>
            <div v-if="participants.length === 0" class="empty-hint">等待加入...</div>
          </div>
        </div>
      </div>
      
      <div class="cards-grid">
        <AnswerCard 
          v-for="ans in sortedAnswers" 
          :key="ans.nickname" 
          :nickname="ans.nickname" 
          :answer="ans.answer" 
          :is-revealed="isRevealed"
        />
        <div v-if="answers.length === 0" class="empty-state-wrapper">
          <div class="empty-state-content glass">
            <div class="empty-icon">⏳</div>
            <p v-if="isCollecting" class="fade-in">等待第一個答案出現...</p>
            <p v-else-if="!isRevealed" class="fade-in">點擊上方按鈕開始場次</p>
          </div>
        </div>
      </div>
    </div>

    <!-- QR Code 彈窗 -->
    <QRModal 
      v-if="showQRModal" 
      :room-id="roomId" 
      :join-url="joinUrl" 
      @close="showQRModal = false" 
    />

    <!-- 出題設定彈窗 -->
    <QuestionBankModal
      v-if="showBankModal"
      :all-question-sets="allQuestionSets"
      :initial-data="roomData"
      @close="showBankModal = false"
      @confirm-bank="confirmBankMode"
      @confirm-manual="confirmManualMode"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'
import { useRoom } from '../composables/useRoom'
import AnswerCard from '../components/host/AnswerCard.vue'
import QRModal from '../components/host/QRModal.vue'
import QuestionBankModal from '../components/host/QuestionBankModal.vue'

const props = defineProps(['roomId'])

// Use Composable
const { roomData, participants, answers, updateRoomState, clearAnswers } = useRoom(props.roomId)

const joinUrl = computed(() => `${window.location.origin}/join/${props.roomId}`)
const shortJoinUrl = computed(() => {
  const url = joinUrl.value.replace(/^https?:\/\//, '')
  return url.length > 25 ? url.substring(0, 22) + '...' : url
})

const copyStatus = ref('複製')
const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(joinUrl.value)
    copyStatus.value = '✓'
    setTimeout(() => { copyStatus.value = '複製' }, 2000)
  } catch (err) { console.error(err) }
}

const isCollecting = computed(() => roomData.value?.status === 'collecting')
const isRevealed = computed(() => roomData.value?.status === 'revealed')
const showBankModal = ref(false)
const showQRModal = ref(false)

const allQuestionSets = ref([])

const currentSet = computed(() => allQuestionSets.value.find(s => s.id === roomData.value?.selectedSetId))
const hasNextQuestion = computed(() => currentSet.value && (roomData.value?.currentQuestionIndex ?? -1) < currentSet.value.questions.length - 1)

const sortedAnswers = computed(() => [...answers.value].sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0)))
const hasAnswered = (nickname) => answers.value.some(a => a.nickname === nickname)

onMounted(() => {
  onSnapshot(collection(db, 'questionSets'), (snapshot) => {
    allQuestionSets.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  })
})

const confirmBankMode = async (setId) => {
  await updateRoomState({ 
    selectedSetId: setId, 
    currentQuestionIndex: -1, 
    status: 'waiting', 
    questionText: '', 
    questionMode: 'written' 
  })
  showBankModal.value = false
}

const confirmManualMode = async ({ mode, text }) => {
  await clearAnswers()
  await updateRoomState({ 
    status: 'collecting', 
    selectedSetId: '', 
    currentQuestionIndex: -1, 
    questionMode: mode, 
    questionText: mode === 'written' ? text : '' 
  })
  showBankModal.value = false
}

const goNextQuestion = async () => {
  if (!currentSet.value) return
  await clearAnswers()
  const nextIndex = (roomData.value?.currentQuestionIndex ?? -1) + 1
  if (nextIndex < currentSet.value.questions.length) {
    const nextText = currentSet.value.questions[nextIndex]
    await updateRoomState({ status: 'collecting', questionMode: 'written', questionText: nextText, currentQuestionIndex: nextIndex })
  }
}

const revealAnswers = () => updateRoomState({ status: 'revealed' })
const resetRoom = async () => { await clearAnswers(); await updateRoomState({ status: 'waiting' }) }
</script>

<style scoped>
.flex-between { display: flex; justify-content: space-between; align-items: center; }
.flex-gap { display: flex; gap: 1rem; }
.flex-1 { flex: 1; }

.header-section { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem; }
.header-right { display: flex; flex-direction: column; align-items: flex-end; gap: 0.75rem; }

.control-toolbar { display: flex; align-items: center; gap: 0.75rem; }
.join-info-bar { display: flex; align-items: center; padding: 0.4rem 0.8rem; border-radius: 12px; background: rgba(255, 255, 255, 0.7); border: 1px solid #e2e8f0; gap: 0.5rem; }
.url-text { font-size: 0.8rem; font-weight: 700; color: #64748b; font-family: monospace; }
.bar-actions { display: flex; align-items: center; gap: 0.4rem; }
.btn-mini { padding: 0.25rem 0.5rem; background: var(--accent-color); color: var(--primary-color); border: none; font-size: 0.7rem; font-weight: 800; border-radius: 6px; cursor: pointer; }
.btn-mini-icon { background: white; border: 1px solid #e2e8f0; border-radius: 8px; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #64748b; padding: 0; }

.btn-setup-premium { display: flex; align-items: center; gap: 0.5rem; padding: 0.6rem 1.2rem; font-weight: 800; font-size: 0.9rem; color: white; background: linear-gradient(135deg, var(--primary-color) 0%, #4f46e5 100%); border: none; border-radius: 12px; cursor: pointer; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3); }

.room-label { font-size: 0.75rem; font-weight: 800; color: var(--primary-color); text-transform: uppercase; margin-bottom: 0.25rem; }
.active-question-card { padding: 3rem; border-radius: 32px; background: rgba(255, 255, 255, 0.85); box-shadow: 0 25px 50px -12px rgba(0,0,0,0.05); border: 1px solid rgba(255, 255, 255, 0.5); backdrop-filter: blur(20px); }
.question-display h1 { font-size: 3.5rem; font-weight: 900; margin: 1.5rem 0; line-height: 1.1; color: #1e293b; }
.status-tag { font-size: 0.75rem; padding: 0.4rem 1.2rem; border-radius: 999px; font-weight: 800; color: white; text-transform: uppercase; }
.status-tag.collecting { background: #10b981; }
.status-tag.revealed { background: var(--primary-color); }
.status-tag.waiting { background: #64748b; }
.mode-badge { font-size: 0.8rem; font-weight: 800; color: var(--primary-color); background: var(--accent-color); padding: 0.4rem 1.2rem; border-radius: 999px; margin-left: 0.5rem; }
.mode-badge.manual { background: #f1f5f9; color: #64748b; }

.btn-lg { padding: 1.25rem; font-size: 1.35rem; font-weight: 800; border-radius: 20px; border: none; cursor: pointer; }
.shadow-primary { box-shadow: 0 10px 20px -5px rgba(99, 102, 241, 0.4); }
.shadow-danger { box-shadow: 0 10px 20px -5px rgba(239, 68, 68, 0.4); }
.shadow-success { box-shadow: 0 10px 20px -5px rgba(16, 185, 129, 0.4); }

.panel-header { padding: 1.25rem 2rem; border-radius: 24px; background: rgba(255, 255, 255, 0.5); }
.status-row { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
.status-title h3 { font-size: 1.15rem; font-weight: 800; margin: 0; white-space: nowrap; }
.mini-participant-list { display: flex; gap: 0.5rem; overflow-x: auto; padding: 4px; flex: 1; justify-content: flex-end; }
.mini-tag { display: inline-flex; align-items: center; background: white; padding: 0.4rem 0.8rem; border-radius: 10px; font-size: 0.8rem; font-weight: 700; border: 1.5px solid #f1f5f9; white-space: nowrap; }
.mini-tag.answered { border-color: #10b981; background: #f0fdf4; color: #166534; }
.mini-tag .dot { width: 8px; height: 8px; border-radius: 50%; background: #e2e8f0; margin-right: 0.5rem; }
.mini-tag.answered .dot { background: #10b981; }

.cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 2rem; margin-top: 1.5rem; min-height: 200px; position: relative; }
.empty-state-wrapper { grid-column: 1 / -1; display: flex; justify-content: center; align-items: center; padding: 3rem 0; }
.empty-state-content { display: flex; flex-direction: column; align-items: center; gap: 1rem; padding: 2rem 4rem; border-radius: 24px; background: rgba(255, 255, 255, 0.4); color: #64748b; font-weight: 700; }
.empty-icon { font-size: 2.5rem; opacity: 0.5; }

/* 手機版適應 RWD */
@media (max-width: 768px) {
  .header-section { flex-direction: column; align-items: flex-start; gap: 1rem; margin-bottom: 1.5rem; }
  .header-right { width: 100%; align-items: stretch; }
  .control-toolbar { flex-direction: column-reverse; align-items: stretch; gap: 0.75rem; }
  .join-info-bar { width: 100%; justify-content: space-between; }
  .url-text { overflow: hidden; text-overflow: ellipsis; }
  .btn-setup-premium { justify-content: center; width: 100%; }
  
  .active-question-card { padding: 1.5rem; border-radius: 24px; }
  .question-display h1 { font-size: 2rem; }
  .status-header { flex-direction: column; align-items: flex-start; gap: 0.75rem; }
  .indicator-text { font-size: 0.75rem; }
  .btn-lg { padding: 1rem; font-size: 1.1rem; border-radius: 16px; }
  
  .status-row { flex-direction: column; align-items: flex-start; }
  .mini-participant-list { justify-content: flex-start; width: 100%; margin-top: 0.5rem; }
  
  .cards-grid { grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 1rem; }
}

@keyframes blink { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.2); opacity: 0.4; } }
.italic { font-style: italic; }
.full-width { width: 100%; }
.btn-primary { background: var(--primary-color); color: white; border: none; border-radius: 14px; font-weight: 800; cursor: pointer; }
.btn-danger { background: #ef4444; color: white; border: none; }
.btn-success { background: #10b981; color: white; border: none; }
</style>
