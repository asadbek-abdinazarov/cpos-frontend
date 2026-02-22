<script setup>
import { ref } from 'vue'
import { Search, Bell, HelpCircle, Menu } from 'lucide-vue-next'

const emit = defineEmits(['toggle-sidebar'])
const searchQuery = ref('')
</script>

<template>
  <header class="dashboard-header">
    <div class="header-left">
      <button class="menu-btn" @click="$emit('toggle-sidebar')">
        <Menu class="icon-md" />
      </button>

      <div class="search-bar">
        <Search class="search-icon" />
        <input type="text" placeholder="Search..." v-model="searchQuery" />
      </div>
    </div>

    <div class="header-actions">
      <button class="icon-btn notification-btn">
        <Bell class="icon-md" />
        <span class="badge">3</span>
      </button>
      <button class="icon-btn">
        <HelpCircle class="icon-md" />
      </button>
    </div>
  </header>
</template>

<style scoped>
.dashboard-header {
  height: 70px;
  background: white;
  border-bottom: 1px solid #E2E8F0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  position: sticky;
  top: 0;
  z-index: 40;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.menu-btn {
  display: none;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  color: #64748B;
  border-radius: 8px;
}

.menu-btn:hover {
  background-color: #F1F5F9;
  color: #0F172A;
}

.search-bar {
  display: flex;
  align-items: center;
  background: #F1F5F9;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  width: 300px;
  gap: 0.75rem;
}

.search-icon {
  width: 18px;
  height: 18px;
  color: #94A3B8;
}

.search-bar input {
  background: transparent;
  border: none;
  outline: none;
  width: 100%;
  font-size: 0.95rem;
  color: #0F172A;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.icon-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.6rem;
  border-radius: 50%;
  transition: background 0.2s;
  position: relative;
  color: #64748B;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-btn:hover {
  background-color: #F1F5F9;
  color: #0F172A;
}

.icon-md {
  width: 22px;
  height: 22px;
}

.badge {
  position: absolute;
  top: 2px;
  right: 2px;
  background: #EF4444;
  color: white;
  font-size: 0.7rem;
  padding: 2px 5px;
  border-radius: 10px;
  border: 2px solid white;
  min-width: 16px;
  text-align: center;
}

@media (max-width: 1024px) {
  .menu-btn {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .search-bar {
    display: none; /* Hide search on mobile for cleaner look, or reduce width */
  }
  
  .dashboard-header {
    padding: 0 1rem;
  }
}
</style>
