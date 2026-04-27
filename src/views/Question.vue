<template>
  <div class="container question-page fade-in">
    <div class="header-section mb-4">
      <div class="flex-between">
        <div class="header-title">
          <p class="room-label">系統設定</p>
          <h2>題庫管理系統</h2>
        </div>
      </div>
      <p class="text-gray-500">預先設定好題目，在不同的場次中快速切換。</p>
    </div>

    <div class="grid-layout">
      <!-- 左側：題庫組列表 -->
      <QuestionSetList 
        :question-sets="questionSets" 
        :current-set-id="currentSetId"
        @select="currentSetId = $event"
        @create="createSet"
        @delete="deleteSet"
      />

      <!-- 右側：題目內容管理 -->
      <QuestionEditor 
        :current-set="currentSet"
        @add-question="handleAddQuestion"
        @remove-question="handleRemoveQuestion"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useQuestionSets } from '../composables/useQuestionSets'
import QuestionSetList from '../components/question/QuestionSetList.vue'
import QuestionEditor from '../components/question/QuestionEditor.vue'

const { questionSets, createSet, deleteSet, addQuestion, removeQuestion } = useQuestionSets()

const currentSetId = ref(null)

const currentSet = computed(() => {
  return questionSets.value.find(s => s.id === currentSetId.value)
})

const handleAddQuestion = (text) => {
  if (currentSetId.value) {
    addQuestion(currentSetId.value, text)
  }
}

const handleRemoveQuestion = (index) => {
  if (currentSetId.value && currentSet.value) {
    removeQuestion(currentSetId.value, currentSet.value.questions, index)
  }
}
</script>

<style scoped>
.question-page {
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
}

.header-section {
  padding: 1.5rem 2rem;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 24px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 10px 30px -10px rgba(0,0,0,0.05);
}

.room-label {
  font-size: 0.75rem;
  font-weight: 800;
  color: var(--primary-color);
  text-transform: uppercase;
  margin-bottom: 0.25rem;
}

.btn-back {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  border-radius: 14px;
  text-decoration: none;
  color: #64748b;
  font-weight: 700;
  font-size: 0.9rem;
  transition: all 0.2s;
  background: white;
  border: 1px solid #e2e8f0;
}

.btn-back:hover {
  background: var(--primary-color);
  color: white;
  transform: translateX(-4px);
  border-color: var(--primary-color);
  box-shadow: 0 10px 20px -5px rgba(99, 102, 241, 0.3);
}

.btn-back .icon {
  font-size: 1.1rem;
}

.grid-layout {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 2rem;
  min-height: 400px;
}

:deep(.card) {
  padding: 1.75rem;
}

.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

@media (max-width: 850px) {
  .grid-layout {
    grid-template-columns: 1fr;
  }
}
</style>
