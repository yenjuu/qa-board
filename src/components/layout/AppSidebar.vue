<template>
  <div>
    <!-- Backdrop -->
    <Transition name="fade">
      <div v-if="isOpen" class="sidebar-backdrop" @click="$emit('close')"></div>
    </Transition>

    <!-- Sidebar Content -->
    <Transition name="slide">
      <div v-if="isOpen" class="sidebar-container glass">
        <div class="sidebar-header">
          <div class="logo-small">
            <span class="logo-text">QA</span>
          </div>
          <h3>QA Board</h3>
          <button class="btn-close-sidebar" @click="$emit('close')">✕</button>
        </div>

        <nav class="sidebar-nav">
          <router-link to="/" class="nav-item" @click="$emit('close')">
            <span class="icon">🏠</span> 首頁
          </router-link>
          <router-link to="/questions" class="nav-item" @click="$emit('close')">
            <span class="icon">⚙️</span> 題庫管理系統
          </router-link>
        </nav>

        <div class="sidebar-footer">
          <p class="version-tag">v1.0.0</p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
defineProps({
  isOpen: Boolean
})
defineEmits(['close'])
</script>

<style scoped>
.sidebar-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(4px);
  z-index: 1000;
}

.sidebar-container {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 280px;
  background: rgba(255, 255, 255, 0.95);
  z-index: 1001;
  display: flex;
  flex-direction: column;
  box-shadow: 20px 0 50px rgba(0,0,0,0.1);
  border-right: 1px solid rgba(255,255,255,0.5);
}

.sidebar-header {
  padding: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border-bottom: 1px solid #f1f5f9;
  position: relative;
}

.logo-small {
  width: 40px;
  height: 40px;
  background: var(--primary-color);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-text {
  color: white;
  font-weight: 800;
  font-size: 1rem;
}

.sidebar-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 800;
  color: #1e293b;
}

.btn-close-sidebar {
  position: absolute;
  right: 1rem;
  top: 1rem;
  background: transparent;
  border: none;
  font-size: 1.2rem;
  color: #94a3b8;
  cursor: pointer;
  padding: 0.5rem;
}

.sidebar-nav {
  flex: 1;
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border-radius: 14px;
  text-decoration: none;
  color: #64748b;
  font-weight: 700;
  transition: all 0.2s;
}

.nav-item:hover {
  background: #f1f5f9;
  color: var(--primary-color);
  transform: translateX(5px);
}

.nav-item.router-link-active {
  background: var(--accent-color);
  color: var(--primary-color);
}

.sidebar-footer {
  padding: 1.5rem;
  border-top: 1px solid #f1f5f9;
}

.version-tag {
  font-size: 0.75rem;
  color: #94a3b8;
  font-weight: 600;
  text-align: center;
}

/* Transitions */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-enter-active, .slide-leave-active { transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-enter-from, .slide-leave-to { transform: translateX(-100%); }
</style>
