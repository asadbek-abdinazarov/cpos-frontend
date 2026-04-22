<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { TrendingUp, Package, ShoppingBag, Scale, Settings, X, LogOut, Users, ChevronRight } from 'lucide-vue-next'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { logout, getUserProfile } from '@/services/api'
import { useNotification } from '@/composables/useNotification'

defineProps({
  isOpen: { type: Boolean, default: false },
})
defineEmits(['close'])

const route  = useRoute()
const router = useRouter()
const { t }  = useI18n()
const { showNotification } = useNotification()

const menuItems = [
  { name: 'dashboard.sidebar.analytics', path: '/dashboard/analytics', icon: TrendingUp },
  { name: 'dashboard.sidebar.products',  path: '/dashboard/products',  icon: Package },
  { name: 'dashboard.sidebar.scales',    path: '/dashboard/scales',    icon: Scale },
  { name: 'dashboard.sidebar.sales',     path: '/dashboard/sales',     icon: ShoppingBag },
  { name: 'dashboard.sidebar.cashiers',  path: '/dashboard/cashiers',  icon: Users },
  { name: 'dashboard.sidebar.settings',  path: '/dashboard/settings',  icon: Settings },
]

const isActive = (path) => route.path === path

const userData = ref({
  username: '', firstName: '', lastName: '',
  roles: [], isActive: false,
})

const initials = computed(() => {
  const f = userData.value.firstName?.[0] || ''
  const l = userData.value.lastName?.[0]  || ''
  return (f + l).toUpperCase() || userData.value.username?.[0]?.toUpperCase() || '?'
})

const fullName = computed(() => {
  const full = [userData.value.firstName, userData.value.lastName].filter(Boolean).join(' ')
  return full || userData.value.username || '—'
})

const fetchProfile = async () => {
  try {
    const res = await getUserProfile()
    if (res.data?.success) {
      const u = res.data.data
      userData.value = {
        username:  u.username  || '',
        firstName: u.firstName || '',
        lastName:  u.lastName  || '',
        roles:     u.roles     || [],
        isActive:  !!u.isActive,
      }
    }
  } catch (e) {
    console.error('Failed to fetch user profile:', e)
  }
}

onMounted(fetchProfile)

const handleLogout = async () => {
  try { await logout() } catch (e) { console.error('Logout error:', e) }
  finally {
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

    <!-- ─── Logo ──────────────────────────────────── -->
    <div class="sidebar-header">
      <router-link to="/" class="logo-link">
        <div class="logo-icon">
          <span class="logo-dot"></span>
        </div>
        <img src="/logo-nav.svg" alt="CPOS" class="logo-img" />
      </router-link>
      <button class="close-btn" @click="$emit('close')">
        <X :size="18" />
      </button>
    </div>

    <!-- ─── Nav ───────────────────────────────────── -->
    <nav class="sidebar-nav">
      <span class="nav-section-label">Menyu</span>
      <router-link
        v-for="item in menuItems"
        :key="item.path"
        :to="item.path"
        class="nav-item"
        :class="{ active: isActive(item.path) }"
        @click="$emit('close')"
      >
        <div class="nav-icon-wrap">
          <component :is="item.icon" :size="17" />
        </div>
        <span class="nav-label">{{ t(item.name) }}</span>
        <ChevronRight :size="13" class="nav-chevron" />
      </router-link>
    </nav>

    <!-- ─── Footer ────────────────────────────────── -->
    <div class="sidebar-footer">
      <div class="user-row">
        <div class="user-avatar">{{ initials }}</div>
        <div class="user-info">
          <span class="user-name">{{ fullName }}</span>
          <span class="user-role">{{ userData.roles[0] || 'User' }}</span>
        </div>
        <span class="user-status" :class="userData.isActive ? 'online' : 'offline'"></span>
      </div>
      <button class="logout-btn" @click="handleLogout">
        <LogOut :size="16" />
        <span>{{ t('nav.logout') || 'Chiqish' }}</span>
      </button>
    </div>

  </aside>
</template>

<style scoped>
.sidebar {
  width: 260px;
  height: 100vh;
  height: 100dvh;
  background: #fff;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 50;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

/* Subtle grid overlay */
.sidebar::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(0,123,255,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,123,255,0.03) 1px, transparent 1px);
  background-size: 28px 28px;
  pointer-events: none;
  z-index: 0;
}

/* Blue glow top-right */
.sidebar::after {
  content: '';
  position: absolute;
  top: -80px;
  right: -80px;
  width: 260px;
  height: 260px;
  background: radial-gradient(circle, rgba(0, 123, 255, 0.07) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
}

/* ─── Header ─────────────────────────────────────── */
.sidebar-header {
  position: relative;
  z-index: 2;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.25rem;
  border-bottom: 1px solid #f1f5f9;
}

.logo-link {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}

.logo-icon {
  width: 32px;
  height: 32px;
  border-radius: 9px;
  background: linear-gradient(135deg, #007bff, #6366f1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.4);
}

.logo-dot {
  width: 9px;
  height: 9px;
  background: #fff;
  border-radius: 50%;
}

.logo-img {
  height: 26px;
  width: auto;
}

.close-btn {
  display: none;
  background: #f1f5f9;
  border: none;
  cursor: pointer;
  padding: 7px;
  color: #64748b;
  border-radius: 8px;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #e2e8f0;
  color: #0f172a;
}

/* ─── Nav ────────────────────────────────────────── */
.sidebar-nav {
  position: relative;
  z-index: 2;
  flex: 1;
  min-height: 0;
  padding: 1.25rem 0.85rem;
  overflow-y: auto;
  overscroll-behavior-y: contain;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.sidebar-nav::-webkit-scrollbar { width: 4px; }
.sidebar-nav::-webkit-scrollbar-track { background: transparent; }
.sidebar-nav::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 4px; }

.nav-section-label {
  font-size: 0.68rem;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 0 0.65rem 0.6rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.65rem 0.75rem;
  border-radius: 10px;
  color: #64748b;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;
  position: relative;
}

.nav-item:hover {
  background: #f8fafc;
  color: #0f172a;
}

.nav-item.active {
  background: rgba(0, 123, 255, 0.08);
  color: #007bff;
  font-weight: 600;
  box-shadow: inset 0 0 0 1px rgba(0,123,255,0.15);
}

.nav-item.active .nav-icon-wrap {
  background: rgba(0, 123, 255, 0.15);
  color: #007bff;
}

.nav-icon-wrap {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s;
}

.nav-label {
  flex: 1;
}

.nav-chevron {
  opacity: 0;
  color: #007bff;
  transition: opacity 0.2s;
}

.nav-item:hover .nav-chevron,
.nav-item.active .nav-chevron {
  opacity: 1;
}

/* ─── Footer ─────────────────────────────────────── */
.sidebar-footer {
  position: relative;
  z-index: 2;
  padding: 0.85rem;
  border-top: 1px solid #f1f5f9;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.user-row {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.65rem 0.75rem;
  border-radius: 10px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}

.user-avatar {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  background: linear-gradient(135deg, #007bff, #6366f1);
  color: #fff;
  font-size: 0.8rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.user-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.user-name {
  font-size: 0.82rem;
  font-weight: 600;
  color: #0f172a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-role {
  font-size: 0.7rem;
  color: #94a3b8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-status {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.user-status.online  { background: #10b981; box-shadow: 0 0 6px rgba(16,185,129,0.6); }
.user-status.offline { background: #475569; }

.logout-btn {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  width: 100%;
  padding: 0.6rem 0.75rem;
  border: none;
  background: transparent;
  color: #ef4444;
  border-radius: 10px;
  cursor: pointer;
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;
}

.logout-btn:hover {
  background: #fef2f2;
  color: #dc2626;
}

/* ─── Responsive ─────────────────────────────────── */
@media (max-width: 1024px) {
  .sidebar {
    transform: translateX(-100%);
    box-shadow: none;
  }

  .sidebar.open {
    transform: translateX(0);
    box-shadow: 8px 0 32px rgba(0, 0, 0, 0.12);
  }

  .close-btn {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
