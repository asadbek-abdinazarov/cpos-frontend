<script setup>
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { TrendingUp, Package, ShoppingBag, Scale, Tag, Settings, X, LogOut } from 'lucide-vue-next'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { logout, getUserProfile } from '@/services/api'
import { useNotification } from '@/composables/useNotification'

defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['close'])

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const { showNotification } = useNotification()

const menuItems = [
  { name: 'dashboard.sidebar.analytics', path: '/dashboard/analytics', icon: TrendingUp },
  { name: 'dashboard.sidebar.products', path: '/dashboard/products', icon: Package },
  { name: 'dashboard.sidebar.scales', path: '/dashboard/scales', icon: Scale },
  { name: 'dashboard.sidebar.sales', path: '/dashboard/sales', icon: ShoppingBag },
  { name: 'dashboard.sidebar.settings', path: '/dashboard/settings', icon: Settings },
]

const isActive = (path) => {
  return route.path === path
}

const userData = ref({
  username: '',
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  isActive: false,
  createdAt: '',
  updatedAt: '',
  roles: [],
  permissions: [],
  organization: null,
  shop: null,
  warehouse: null,
})

const fetchProfile = async () => {
  try {
    const res = await getUserProfile()
    if (res.data && res.data.success) {
      const u = res.data.data
      userData.value = {
        username: u.username || '',
        firstName: u.firstName || '',
        lastName: u.lastName || '',
        phone: u.phone || '',
        email: u.email || '',
        isActive: !!u.isActive,
        createdAt: u.createdAt || '',
        updatedAt: u.updatedAt || '',
        roles: u.roles || [],
        permissions: u.permissions || [],
        organization: u.organization
          ? {
              name: u.organization.name || '',
              stir: u.organization.stir || '',
              address: u.organization.address || '',
              phone: u.organization.phone || '',
              isActive: !!u.organization.isActive,
              createdAt: u.organization.createdAt || '',
              updatedAt: u.organization.updatedAt || '',
            }
          : null,
        shop: u.shop
          ? {
              name: u.shop.name || '',
              address: u.shop.address || '',
              phone: u.shop.phone || '',
              isActive: !!u.shop.isActive,
              createdAt: u.shop.createdAt || '',
              updatedAt: u.shop.updatedAt || '',
            }
          : null,
      }
    }
  } catch (error) {
    console.error('Failed to fetch user profile:', error)
  }
}

onMounted(() => {
  fetchProfile()
})

const handleLogout = async () => {
  try {
    await logout()
  } catch (error) {
    console.error('Logout error UI side: ', error)
  } finally {
    // We remove local items and redirect even if the /logout endpoint fails
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('username')
    localStorage.removeItem('userId')
    router.push('/')
    showNotification({ type: 'info', message: t('nav.success-logout') })
  }
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
        <span class="label">{{ t(item.name) }}</span>
      </router-link>
    </nav>

    <div class="sidebar-footer">
      <button class="logout-btn" @click="handleLogout" :title="t('nav.logout') || 'Log Out'">
        <LogOut class="icon-sm" />
        <span class="label">{{ t('nav.logout') || 'Log Out' }}</span>
      </button>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 260px;
  height: 100vh;
  background-color: #ffffff;
  border-right: 1px solid #e2e8f0;
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
  border-bottom: 1px solid #f1f5f9;
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
  color: #64748b;
  border-radius: 8px;
}

.close-btn:hover {
  background-color: #f1f5f9;
  color: #0f172a;
}

.icon-sm {
  width: 20px;
  height: 20px;
}

.brand-name {
  font-weight: 700;
  font-size: 1.25rem;
  color: #0f172a;
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
  color: #64748b;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s;
}

.nav-item:hover {
  background-color: #f8fafc;
  color: #0f172a;
}

.nav-item.active {
  background-color: #eff6ff;
  color: #2563eb;
}

.icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid #f1f5f9;
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
  background-color: #f8fafc;
}

.avatar {
  width: 40px;
  height: 40px;
  background-color: #2563eb;
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
  color: #0f172a;
  font-size: 0.9rem;
}

.details .role {
  font-size: 0.8rem;
  color: #64748b;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 1rem;
  margin-top: 0.5rem;
  border: none;
  background: transparent;
  color: #ef4444; /* red-500 */
  border-radius: 8px;
  cursor: pointer;
  font-family: inherit;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.logout-btn:hover {
  background-color: #fef2f2; /* red-50 */
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
