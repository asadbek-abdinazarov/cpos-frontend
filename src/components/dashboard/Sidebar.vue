<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { 
  LayoutDashboard, 
  TrendingUp, 
  Package, 
  ShoppingBag, 
  Users, 
  Settings,
  X 
} from 'lucide-vue-next'
import { ref } from 'vue'
import UserProfileDialog from './UserProfileDialog.vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const route = useRoute()
const { t } = useI18n()

// This will eventually come from i18n
const menuItems = [
  { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Analytics', path: '/dashboard/analytics', icon: TrendingUp },
  { name: 'Products', path: '/dashboard/products', icon: Package },
  { name: 'Store', path: '/dashboard/store', icon: ShoppingBag },
  { name: 'Customers', path: '/dashboard/customers', icon: Users },
  { name: 'Settings', path: '/dashboard/settings', icon: Settings },
]

const isActive = (path) => {
  return route.path === path
}

const showProfile = ref(false)

const testUserData = {
  firstName: 'Admin',
  lastName: 'User',
  phone: '+998 90 123 45 67',
  email: 'admin@cpos.uz',
  role: 'Store Manager',
  organizationName: 'CPOS LLC',
  organizationAddress: 'Tashkent City, Chilonzor District, 19',
  organizationPhone: '+998 71 200 00 00',
  stir: '309567891',
  subscription: 'Premium Plan',
  store: {
    id: 'ST-001',
    name: 'Main Store',
    address: 'Tashkent, Sergeli District, Industrial Zone'
  }
}

const handleUpdateUser = (updatedUser) => {
  // In a real app, this would be an API call
  Object.assign(testUserData, updatedUser)
}
</script>

<template>
  <aside class="sidebar" :class="{ open: isOpen }">
    <div class="sidebar-header">
      <router-link to="/">
            <img src="/logo-nav.svg" alt="CPOS" class="logo" />
      </router-link>
      <button class="close-btn" @click="$emit('close')">
        <X class="icon-sm" />
      </button>
    </div>

    <nav class="sidebar-nav">
      <router-link 
        v-for="item in menuItems" 
        :key="item.path" 
        :to="item.path"
        class="nav-item"
        :class="{ active: isActive(item.path) }"
        @click="$emit('close')"
      >
        <component :is="item.icon" class="icon" />
        <span class="label">{{ item.name }}</span>
      </router-link>
    </nav>

    <div class="sidebar-footer">
      <div class="user-info" @click="showProfile = true">
        <div class="avatar">AD</div>
        <div class="details">
          <p class="name">{{ testUserData.firstName }} {{ testUserData.lastName }}</p>
          <p class="role">{{ testUserData.role }}</p>
        </div>
      </div>
    </div>
    <UserProfileDialog 
      :is-open="showProfile" 
      :user="testUserData" 
      @close="showProfile = false" 
      @update="handleUpdateUser"
    />
  </aside>
</template>

<style scoped>
.sidebar {
  width: 260px;
  height: 100vh;
  background-color: #FFFFFF;
  border-right: 1px solid #E2E8F0;
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 50;
  transition: transform 0.3s ease;
}

.sidebar-header {
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  border-bottom: 1px solid #F1F5F9;
}

.logo {
  height: 32px;
  width: auto;
}

.close-btn {
  display: none;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  color: #64748B;
  border-radius: 8px;
}

.close-btn:hover {
  background-color: #F1F5F9;
  color: #0F172A;
}

.icon-sm {
  width: 20px;
  height: 20px;
}

.brand-name {
  font-weight: 700;
  font-size: 1.25rem;
  color: #0F172A;
}

.sidebar-nav {
  flex: 1;
  padding: 1.5rem 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  color: #64748B;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s;
}

.nav-item:hover {
  background-color: #F8FAFC;
  color: #0F172A;
}

.nav-item.active {
  background-color: #EFF6FF;
  color: #2563EB;
}

.icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid #F1F5F9;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.user-info:hover {
  background-color: #F8FAFC;
}

.avatar {
  width: 40px;
  height: 40px;
  background-color: #2563EB;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.9rem;
}

.details .name {
  font-weight: 600;
  color: #0F172A;
  font-size: 0.9rem;
}

.details .role {
  font-size: 0.8rem;
  color: #64748B;
}

@media (max-width: 1024px) {
  .sidebar {
    transform: translateX(-100%);
  }
  
  .sidebar.open {
    transform: translateX(0);
    box-shadow: 4px 0 24px rgba(0, 0, 0, 0.1);
  }

  .close-btn {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
