<script setup>
import { ref } from 'vue'
import Sidebar from '../components/dashboard/Sidebar.vue'
import DashboardHeader from '../components/dashboard/DashboardHeader.vue'
import { RouterView } from 'vue-router'

const isSidebarOpen = ref(false)

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const closeSidebar = () => {
  isSidebarOpen.value = false
}
</script>

<template>
  <div class="dashboard-layout">
    <div 
      class="sidebar-overlay" 
      :class="{ open: isSidebarOpen }"
      @click="closeSidebar"
    ></div>
    
    <Sidebar 
      :is-open="isSidebarOpen" 
      @close="closeSidebar"
    />
    
    <div class="main-content">
      <DashboardHeader @toggle-sidebar="toggleSidebar" />
      
      <main class="page-content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped>
.dashboard-layout {
  display: flex;
  min-height: 100vh;
  background-color: #F8FAFC;
  position: relative;
}

.main-content {
  flex: 1;
  margin-left: 260px; /* Width of sidebar */
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  transition: margin-left 0.3s ease;
}

.page-content {
  flex: 1;
  padding: clamp(1rem, 4vw, 2rem);
  padding-bottom: max(env(safe-area-inset-bottom, 0px), clamp(1rem, 4vw, 2rem));
  overflow-y: auto;
  min-width: 0;
}

.sidebar-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 45; /* Below sidebar (50) but above everything else */
  opacity: 0;
  transition: opacity 0.3s ease;
}

@media (max-width: 1024px) {
  .main-content {
    margin-left: 0;
  }
  
  .sidebar-overlay.open {
    display: block;
    opacity: 1;
  }
}
</style>
