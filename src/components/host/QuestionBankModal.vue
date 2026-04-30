<template>
  <BaseModal title="出題模式設定" @close="$emit('close')">
    <template #header>
      <div class="title-with-icon">
        <span class="icon-circle">⚙️</span>
        <div>
          <h3>出題模式設定</h3>
          <p class="subtitle">選擇使用自動題庫或現場即興出題</p>
        </div>
      </div>
    </template>

    <div class="mode-tabs mb-4">
      <button :class="{ 'active': activeTab === 'bank' }" @click="activeTab = 'bank'">📚 題庫模式</button>
      <button :class="{ 'active': activeTab === 'manual' }" @click="activeTab = 'manual'">🎤 即興模式</button>
    </div>

    <div v-if="activeTab === 'bank'" class="setup-card fade-in">
      <div class="section-title"><span class="num">1</span><h4>選擇題庫組</h4></div>
      <select v-model="tempSelectedSetId" class="premium-select mb-3">
        <option value="">-- 請選擇題庫組 --</option>
        <option v-for="set in allQuestionSets" :key="set.id" :value="set.id">
          {{ set.name }} ({{ set.questions?.length || 0 }} 題)
        </option>
      </select>
      <div v-if="tempSelectedSet" class="preview-area">
        <div class="bank-list-premium">
          <div v-for="(q, index) in tempSelectedSet.questions" :key="index" class="bank-item-premium">
            <span class="q-index">{{ index + 1 }}</span>
            <span class="q-text">{{ q }}</span>
          </div>
        </div>
      </div>

      <div class="section-divider my-4"></div>

      <div class="section-title"><span class="num">2</span><h4>回答類型</h4></div>
      <div class="display-mode-grid mb-3">
        <div
          class="mode-option"
          :class="{ 'active': tempAnswerType === 'text' }"
          @click="tempAnswerType = 'text'"
        >
          <div class="mode-icon">⌨️</div>
          <div class="mode-info">
            <div class="mode-name">文字輸入</div>
            <div class="mode-desc">參與者用鍵盤回答</div>
          </div>
        </div>
        <div
          class="mode-option"
          :class="{ 'active': tempAnswerType === 'drawing' }"
          @click="tempAnswerType = 'drawing'"
        >
          <div class="mode-icon">🖌️</div>
          <div class="mode-info">
            <div class="mode-name">手繪回答</div>
            <div class="mode-desc">參與者用畫的回答</div>
          </div>
        </div>
      </div>

      <div class="section-divider my-4"></div>

      <div class="section-title"><span class="num">3</span><h4>顯示方式設定</h4></div>
      <div class="display-mode-grid mb-3">
        <div 
          class="mode-option" 
          :class="{ 'active': tempDisplayMode === 'manual' }"
          @click="tempDisplayMode = 'manual'"
        >
          <div class="mode-icon">✋</div>
          <div class="mode-info">
            <div class="mode-name">手動顯示</div>
            <div class="mode-desc">主持人手動切換</div>
          </div>
        </div>
        <div 
          class="mode-option" 
          :class="{ 'active': tempDisplayMode === 'auto' }"
          @click="tempDisplayMode = 'auto'"
        >
          <div class="mode-icon">⏱️</div>
          <div class="mode-info">
            <div class="mode-name">自動播放</div>
            <div class="mode-desc">倒數後自動跳題</div>
          </div>
        </div>
      </div>

      <div v-if="tempDisplayMode === 'auto'" class="auto-config-box fade-in">
        <div class="flex-between mb-2">
          <label class="config-label">每題停留時間</label>
          <span class="value-badge">{{ tempAutoSeconds }} 秒</span>
        </div>
        <input type="range" v-model="tempAutoSeconds" min="3" max="60" step="1" class="premium-range mb-3">
        
        <label class="checkbox-wrapper mb-2">
          <input type="checkbox" v-model="tempSkipAnswering">
          <span class="checkmark"></span>
          僅顯示題目 (不需回答)
        </label>
        
        <label class="checkbox-wrapper">
          <input type="checkbox" v-model="tempRandomOrder">
          <span class="checkmark"></span>
          隨機出題 (打亂順序)
        </label>
      </div>

      <div class="mt-4">
        <button @click="handleConfirmBank" class="btn-primary full-width" :disabled="!tempSelectedSetId">確認並開始出題</button>
      </div>
    </div>

    <div v-else class="setup-card fade-in">
      <div class="section-title"><span class="num">1</span><h4>回答類型</h4></div>
      <div class="display-mode-grid mb-3">
        <div
          class="mode-option"
          :class="{ 'active': tempAnswerType === 'text' }"
          @click="tempAnswerType = 'text'"
        >
          <div class="mode-icon">⌨️</div>
          <div class="mode-info">
            <div class="mode-name">文字輸入</div>
            <div class="mode-desc">參與者用鍵盤回答</div>
          </div>
        </div>
        <div
          class="mode-option"
          :class="{ 'active': tempAnswerType === 'drawing' }"
          @click="tempAnswerType = 'drawing'"
        >
          <div class="mode-icon">🖌️</div>
          <div class="mode-info">
            <div class="mode-name">手繪回答</div>
            <div class="mode-desc">參與者用畫的回答</div>
          </div>
        </div>
      </div>

      <div class="section-divider my-4"></div>

      <div class="section-title"><span class="num">2</span><h4>即時出題內容</h4></div>
      <div class="mode-toggle-group mb-3">
        <button :class="{ 'active': tempQuestionMode === 'oral' }" @click="tempQuestionMode = 'oral'">🎤 口頭</button>
        <button :class="{ 'active': tempQuestionMode === 'written' }" @click="tempQuestionMode = 'written'">✍️ 文字</button>
      </div>
      <div v-if="tempQuestionMode === 'written'" class="textarea-wrapper fade-in">
        <textarea v-model="tempQuestionText" placeholder="輸入臨時題目內容..." class="premium-textarea"></textarea>
      </div>
      <div class="mt-4">
        <button @click="handleConfirmManual" class="btn-primary full-width" :disabled="tempQuestionMode === 'written' && !tempQuestionText">🚀 發布題目</button>
      </div>
    </div>
  </BaseModal>
</template>

<script setup>
import { computed, ref } from 'vue'
import BaseModal from '../base/BaseModal.vue'

const props = defineProps({
  allQuestionSets: Array,
  initialData: Object
})

const emit = defineEmits(['close', 'confirm-bank', 'confirm-manual'])

const activeTab = ref(props.initialData?.selectedSetId ? 'bank' : 'manual')
const tempSelectedSetId = ref(props.initialData?.selectedSetId || '')
const tempQuestionMode = ref(props.initialData?.questionMode || 'oral')
const tempQuestionText = ref(props.initialData?.questionText || '')

// New settings
const tempDisplayMode = ref(props.initialData?.displayMode || 'manual')
const tempAutoSeconds = ref(props.initialData?.autoSeconds || 10)
const tempSkipAnswering = ref(props.initialData?.skipAnswering || false)
const tempRandomOrder = ref(props.initialData?.randomOrder || false)
const tempAnswerType = ref(props.initialData?.answerType || 'text')

const tempSelectedSet = computed(() => props.allQuestionSets.find(s => s.id === tempSelectedSetId.value))

const handleConfirmBank = () => {
  emit('confirm-bank', {
    setId: tempSelectedSetId.value,
    displayMode: tempDisplayMode.value,
    autoSeconds: parseInt(tempAutoSeconds.value),
    skipAnswering: tempSkipAnswering.value,
    randomOrder: tempRandomOrder.value,
    answerType: tempAnswerType.value
  })
}

const handleConfirmManual = () => {
  emit('confirm-manual', {
    mode: tempQuestionMode.value,
    text: tempQuestionText.value,
    answerType: tempAnswerType.value
  })
}
</script>

<style scoped>
.title-with-icon { display: flex; align-items: center; gap: 1rem; }
.icon-circle { width: 48px; height: 48px; background: var(--accent-color); border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; }
.subtitle { font-size: 0.85rem; color: #64748b; margin-top: 0.25rem; }

.mode-tabs { display: flex; background: #f1f5f9; padding: 0.4rem; border-radius: 16px; gap: 0.4rem; }
.mode-tabs button { flex: 1; padding: 0.75rem; border: none; border-radius: 12px; font-weight: 700; cursor: pointer; transition: all 0.2s; background: transparent; color: #64748b; }
.mode-tabs button.active { background: white; color: var(--primary-color); box-shadow: 0 4px 12px rgba(0,0,0,0.05); }

.setup-card { background: #f8fafc; border-radius: 24px; padding: 1.5rem; border: 1px solid #e2e8f0; }
.section-title { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem; }
.section-title h4 { margin: 0; font-size: 1rem; font-weight: 800; }
.num { width: 24px; height: 24px; background: var(--primary-color); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 900; }

.section-divider { height: 1px; background: #e2e8f0; margin: 1.5rem 0; }
.display-mode-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
.mode-option { 
  padding: 1rem; border: 2px solid #e2e8f0; border-radius: 16px; 
  cursor: pointer; transition: all 0.2s; display: flex; gap: 0.75rem; align-items: center;
  background: white;
}
.mode-option.active { border-color: var(--primary-color); background: var(--accent-color); }
.mode-icon { font-size: 1.5rem; }
.mode-name { font-weight: 800; color: #1e293b; font-size: 0.9rem; }
.mode-desc { font-size: 0.7rem; color: #64748b; }

.auto-config-box { background: white; padding: 1rem; border-radius: 16px; border: 1px solid #e2e8f0; margin-top: 0.5rem; }
.config-label { font-size: 0.85rem; font-weight: 700; color: #64748b; }
.value-badge { background: var(--primary-color); color: white; padding: 0.2rem 0.6rem; border-radius: 8px; font-size: 0.8rem; font-weight: 800; }

.premium-range { width: 100%; height: 6px; border-radius: 3px; accent-color: var(--primary-color); cursor: pointer; }

.checkbox-wrapper { display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; font-weight: 700; color: #475569; cursor: pointer; }
.flex-between { display: flex; justify-content: space-between; align-items: center; }

.premium-select { width: 100%; padding: 1rem; border-radius: 14px; border: 2px solid #e2e8f0; font-weight: 700; font-size: 1rem; cursor: pointer; }
.preview-area { background: white; border-radius: 16px; border: 1px solid #e2e8f0; max-height: 150px; overflow-y: auto; padding: 0.5rem; }
.bank-item-premium { display: flex; gap: 0.75rem; padding: 0.75rem; border-bottom: 1px solid #f1f5f9; }
.q-index { font-weight: 800; color: var(--primary-color); }
.q-text { font-weight: 500; color: #1e293b; }

.mode-toggle-group { display: flex; gap: 0.5rem; }
.mode-toggle-group button { flex: 1; padding: 0.75rem; border-radius: 12px; border: 2px solid #e2e8f0; background: white; font-weight: 700; cursor: pointer; color: #64748b; }
.mode-toggle-group button.active { border-color: var(--primary-color); color: var(--primary-color); background: var(--accent-color); }

.premium-textarea { width: 100%; height: 120px; padding: 1rem; border-radius: 16px; border: 2px solid #e2e8f0; font-family: inherit; font-size: 1rem; font-weight: 500; resize: none; margin-top: 0.5rem; }

.btn-primary { background: var(--primary-color); color: white; border: none; border-radius: 14px; font-weight: 800; cursor: pointer; padding: 1rem; font-size: 1rem; }
.full-width { width: 100%; }
</style>
