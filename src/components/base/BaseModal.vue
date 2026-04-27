<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content glass fade-in-up" :class="extraClass">
      <div class="modal-header">
        <div class="title-section">
          <slot name="header">
            <h3>{{ title }}</h3>
          </slot>
        </div>
        <button @click="$emit('close')" class="btn-close-large">✕</button>
      </div>
      
      <div class="modal-body">
        <slot></slot>
      </div>

      <div v-if="$slots.footer" class="modal-footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  extraClass: String
})
defineEmits(['close'])
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 1rem;
}

.modal-content {
  width: 100%;
  max-width: 580px;
  background: #ffffff;
  border-radius: 36px;
  padding: 2rem;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.btn-close-large {
  background: #f1f5f9;
  border: none;
  width: 44px;
  height: 44px;
  border-radius: 14px;
  cursor: pointer;
  font-size: 1.25rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  color: #64748b;
}

.btn-close-large:hover {
  background: #e2e8f0;
  color: #1e293b;
  transform: scale(0.95);
}

.modal-body {
  width: 100%;
}

.title-section h3 {
  font-size: 1.5rem;
  font-weight: 800;
  color: #1e293b;
  margin: 0;
}
</style>
