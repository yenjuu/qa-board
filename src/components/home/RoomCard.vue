<template>
  <div class="room-item fade-in" @click="$emit('select', room.id)">
    <div class="room-info">
      <div class="room-id">{{ room.id }}</div>
      <div class="room-status" :class="room.status">
        {{ getStatusText(room.status) }}
      </div>
    </div>
    <BaseDeleteButton @delete="$emit('delete', room.id)" />
  </div>
</template>

<script setup>
import BaseDeleteButton from '../base/BaseDeleteButton.vue'

defineProps({
  room: Object
})

defineEmits(['select', 'delete'])

const getStatusText = (status) => {
  const map = {
    'waiting': '等待中',
    'collecting': '回答中',
    'revealed': '已揭曉'
  }
  return map[status] || '未知'
}
</script>

<style scoped>
.room-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.room-item:hover {
  background: white;
  transform: translateX(4px);
  border-color: var(--primary-color);
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.room-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.room-id {
  font-weight: 700;
  color: #1e293b;
}

.room-status {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 999px;
}

.room-status.waiting { background: #e0f2fe; color: #0369a1; }
.room-status.collecting { background: #dcfce7; color: #166534; }
.room-status.revealed { background: #f1f5f9; color: #475569; }
</style>
