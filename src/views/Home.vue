<template>
  <div class="home-container">
    <div class="hero-section fade-in">
      <div class="logo-circle">
        <span class="logo-text">QA</span>
      </div>
      <h1>QA Board</h1>
      <p class="subtitle text-gray-500">極簡、優雅、即時的問答展示平台</p>
    </div>

    <div class="grid-main fade-in">
      <!-- 左側：手動輸入區 -->
      <div class="card main-card glass">
        <h3 class="mb-4">開始新場次</h3>
        <div class="input-group mb-4">
          <label class="text-sm font-semibold mb-1 block">房間代碼</label>
          <div class="input-with-button">
            <input 
              type="text" 
              v-model="roomName" 
              placeholder="例如：PROJECT-X" 
              @keyup.enter="handleCreate"
            />
            <button @click="roomName = generateRandomId()" class="btn-secondary btn-small" title="隨機產生">
              🎲
            </button>
          </div>
        </div>
        
        <div class="button-stack">
          <button 
            @click="handleCreate" 
            :disabled="!roomName.trim() || isLoading" 
            class="full-width btn-hero"
          >
            {{ isLoading ? '建立中...' : '建立新房間' }}
          </button>
        </div>
      </div>

      <!-- 右側：既有房間列表 -->
      <div class="card list-card glass">
        <div class="list-header">
          <h3>既有房間</h3>
          <button @click="fetchRooms" class="btn-refresh" :disabled="isFetching" title="重新整理">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              stroke-width="2.5" 
              stroke-linecap="round" 
              stroke-linejoin="round"
              :class="{ 'spinning': isFetching }"
            >
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
              <path d="M21 3v5h-5"></path>
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
              <path d="M3 21v-5h5"></path>
            </svg>
          </button>
        </div>
        
        <div class="room-list-container">
          <div v-if="existingRooms.length > 0" class="room-grid">
            <RoomCard 
              v-for="room in existingRooms" 
              :key="room.id" 
              :room="room"
              @select="selectRoom"
              @delete="deleteRoom"
            />
          </div>
          <div v-else-if="!isFetching" class="empty-list">
            <p class="text-sm text-gray-500">目前沒有開啟中的房間</p>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useHome } from '../composables/useHome'
import RoomCard from '../components/home/RoomCard.vue'

const router = useRouter()
const { isLoading, isFetching, existingRooms, fetchRooms, createRoom, deleteRoom, generateRandomId } = useHome()

const roomName = ref('')

const handleCreate = () => {
  createRoom(roomName.value)
}

const selectRoom = (id) => {
  router.push(`/host/${id}`)
}


onMounted(() => {
  fetchRooms()
})
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: radial-gradient(circle at top right, #eef2ff 0%, #f8fafc 50%);
}

.hero-section {
  text-align: center;
  margin-bottom: 3rem;
}

.logo-circle {
  width: 80px;
  height: 80px;
  background: var(--primary-color);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  box-shadow: 0 20px 25px -5px rgba(99, 102, 241, 0.3);
  transform: rotate(-10deg);
}

.logo-text {
  color: white;
  font-size: 2rem;
  font-weight: 800;
}

.grid-main {
  display: grid;
  grid-template-columns: 400px 450px;
  gap: 2rem;
  width: 100%;
  max-width: 900px;
}

.main-card, .list-card {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.btn-refresh {
  background: transparent;
  color: #94a3b8;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  padding: 0;
}

.btn-refresh:hover:not(:disabled) {
  background: var(--accent-color);
  color: var(--primary-color);
}

.spinning {
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.room-list-container {
  flex: 1;
  overflow-y: auto;
  max-height: 300px;
  padding-right: 0.5rem;
}

.room-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
}

.input-with-button {
  display: flex;
  gap: 0.5rem;
}

.input-with-button input {
  flex: 1;
}

.btn-small {
  padding: 0 1rem;
  font-size: 1.25rem;
  background-color: var(--accent-color);
  color: var(--text-color);
  border: 1px solid #e2e8f0;
}

.button-stack {
  padding-top: 0.5rem;
}

.btn-hero {
  padding: 1rem;
  font-size: 1.125rem;
  background: linear-gradient(135deg, var(--primary-color), #4f46e5);
  color: white;
  border: none;
  border-radius: 16px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 10px 20px -5px rgba(99, 102, 241, 0.4);
  transition: all 0.2s;
}

.btn-hero:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 15px 25px -5px rgba(99, 102, 241, 0.5);
}

.btn-secondary-outline {
  display: none;
}

.btn-manage-mini {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.5rem 1rem;
  border-radius: 10px;
  color: #94a3b8;
  font-weight: 700;
  font-size: 0.8rem;
  text-decoration: none;
  transition: all 0.2s;
  margin-top: auto;
}

.btn-manage-mini:hover {
  color: var(--primary-color);
  background: var(--accent-color);
}

.full-width {
  width: 100%;
}


.empty-list {
  text-align: center;
  padding-top: 3rem;
}

@media (max-width: 900px) {
  .grid-main {
    grid-template-columns: 1fr;
    max-width: 450px;
  }
}
</style>
