<template>
  <teleport to="body">
    <div class="lightbox-overlay" @click="$emit('close')">
      <button class="close-btn" @click="$emit('close')">✕</button>
      <div class="lightbox-inner">
        <img :src="src" class="lightbox-img" :alt="nickname" @click.stop />
        <div class="lightbox-caption" @click.stop>{{ nickname }} 的答案</div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'

defineProps({ src: String, nickname: String })
const emit = defineEmits(['close'])

const onKeyDown = (e) => {
  if (e.key === 'Escape') emit('close')
}
onMounted(() => window.addEventListener('keydown', onKeyDown))
onUnmounted(() => window.removeEventListener('keydown', onKeyDown))
</script>

<style scoped>
.lightbox-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.88);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(8px);
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.lightbox-inner {
  position: relative;
  max-width: 95vw;
  max-height: 95vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.lightbox-img {
  width: calc(95vw - 2rem);
  max-height: calc(95vh - 4rem);
  object-fit: contain;
  border-radius: 16px;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5);
  animation: popIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  display: block;
}

@keyframes popIn {
  from { transform: scale(0.85); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.lightbox-caption {
  color: rgba(255, 255, 255, 0.7);
  font-weight: 700;
  font-size: 0.9rem;
}

.close-btn {
  /* overlay 是 fixed，所以用 fixed 直接定位在右上角 */
  position: fixed;
  top: 1.25rem;
  right: 1.25rem;
  width: 40px;
  height: 40px;
  min-width: 40px;
  min-height: 40px;
  padding: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  border: 1.5px solid rgba(255, 255, 255, 0.35);
  color: white;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  line-height: 1;
  z-index: 10000;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: none;
  box-shadow: none;
}
</style>
