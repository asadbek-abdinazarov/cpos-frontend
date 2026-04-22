<script setup>
import { ref, onMounted, computed } from 'vue'
import {
  User,
  Lock,
  Building2,
  Store,
  Pencil,
  Check,
  X as XIcon,
  Mail,
  Phone,
  Calendar,
  Clock,
  MapPin,
  Hash,
  Activity,
  Save,
  Eye,
  EyeOff,
  ShieldCheck,
  ChevronRight,
} from 'lucide-vue-next'
import { getUserProfile, updatePassword } from '@/services/api'
import { useNotification } from '@/composables/useNotification'

const { showNotification } = useNotification()

const activeTab = ref('personal')

const availableTabs = ref([
  { id: 'personal', label: 'Personal Info', icon: User },
  { id: 'organization', label: 'Organization', icon: Building2 },
  { id: 'shop', label: 'Shop', icon: Store },
  { id: 'security', label: 'Security', icon: Lock },
])

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
})

const editableUser = ref({})
const isEditing = ref(false)

const userInitials = computed(() => {
  const f = userData.value.firstName?.[0] || ''
  const l = userData.value.lastName?.[0] || ''
  return (f + l).toUpperCase() || userData.value.username?.[0]?.toUpperCase() || '?'
})

const userFullName = computed(() => {
  const full = [userData.value.firstName, userData.value.lastName].filter(Boolean).join(' ')
  return full || userData.value.username || '—'
})

const setActiveTab = (tabId) => {
  activeTab.value = tabId
  isEditing.value = false
}

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

      availableTabs.value = [
        { id: 'personal', label: 'Personal Info', icon: User },
        ...(userData.value.organization
          ? [{ id: 'organization', label: 'Organization', icon: Building2 }]
          : []),
        ...(userData.value.shop ? [{ id: 'shop', label: 'Shop Details', icon: Store }] : []),
        { id: 'security', label: 'Security', icon: Lock },
      ]
    }
  } catch (error) {
    console.error('Failed to fetch user profile:', error)
    showNotification({ type: 'error', message: 'Failed to load profile data.' })
  }
}

onMounted(() => {
  fetchProfile()
})

const startEditing = () => {
  editableUser.value = JSON.parse(JSON.stringify(userData.value))
  isEditing.value = true
}

const cancelEditing = () => {
  isEditing.value = false
}

const saveChanges = () => {
  Object.assign(userData.value, editableUser.value)
  isEditing.value = false
  showNotification({ type: 'success', message: 'Profile updated successfully!' })
}

const securitySettings = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
  twoFactor: false,
})
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)
const SecurityLoading = ref(false)

const updateSecuritySettings = async () => {
  if (securitySettings.value.newPassword !== securitySettings.value.confirmPassword) {
    showNotification({ type: 'warning', message: 'New passwords do not match' })
    return
  }
  if (!securitySettings.value.currentPassword || !securitySettings.value.newPassword) {
    showNotification({ type: 'warning', message: 'Please fill out missing password fields' })
    return
  }
  SecurityLoading.value = true
  try {
    const res = await updatePassword({
      currentPassword: securitySettings.value.currentPassword,
      newPassword: securitySettings.value.newPassword,
      confirmNewPassword: securitySettings.value.confirmPassword,
    })
    if (res.data && res.data.success) {
      showNotification({ type: 'success', message: 'Password updated successfully!' })
      securitySettings.value.currentPassword = ''
      securitySettings.value.newPassword = ''
      securitySettings.value.confirmPassword = ''
    }
  } catch (error) {
    console.error('Failed to update password:', error)
  } finally {
    SecurityLoading.value = false
  }
}
</script>

<template>
  <div class="settings-page">

    <!-- ─── Hero Header ──────────────────────────── -->
    <div class="settings-hero">
      <div class="bg-grid"></div>
      <div class="bg-blob blob-1"></div>
      <div class="bg-blob blob-2"></div>

      <div class="hero-inner">
        <div class="hero-left">
          <div class="badge-pill">
            <span class="badge-dot"></span>
            {{ $t('dashboard.settings.title') }}
          </div>
          <h1 class="hero-title">
            Profil va
            <span class="title-highlight">Sozlamalar</span>
          </h1>
          <p class="hero-subtitle">{{ $t('dashboard.settings.subtitle') }}</p>
        </div>

        <div class="hero-user-card">
          <div class="avatar-ring">
            <div class="avatar">{{ userInitials }}</div>
            <span class="avatar-status" :class="userData.isActive ? 'online' : 'offline'"></span>
          </div>
          <div class="hero-user-info">
            <span class="hero-user-name">{{ userFullName }}</span>
            <span class="hero-username">@{{ userData.username || '—' }}</span>
            <div class="hero-badges">
              <span
                v-for="role in userData.roles.slice(0, 2)"
                :key="role"
                class="role-chip"
              >{{ role }}</span>
              <span class="status-chip" :class="userData.isActive ? 'active' : 'inactive'">
                {{ userData.isActive
                  ? $t('dashboard.products.status.active')
                  : $t('dashboard.products.status.inactive') }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ─── Main Layout ──────────────────────────── -->
    <div class="settings-container">

      <!-- Sidebar -->
      <div class="settings-sidebar">
        <div class="sidebar-label">Menyular</div>
        <button
          v-for="tab in availableTabs"
          :key="tab.id"
          class="tab-btn"
          :class="{ active: activeTab === tab.id }"
          @click="setActiveTab(tab.id)"
        >
          <div class="tab-icon-wrap">
            <component :is="tab.icon" :size="16" />
          </div>
          <span>{{ $t('dashboard.settings.tabs.' + tab.id) }}</span>
          <ChevronRight :size="14" class="tab-arrow" />
        </button>
      </div>

      <!-- Content -->
      <div class="settings-content">

        <!-- ── Personal Info ── -->
        <div v-if="activeTab === 'personal'" class="tab-pane">
          <div class="pane-header">
            <div class="pane-header-left">
              <div class="pane-icon blue">
                <User :size="18" />
              </div>
              <div>
                <h2>{{ $t('dashboard.settings.personal.title') }}</h2>
                <p>{{ $t('dashboard.settings.personal.desc') }}</p>
              </div>
            </div>
            <div class="pane-actions">
              <button v-if="!isEditing" class="btn btn-edit" @click="startEditing">
                <Pencil :size="14" /> {{ $t('dashboard.settings.buttons.edit') }}
              </button>
              <template v-else>
                <button class="btn btn-cancel" @click="cancelEditing">
                  <XIcon :size="14" /> {{ $t('dashboard.settings.buttons.cancel') }}
                </button>
                <button class="btn btn-save" @click="saveChanges">
                  <Check :size="14" /> {{ $t('dashboard.settings.buttons.save') }}
                </button>
              </template>
            </div>
          </div>

          <div class="fields-grid">
            <div class="field-group">
              <label><User class="lbl-icon" /> {{ $t('dashboard.settings.personal.first_name') }}</label>
              <p v-if="!isEditing">{{ userData.firstName || '—' }}</p>
              <input v-else v-model="editableUser.firstName" class="field-input" />
            </div>
            <div class="field-group">
              <label><User class="lbl-icon" /> {{ $t('dashboard.settings.personal.last_name') }}</label>
              <p v-if="!isEditing">{{ userData.lastName || '—' }}</p>
              <input v-else v-model="editableUser.lastName" class="field-input" />
            </div>
            <div class="field-group">
              <label><User class="lbl-icon" /> {{ $t('dashboard.settings.personal.username') }}</label>
              <p v-if="!isEditing">{{ userData.username || '—' }}</p>
              <input v-else v-model="editableUser.username" class="field-input" />
            </div>
            <div class="field-group">
              <label><Phone class="lbl-icon" /> {{ $t('dashboard.settings.personal.phone') }}</label>
              <p v-if="!isEditing">{{ userData.phone || '—' }}</p>
              <input v-else v-model="editableUser.phone" class="field-input" />
            </div>
            <div class="field-group">
              <label><Mail class="lbl-icon" /> {{ $t('dashboard.settings.personal.email') }}</label>
              <p v-if="!isEditing">{{ userData.email || '—' }}</p>
              <input v-else v-model="editableUser.email" class="field-input" />
            </div>
            <div class="field-group">
              <label><Activity class="lbl-icon" /> {{ $t('dashboard.settings.personal.status') }}</label>
              <span class="status-badge" :class="userData.isActive ? 'badge-success' : 'badge-danger'">
                {{ userData.isActive
                  ? $t('dashboard.products.status.active')
                  : $t('dashboard.products.status.inactive') }}
              </span>
            </div>
            <div class="field-group">
              <label><Calendar class="lbl-icon" /> {{ $t('dashboard.settings.personal.created_at') }}</label>
              <p class="text-muted">{{ userData.createdAt ? new Date(userData.createdAt).toLocaleString('uz-UZ') : '—' }}</p>
            </div>
            <div class="field-group">
              <label><Clock class="lbl-icon" /> {{ $t('dashboard.settings.personal.updated_at') }}</label>
              <p class="text-muted">{{ userData.updatedAt ? new Date(userData.updatedAt).toLocaleString('uz-UZ') : '—' }}</p>
            </div>
          </div>
        </div>

        <!-- ── Organization ── -->
        <div v-if="activeTab === 'organization' && userData.organization" class="tab-pane">
          <div class="pane-header">
            <div class="pane-header-left">
              <div class="pane-icon indigo">
                <Building2 :size="18" />
              </div>
              <div>
                <h2>{{ $t('dashboard.settings.organization.title') }}</h2>
                <p>{{ $t('dashboard.settings.organization.desc') }}</p>
              </div>
            </div>
            <div class="pane-actions">
              <button v-if="!isEditing" class="btn btn-edit" @click="startEditing">
                <Pencil :size="14" /> {{ $t('dashboard.settings.buttons.edit') }}
              </button>
              <template v-else>
                <button class="btn btn-cancel" @click="cancelEditing">
                  <XIcon :size="14" /> {{ $t('dashboard.settings.buttons.cancel') }}
                </button>
                <button class="btn btn-save" @click="saveChanges">
                  <Check :size="14" /> {{ $t('dashboard.settings.buttons.save') }}
                </button>
              </template>
            </div>
          </div>

          <div class="fields-grid">
            <div class="field-group col-2">
              <label><Building2 class="lbl-icon" /> {{ $t('dashboard.settings.organization.name') }}</label>
              <p class="field-highlight" v-if="!isEditing">{{ userData.organization.name || '—' }}</p>
              <input v-else v-model="editableUser.organization.name" class="field-input" />
            </div>
            <div class="field-group">
              <label><Hash class="lbl-icon" /> {{ $t('dashboard.settings.organization.stir') }}</label>
              <p class="mono" v-if="!isEditing">{{ userData.organization.stir || '—' }}</p>
              <input v-else v-model="editableUser.organization.stir" class="field-input mono" />
            </div>
            <div class="field-group">
              <label><Phone class="lbl-icon" /> {{ $t('dashboard.settings.organization.phone') }}</label>
              <p v-if="!isEditing">{{ userData.organization.phone || '—' }}</p>
              <input v-else v-model="editableUser.organization.phone" class="field-input" />
            </div>
            <div class="field-group">
              <label><Activity class="lbl-icon" /> {{ $t('dashboard.settings.organization.status') }}</label>
              <span class="status-badge" :class="userData.organization.isActive ? 'badge-success' : 'badge-danger'">
                {{ userData.organization.isActive
                  ? $t('dashboard.products.status.active')
                  : $t('dashboard.products.status.inactive') }}
              </span>
            </div>
            <div class="field-group">
              <label><Calendar class="lbl-icon" /> {{ $t('dashboard.settings.organization.created_at') }}</label>
              <p class="text-muted">{{ userData.organization.createdAt ? new Date(userData.organization.createdAt).toLocaleString('uz-UZ') : '—' }}</p>
            </div>
            <div class="field-group col-2">
              <label><MapPin class="lbl-icon" /> {{ $t('dashboard.settings.shop.address') }}</label>
              <p v-if="!isEditing">{{ userData.organization.address || '—' }}</p>
              <input v-else v-model="editableUser.organization.address" class="field-input" />
            </div>
          </div>
        </div>

        <!-- ── Shop ── -->
        <div v-if="activeTab === 'shop' && userData.shop" class="tab-pane">
          <div class="pane-header">
            <div class="pane-header-left">
              <div class="pane-icon green">
                <Store :size="18" />
              </div>
              <div>
                <h2>{{ $t('dashboard.settings.tabs.shop') }}</h2>
                <p>{{ $t('dashboard.settings.organization.desc') }}</p>
              </div>
            </div>
            <div class="pane-actions">
              <button v-if="!isEditing" class="btn btn-edit" @click="startEditing">
                <Pencil :size="14" /> {{ $t('dashboard.settings.buttons.edit') }}
              </button>
              <template v-else>
                <button class="btn btn-cancel" @click="cancelEditing">
                  <XIcon :size="14" /> {{ $t('dashboard.settings.buttons.cancel') }}
                </button>
                <button class="btn btn-save" @click="saveChanges">
                  <Check :size="14" /> {{ $t('dashboard.settings.buttons.save') }}
                </button>
              </template>
            </div>
          </div>

          <div class="fields-grid">
            <div class="field-group col-2">
              <label><Store class="lbl-icon" /> {{ $t('dashboard.settings.shop.name') }}</label>
              <p class="field-highlight" v-if="!isEditing">{{ userData.shop.name || '—' }}</p>
              <input v-else v-model="editableUser.shop.name" class="field-input" />
            </div>
            <div class="field-group">
              <label><Phone class="lbl-icon" /> {{ $t('dashboard.settings.shop.phone') }}</label>
              <p v-if="!isEditing">{{ userData.shop.phone || '—' }}</p>
              <input v-else v-model="editableUser.shop.phone" class="field-input" />
            </div>
            <div class="field-group">
              <label><Activity class="lbl-icon" /> {{ $t('dashboard.settings.shop.status') }}</label>
              <span class="status-badge" :class="userData.shop.isActive ? 'badge-success' : 'badge-danger'">
                {{ userData.shop.isActive
                  ? $t('dashboard.products.status.active')
                  : $t('dashboard.products.status.inactive') }}
              </span>
            </div>
            <div class="field-group">
              <label><Calendar class="lbl-icon" /> {{ $t('dashboard.settings.shop.created_at') }}</label>
              <p class="text-muted">{{ userData.shop.createdAt ? new Date(userData.shop.createdAt).toLocaleString('uz-UZ') : '—' }}</p>
            </div>
            <div class="field-group col-2">
              <label><MapPin class="lbl-icon" /> {{ $t('dashboard.settings.shop.address') }}</label>
              <p v-if="!isEditing">{{ userData.shop.address || '—' }}</p>
              <input v-else v-model="editableUser.shop.address" class="field-input" />
            </div>
          </div>
        </div>

        <!-- ── Security ── -->
        <div v-if="activeTab === 'security'" class="tab-pane">
          <div class="pane-header">
            <div class="pane-header-left">
              <div class="pane-icon red">
                <ShieldCheck :size="18" />
              </div>
              <div>
                <h2>{{ $t('dashboard.settings.security.title') }}</h2>
                <p>{{ $t('dashboard.settings.security.desc') }}</p>
              </div>
            </div>
          </div>

          <form @submit.prevent="updateSecuritySettings" class="security-form">
            <div class="security-info-banner">
              <Lock :size="15" color="#007bff" />
              <span>Parolni o'zgartirishdan oldin joriy parolingizni kiriting</span>
            </div>

            <div class="form-field">
              <label>{{ $t('dashboard.settings.security.current_password') }}</label>
              <div class="pw-wrap">
                <input
                  v-model="securitySettings.currentPassword"
                  :type="showCurrentPassword ? 'text' : 'password'"
                  class="field-input"
                  placeholder="••••••••"
                  required
                />
                <button type="button" class="pw-toggle" @click="showCurrentPassword = !showCurrentPassword">
                  <Eye v-if="showCurrentPassword" :size="17" />
                  <EyeOff v-else :size="17" />
                </button>
              </div>
            </div>

            <div class="form-row-2">
              <div class="form-field">
                <label>{{ $t('dashboard.settings.security.new_password') }}</label>
                <div class="pw-wrap">
                  <input
                    v-model="securitySettings.newPassword"
                    :type="showNewPassword ? 'text' : 'password'"
                    class="field-input"
                    placeholder="••••••••"
                    required
                  />
                  <button type="button" class="pw-toggle" @click="showNewPassword = !showNewPassword">
                    <Eye v-if="showNewPassword" :size="17" />
                    <EyeOff v-else :size="17" />
                  </button>
                </div>
              </div>
              <div class="form-field">
                <label>{{ $t('dashboard.settings.security.confirm_password') }}</label>
                <div class="pw-wrap">
                  <input
                    v-model="securitySettings.confirmPassword"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    class="field-input"
                    placeholder="••••••••"
                    required
                  />
                  <button type="button" class="pw-toggle" @click="showConfirmPassword = !showConfirmPassword">
                    <Eye v-if="showConfirmPassword" :size="17" />
                    <EyeOff v-else :size="17" />
                  </button>
                </div>
              </div>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn btn-primary-gradient" :disabled="SecurityLoading">
                <Save :size="15" v-if="!SecurityLoading" />
                <span v-if="SecurityLoading" class="spinner"></span>
                {{ SecurityLoading
                  ? $t('dashboard.settings.security.updating')
                  : $t('dashboard.settings.security.update_password_btn') }}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-page {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
  max-width: 1200px;
  margin: 0 auto;
}

/* ─── Hero ──────────────────────────────────────── */
.settings-hero {
  position: relative;
  background: #fff;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  padding: 2rem 2rem 1.75rem;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.04);
}

.bg-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(0, 123, 255, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 123, 255, 0.04) 1px, transparent 1px);
  background-size: 32px 32px;
  pointer-events: none;
  z-index: 0;
}

.bg-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  pointer-events: none;
  z-index: 0;
}

.blob-1 {
  width: 360px;
  height: 360px;
  background: radial-gradient(circle, rgba(0, 123, 255, 0.09) 0%, transparent 70%);
  top: -100px;
  right: -60px;
}

.blob-2 {
  width: 240px;
  height: 240px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.07) 0%, transparent 70%);
  bottom: -60px;
  left: -30px;
}

.hero-inner {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  flex-wrap: wrap;
}

.hero-left {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.badge-pill {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: rgba(0, 123, 255, 0.08);
  border: 1px solid rgba(0, 123, 255, 0.18);
  color: #007bff;
  font-size: 0.78rem;
  font-weight: 600;
  padding: 5px 12px;
  border-radius: 100px;
  width: fit-content;
}

.badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #007bff;
  animation: blink 1.8s ease-in-out infinite;
  flex-shrink: 0;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.hero-title {
  font-size: clamp(1.5rem, 2.8vw, 2rem);
  font-weight: 800;
  color: #0f172a;
  line-height: 1.15;
  letter-spacing: -0.02em;
  margin: 0;
}

.title-highlight {
  background: linear-gradient(135deg, #007bff 0%, #6366f1 60%, #06b6d4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 0.9rem;
  color: #64748b;
  margin: 0;
}

/* User card in hero */
.hero-user-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 1rem 1.4rem;
  backdrop-filter: blur(8px);
}

.avatar-ring {
  position: relative;
  flex-shrink: 0;
}

.avatar {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: linear-gradient(135deg, #007bff, #6366f1);
  color: #fff;
  font-size: 1.1rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 0.02em;
}

.avatar-status {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  border: 2px solid #fff;
}

.avatar-status.online { background: #10b981; }
.avatar-status.offline { background: #94a3b8; }

.hero-user-info {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.hero-user-name {
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
}

.hero-username {
  font-size: 0.8rem;
  color: #64748b;
}

.hero-badges {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  margin-top: 4px;
}

.role-chip {
  font-size: 0.7rem;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 100px;
  background: rgba(99, 102, 241, 0.1);
  color: #6366f1;
  border: 1px solid rgba(99, 102, 241, 0.2);
}

.status-chip {
  font-size: 0.7rem;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 100px;
}

.status-chip.active {
  background: rgba(16, 185, 129, 0.1);
  color: #059669;
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.status-chip.inactive {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

/* ─── Main layout ───────────────────────────────── */
.settings-container {
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
}

/* ─── Sidebar ───────────────────────────────────── */
.settings-sidebar {
  width: 240px;
  flex-shrink: 0;
  background: #fff;
  border-radius: 16px;
  border: 1px solid #f1f5f9;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.04);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.sidebar-label {
  font-size: 0.7rem;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 0.25rem 0.75rem 0.5rem;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.7rem 0.85rem;
  background: transparent;
  border: none;
  border-radius: 10px;
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;
  width: 100%;
}

.tab-btn:hover {
  background: #f8fafc;
  color: #0f172a;
}

.tab-btn.active {
  background: rgba(0, 123, 255, 0.08);
  color: #007bff;
  font-weight: 600;
}

.tab-btn.active .tab-icon-wrap {
  background: rgba(0, 123, 255, 0.15);
  color: #007bff;
}

.tab-icon-wrap {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s;
}

.tab-arrow {
  margin-left: auto;
  opacity: 0;
  transition: opacity 0.2s;
  color: #007bff;
}

.tab-btn.active .tab-arrow,
.tab-btn:hover .tab-arrow {
  opacity: 1;
}

/* ─── Content area ──────────────────────────────── */
.settings-content {
  flex: 1;
  background: #fff;
  border-radius: 16px;
  border: 1px solid #f1f5f9;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.04);
  min-height: 480px;
}

.tab-pane {
  padding: 2rem;
  animation: fadeIn 0.25s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Pane header */
.pane-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding-bottom: 1.5rem;
  margin-bottom: 1.75rem;
  border-bottom: 1px solid #f1f5f9;
  gap: 1rem;
}

.pane-header-left {
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
}

.pane-icon {
  width: 40px;
  height: 40px;
  border-radius: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.pane-icon.blue { background: rgba(0, 123, 255, 0.1); color: #007bff; }
.pane-icon.indigo { background: rgba(99, 102, 241, 0.1); color: #6366f1; }
.pane-icon.green { background: rgba(16, 185, 129, 0.1); color: #10b981; }
.pane-icon.red { background: rgba(239, 68, 68, 0.08); color: #ef4444; }

.pane-header-left h2 {
  font-size: 1.1rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 3px;
}

.pane-header-left p {
  font-size: 0.85rem;
  color: #64748b;
  margin: 0;
}

/* Action buttons */
.pane-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0.5rem 1rem;
  border-radius: 9px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-edit {
  background: #fff;
  border: 1.5px solid #e2e8f0;
  color: #475569;
}

.btn-edit:hover {
  border-color: #007bff;
  color: #007bff;
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.1);
}

.btn-save {
  background: linear-gradient(135deg, #007bff, #6366f1);
  color: #fff;
  box-shadow: 0 3px 12px rgba(0, 123, 255, 0.3);
}

.btn-save:hover {
  box-shadow: 0 4px 16px rgba(0, 123, 255, 0.4);
  transform: translateY(-1px);
}

.btn-cancel {
  background: #fff;
  border: 1.5px solid #fca5a5;
  color: #ef4444;
}

.btn-cancel:hover {
  background: #fef2f2;
}

/* ─── Fields grid ───────────────────────────────── */
.fields-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.col-2 {
  grid-column: span 2;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-group label {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.lbl-icon {
  width: 13px;
  height: 13px;
  stroke-width: 2.5;
}

.field-group p {
  margin: 0;
  font-size: 0.975rem;
  font-weight: 500;
  color: #1e293b;
}

.field-highlight {
  font-size: 1.15rem !important;
  font-weight: 700 !important;
  color: #0f172a !important;
}

.text-muted { color: #64748b !important; }
.mono { font-family: 'Courier New', monospace; letter-spacing: 1px; }

.field-input {
  width: 100%;
  padding: 0.7rem 1rem;
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  border-radius: 9px;
  font-size: 0.95rem;
  color: #0f172a;
  font-weight: 500;
  transition: all 0.2s;
  font-family: inherit;
  box-sizing: border-box;
}

.field-input:focus {
  outline: none;
  background: #fff;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.12);
}

/* Status badge */
.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 100px;
  font-size: 0.8rem;
  font-weight: 600;
  width: fit-content;
}

.badge-success { background: #dcfce7; color: #166534; }
.badge-danger  { background: #fee2e2; color: #991b1b; }

/* ─── Security form ─────────────────────────────── */
.security-form {
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
}

.security-info-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0.85rem 1.1rem;
  background: rgba(0, 123, 255, 0.05);
  border: 1px solid rgba(0, 123, 255, 0.15);
  border-radius: 10px;
  font-size: 0.85rem;
  color: #3b5fa0;
  font-weight: 500;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 7px;
  flex: 1;
}

.form-field label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #334155;
}

.form-row-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}

.pw-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.pw-wrap .field-input {
  padding-right: 2.75rem;
}

.pw-toggle {
  position: absolute;
  right: 0.85rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #94a3b8;
  display: flex;
  align-items: center;
  padding: 0;
  transition: color 0.2s;
}

.pw-toggle:hover { color: #007bff; }

.form-actions {
  display: flex;
  justify-content: flex-end;
  padding-top: 0.5rem;
}

.btn-primary-gradient {
  background: linear-gradient(135deg, #007bff, #6366f1);
  color: #fff;
  border: none;
  box-shadow: 0 4px 16px rgba(0, 123, 255, 0.3);
  padding: 0.7rem 1.6rem;
  font-size: 0.95rem;
}

.btn-primary-gradient:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(0, 123, 255, 0.4);
}

.btn-primary-gradient:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  display: inline-block;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* ─── Responsive ────────────────────────────────── */
@media (max-width: 960px) {
  .settings-container {
    flex-direction: column;
  }

  .settings-sidebar {
    width: 100%;
    flex-direction: row;
    overflow-x: auto;
    padding: 0.5rem;
    gap: 4px;
  }

  .sidebar-label { display: none; }

  .tab-btn {
    white-space: nowrap;
    padding: 0.55rem 0.9rem;
    flex-shrink: 0;
  }

  .tab-arrow { display: none; }
}

@media (max-width: 680px) {
  .hero-user-card { display: none; }

  .fields-grid {
    grid-template-columns: 1fr;
  }

  .col-2 { grid-column: span 1; }

  .form-row-2 {
    grid-template-columns: 1fr;
  }

  .pane-header {
    flex-direction: column;
  }

  .tab-pane {
    padding: 1.25rem;
  }
}
</style>
