<template>
  <div class="side-panel">
    <div class="card mb-4 glass">
      <h3>新增題庫組</h3>
      <div class="input-with-button mt-2">
        <input 
          type="text" 
          v-model="newSetName" 
          placeholder="輸入題庫組名稱..." 
          @keyup.enter="handleCreate"
        />
        <button @click="handleCreate" :disabled="!newSetName.trim()" class="btn-primary">+</button>
      </div>
    </div>

    <div class="card glass">
      <h3>既有題庫組</h3>
      <div class="set-list mt-2">
        <div 
          v-for="set in questionSets" 
          :key="set.id" 
          class="set-item"
          :class="{ 'active': currentSetId === set.id }"
          @click="$emit('select', set.id)"
        >
          <span>{{ set.name }} ({{ set.questions?.length || 0 }})</span>
          <BaseDeleteButton @delete="handleDelete(set.id)" />
        </div>
        <div v-if="questionSets.length === 0" class="empty-text">尚無題庫組</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BaseDeleteButton from '../base/BaseDeleteButton.vue'

const props = defineProps({
  questionSets: Array,
  currentSetId: String
})

const emit = defineEmits(['select', 'create', 'delete'])

const newSetName = ref('')

const handleCreate = () => {
  if (!newSetName.value.trim()) return
  emit('create', newSetName.value)
  newSetName.value = ''
}

const handleDelete = (id) => {
  if (confirm('確定要刪除整個題庫組嗎？')) {
    emit('delete', id)
  }
}
</script>

<style scoped>
.set-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.set-item {
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s;
}

.set-item.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.set-item:hover:not(.active) {
  background: white;
  border-color: var(--primary-color);
}

.input-with-button {
  display: flex;
  gap: 0.5rem;
}

.input-with-button input {
  flex: 1;
}

.empty-text {
  text-align: center;
  color: #64748b;
  padding: 1rem;
  font-size: 0.9rem;
}
</style>
