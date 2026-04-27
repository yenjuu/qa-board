<template>
  <div class="answer-card" :class="{ 'revealed': isRevealed }">
    <div class="card-inner">
      <div class="card-front">
        <div class="avatar">{{ nickname.charAt(0) }}</div>
        <span class="nickname">{{ nickname }}</span>
        <span class="status-badge">已提交</span>
      </div>
      <div class="card-back">
        <span class="nickname-back">{{ nickname }}</span>
        <div class="answer-content">
          <p class="answer-text">{{ answer }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  nickname: String,
  answer: String,
  isRevealed: Boolean
})
</script>

<style scoped>
.answer-card {
  height: 180px;
  perspective: 1000px;
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform-style: preserve-3d;
}

.answer-card.revealed .card-inner {
  transform: rotateY(180deg);
}

.card-front, .card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 28px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1.5rem;
  box-shadow: 0 10px 30px -10px rgba(0,0,0,0.1);
}

.card-front {
  background: white;
  border: 1px solid #f1f5f9;
}

.card-back {
  background: white;
  transform: rotateY(180deg);
  border: 4px solid var(--primary-color);
}

.avatar {
  width: 64px;
  height: 64px;
  background: var(--primary-color);
  color: white;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 900;
  margin-bottom: 1rem;
}

.nickname {
  font-weight: 700;
  color: #64748b;
}

.status-badge {
  margin-top: 0.5rem;
  font-size: 0.7rem;
  font-weight: 800;
  color: #10b981;
  background: #f0fdf4;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
}

.nickname-back {
  position: absolute;
  top: 1rem;
  left: 1.5rem;
  font-size: 0.75rem;
  font-weight: 800;
  color: var(--primary-color);
  opacity: 0.6;
}

.answer-text {
  font-size: 1.5rem;
  font-weight: 900;
  text-align: center;
  color: #1e293b;
  word-break: break-all;
}

@media (max-width: 768px) {
  .answer-card { height: 140px; }
  .answer-text { font-size: 1.1rem; }
  .avatar { width: 48px; height: 48px; font-size: 1.5rem; }
}
</style>
