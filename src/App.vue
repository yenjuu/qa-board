<template>
  <div class="app-wrapper">
    <!-- Hamburger Button -->
    <button class="hamburger-btn glass" @click="isSidebarOpen = true" v-if="!isParticipantView">
      <div class="bar"></div>
      <div class="bar"></div>
      <div class="bar"></div>
    </button>

    <!-- Sidebar Component -->
    <AppSidebar :is-open="isSidebarOpen" @close="isSidebarOpen = false" />

    <!-- Main Content -->
    <main :class="{ 'has-sidebar-btn': !isParticipantView }">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import AppSidebar from './components/layout/AppSidebar.vue'

const isSidebarOpen = ref(false)
const route = useRoute()

// Hide sidebar button on participant view to avoid distraction
const isParticipantView = computed(() => {
  return ['Participant', 'Join'].includes(route.name)
})
</script>

<style>
.app-wrapper {
  position: relative;
  min-height: 100vh;
}

.hamburger-btn {
  position: fixed;
  top: 1.5rem;
  left: 1.5rem;
  z-index: 900;
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.hamburger-btn:hover {
  background: white;
  transform: scale(1.05);
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
}

.hamburger-btn .bar {
  width: 22px;
  height: 2.5px;
  background: var(--primary-color);
  border-radius: 2px;
  transition: all 0.3s;
}

.hamburger-btn:hover .bar:nth-child(2) {
  transform: translateX(3px);
}

.has-sidebar-btn {
  padding-top: 5rem;
}

@media (max-width: 768px) {
  .has-sidebar-btn {
    padding-top: 6rem;
  }
}
</style>
