<template>
  <div class="main-panel">
    <div v-if="currentSet" class="card glass h-full">
      <div class="flex-between mb-4">
        <h3>編輯內容：{{ currentSet.name }}</h3>
      </div>
      
      <div class="add-question-area mb-4">
        <div class="flex-between mb-2">
          <label class="text-sm font-semibold text-gray-700">新增題目</label>
          <div class="mini-tabs">
            <button 
              :class="{ 'active': !isBulkMode }" 
              @click="isBulkMode = false"
            >單筆</button>
            <button 
              :class="{ 'active': isBulkMode }" 
              @click="isBulkMode = true"
            >批次</button>
          </div>
        </div>

        <div v-if="!isBulkMode" class="input-with-button fade-in">
          <input 
            type="text" 
            v-model="newQuestionText" 
            placeholder="輸入問題內容..." 
            class="premium-input"
            @keyup.enter="handleAdd"
          />
          <button @click="handleAdd" :disabled="!newQuestionText.trim()" class="btn-primary">新增</button>
        </div>
        
        <div v-else class="bulk-input-area fade-in">
          <textarea 
            v-model="bulkText" 
            placeholder="直接貼上一大段文字，我們會根據換行自動拆分問題..." 
            class="premium-textarea"
          ></textarea>
          <div class="flex-end mt-2">
            <button 
              @click="handleAdd" 
              :disabled="!bulkText.trim()" 
              class="btn-primary px-5"
            >
              確認批量新增
            </button>
          </div>
        </div>
      </div>

      <div class="questions-list">
        <div v-for="(q, index) in currentSet.questions" :key="index" class="question-item">
          <span class="index">{{ index + 1 }}</span>
          <span class="text">{{ q }}</span>
          <BaseDeleteButton @delete="$emit('remove-question', index)" />
        </div>
        <div v-if="!currentSet.questions || currentSet.questions.length === 0" class="empty-state-inner">
          此題庫組目前沒有題目，請從上方新增。
        </div>
      </div>
    </div>
    <div v-else class="card glass flex-center h-full">
      <p class="text-gray-500">請從左側選擇或建立一個題庫組來開始編輯</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BaseDeleteButton from '../base/BaseDeleteButton.vue'

const props = defineProps({
  currentSet: Object
})

const emit = defineEmits(['add-question', 'remove-question'])

const newQuestionText = ref('')
const bulkText = ref('')
const isBulkMode = ref(false)

const handleAdd = () => {
  if (isBulkMode.value) {
    const questions = bulkText.value
      .split('\n')
      .map(q => q.trim())
      // 移除前導數字以及常見的分隔符號 (如 1. 2: 3、 等)
      .map(q => q.replace(/^\s*\d+[\s.\/\\:：、）)]*\s*/, ''))
      .filter(q => q.length > 0)
    
    if (questions.length > 0) {
      emit('add-question', questions)
      bulkText.value = ''
      isBulkMode.value = false
    }
  } else {
    if (!newQuestionText.value.trim()) return
    emit('add-question', newQuestionText.value.trim())
    newQuestionText.value = ''
  }
}
</script>

<style scoped>
.questions-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.question-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  background: white;
  border: 1px solid #f1f5f9;
  border-radius: 12px;
  gap: 1rem;
}

.question-item .index {
  font-weight: 700;
  color: var(--primary-color);
  width: 24px;
}

.question-item .text {
  flex: 1;
  font-weight: 500;
}

.empty-state-inner {
  text-align: center;
  padding: 3rem;
  color: #64748b;
  font-style: italic;
}

.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.h-full { height: 100%; }

.input-with-button {
  display: flex;
  gap: 0.5rem;
}

.input-with-button {
  display: flex;
  gap: 0.5rem;
}

.premium-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  border: 2px solid #f1f5f9;
  background: #f8fafc;
  font-weight: 500;
  transition: all 0.2s;
}

.premium-input:focus {
  outline: none;
  border-color: var(--primary-color);
  background: white;
}

.mini-tabs {
  display: flex;
  background: #f1f5f9;
  padding: 0.25rem;
  border-radius: 10px;
  gap: 0.25rem;
}

.mini-tabs button {
  padding: 0.35rem 0.75rem;
  border: none;
  border-radius: 7px;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  background: transparent;
  color: #64748b;
}

.mini-tabs button.active {
  background: white;
  color: var(--primary-color);
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}

.premium-textarea {
  width: 100%;
  height: 150px;
  padding: 1rem;
  border-radius: 16px;
  border: 2px solid #f1f5f9;
  background: #f8fafc;
  font-family: inherit;
  font-size: 0.95rem;
  resize: none;
  transition: all 0.2s;
}

.premium-textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  background: white;
}

.flex-end {
  display: flex;
  justify-content: flex-end;
}

.px-5 {
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}
</style>
