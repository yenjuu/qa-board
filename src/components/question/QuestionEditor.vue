<template>
  <div class="main-panel">
    <div v-if="currentSet" class="card glass h-full">
      <div class="flex-between mb-4">
        <h3>編輯內容：{{ currentSet.name }}</h3>
      </div>
      
      <div class="add-question-area mb-4">
        <label class="text-sm font-semibold mb-1 block">新增題目</label>
        <div class="input-with-button">
          <input 
            type="text" 
            v-model="newQuestionText" 
            placeholder="輸入問題內容..." 
            @keyup.enter="handleAdd"
          />
          <button @click="handleAdd" :disabled="!newQuestionText.trim()" class="btn-primary">新增</button>
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

const handleAdd = () => {
  if (!newQuestionText.value.trim()) return
  emit('add-question', newQuestionText.value)
  newQuestionText.value = ''
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

.input-with-button input {
  flex: 1;
}
</style>
