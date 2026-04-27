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
      <div class="mt-4">
        <button @click="handleConfirmBank" class="btn-primary full-width" :disabled="!tempSelectedSetId">確認使用此題庫</button>
      </div>
    </div>

    <div v-else class="setup-card fade-in">
      <div class="section-title"><span class="num">1</span><h4>即時出題內容</h4></div>
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
import { ref, computed } from 'vue'
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

const tempSelectedSet = computed(() => props.allQuestionSets.find(s => s.id === tempSelectedSetId.value))

const handleConfirmBank = () => {
  emit('confirm-bank', tempSelectedSetId.value)
}

const handleConfirmManual = () => {
  emit('confirm-manual', {
    mode: tempQuestionMode.value,
    text: tempQuestionText.value
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

.premium-select { width: 100%; padding: 1rem; border-radius: 14px; border: 2px solid #e2e8f0; font-weight: 700; font-size: 1rem; cursor: pointer; }
.preview-area { background: white; border-radius: 16px; border: 1px solid #e2e8f0; max-height: 200px; overflow-y: auto; padding: 0.5rem; }
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
