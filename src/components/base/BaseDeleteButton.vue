<template>
  <button class="btn-delete-base" @click.stop="$emit('delete')">
    <span class="icon">✕</span>
  </button>
</template>

<script setup>
defineEmits(['delete'])
</script>

<style scoped>
.btn-delete-base {
  background: transparent !important;
  border: none !important;
  color: #94a3b8 !important;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.8rem;
  padding: 0;
  flex-shrink: 0;
  box-shadow: none !important;
  transform: none !important;
}

.btn-delete-base:hover {
  background: #fee2e2 !important;
  color: #ef4444 !important;
}

.btn-delete-base .icon {
  line-height: 1;
}
</style>
