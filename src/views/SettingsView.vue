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
  Zap,
  // CalendarClock,
  BadgeCheck,
  AlertTriangle,
  KeyRound,
} from 'lucide-vue-next'
import { getUserProfile, updatePassword } from '@/services/api'
import { useNotification } from '@/composables/useNotification'
import { useI18n } from 'vue-i18n'

const { showNotification } = useNotification()
const { t } = useI18n()

const activeTab = ref('personal')

const availableTabs = computed(() => [
  { id: 'personal', label: t('dashboard.settings.tabs.personal'), icon: User },
  ...(userData.value.organization
    ? [{ id: 'organization', label: t('dashboard.settings.tabs.organization'), icon: Building2 }]
    : []),
  ...(userData.value.shop
    ? [{ id: 'shop', label: t('dashboard.settings.tabs.shop'), icon: Store }]
    : []),
  ...(userData.value.subscription
    ? [{ id: 'subscription', label: t('dashboard.settings.tabs.subscription'), icon: Zap }]
    : []),
  { id: 'security', label: t('dashboard.settings.tabs.security'), icon: Lock },
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
  subscription: null,
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

// const subStatusClass = computed(() => {
//   const s = userData.value.subscription
//   if (!s) return ''
//   if (s.isExpired) return 'sub-status-expired'
//   if (s.isTrial) return 'sub-status-trial'
//   return 'sub-status-active'
// })

const subUrgencyClass = computed(() => {
  const days = userData.value.subscription?.daysRemaining
  if (days === null || days === undefined) return ''
  if (days <= 3) return 'urgency-critical'
  if (days <= 7) return 'urgency-warning'
  return 'urgency-ok'
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
        subscription: u.subscription
          ? {
              status: u.subscription.status || '',
              statusLabel: u.subscription.statusLabel || '',
              planName: u.subscription.planName || '',
              planDisplayName: u.subscription.planDisplayName || '',
              endDate: u.subscription.endDate || '',
              daysRemaining: u.subscription.daysRemaining ?? null,
              isTrial: !!u.subscription.isTrial,
              isExpired: !!u.subscription.isExpired,
            }
          : null,
      }
    }
  } catch {
    showNotification({ type: 'error', message: t('dashboard.settings.load_error') })
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
  showNotification({ type: 'info', message: t('dashboard.settings.save_local') })
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
    showNotification({ type: 'warning', message: t('auth.passwords_mismatch') })
    return
  }
  if (!securitySettings.value.currentPassword || !securitySettings.value.newPassword) {
    showNotification({ type: 'warning', message: t('dashboard.settings.password_required') })
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
      showNotification({ type: 'success', message: t('dashboard.settings.password_success') })
      securitySettings.value.currentPassword = ''
      securitySettings.value.newPassword = ''
      securitySettings.value.confirmPassword = ''
    }
  } catch {
    // error shown by global API interceptor
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
          <h1 class="hero-title">{{ $t('dashboard.settings.profile_settings') }}</h1>
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
              <!-- <span v-for="role in userData.roles.slice(0, 2)" :key="role" class="role-chip">{{ role }}</span> -->
              <span class="status-chip" :class="userData.isActive ? 'active' : 'inactive'">
                {{
                  userData.isActive
                    ? $t('dashboard.products.status.active')
                    : $t('dashboard.products.status.inactive')
                }}
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
        <div class="sidebar-label">{{ $t('dashboard.settings.menus_label') }}</div>
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
        <Transition name="tab-fade" mode="out-in">
          <div :key="activeTab" class="tab-transition-wrap">
            <!-- ── Personal Info ── -->
            <div v-if="activeTab === 'personal'" class="tab-pane">
              <div class="pane-header">
                <div class="pane-header-left">
                  <div class="pane-icon blue"><User :size="18" /></div>
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

              <!-- Personal Hero Card -->
              <!-- <div class="shc shc-blue">
            <div class="shc-glow"></div>
            <div class="shc-inner">
              <div class="shc-avatar-wrap">
                <div class="shc-avatar">{{ userInitials }}</div>
                <span class="shc-online-dot" :class="userData.isActive ? 'dot-online' : 'dot-offline'"></span>
              </div>
              <div class="shc-details">
                <span class="shc-eyebrow">{{ $t('dashboard.settings.personal.title') }}</span>
                <span class="shc-name">{{ userFullName }}</span>
                <div class="shc-chips">
                  <span v-for="role in userData.roles" :key="role" class="shc-chip shc-chip-blue">{{ role }}</span>
                  <span class="shc-chip" :class="userData.isActive ? 'shc-chip-green' : 'shc-chip-red'">
                    {{ userData.isActive ? $t('dashboard.products.status.active') : $t('dashboard.products.status.inactive') }}
                  </span>
                </div>
              </div>
              <div class="shc-right">
                <div class="shc-meta-item">
                  <Calendar :size="12" />
                  {{ userData.createdAt ? new Date(userData.createdAt).toLocaleDateString('uz-UZ') : '—' }}
                </div>
                <div class="shc-meta-item" v-if="userData.email">
                  <Mail :size="12" />
                  {{ userData.email }}
                </div>
              </div>
            </div>
          </div> -->

              <div class="fields-grid">
                <div class="field-group">
                  <label
                    ><User class="lbl-icon" />
                    {{ $t('dashboard.settings.personal.first_name') }}</label
                  >
                  <p v-if="!isEditing">{{ userData.firstName || '—' }}</p>
                  <input v-else v-model="editableUser.firstName" class="field-input" />
                </div>
                <div class="field-group">
                  <label
                    ><User class="lbl-icon" />
                    {{ $t('dashboard.settings.personal.last_name') }}</label
                  >
                  <p v-if="!isEditing">{{ userData.lastName || '—' }}</p>
                  <input v-else v-model="editableUser.lastName" class="field-input" />
                </div>
                <div class="field-group">
                  <label
                    ><User class="lbl-icon" />
                    {{ $t('dashboard.settings.personal.username') }}</label
                  >
                  <p v-if="!isEditing">{{ userData.username || '—' }}</p>
                  <input v-else v-model="editableUser.username" class="field-input" />
                </div>
                <div class="field-group">
                  <label
                    ><Phone class="lbl-icon" /> {{ $t('dashboard.settings.personal.phone') }}</label
                  >
                  <p v-if="!isEditing">{{ userData.phone || '—' }}</p>
                  <input v-else v-model="editableUser.phone" class="field-input" />
                </div>
                <div class="field-group">
                  <label
                    ><Mail class="lbl-icon" /> {{ $t('dashboard.settings.personal.email') }}</label
                  >
                  <p v-if="!isEditing">{{ userData.email || '—' }}</p>
                  <input v-else v-model="editableUser.email" class="field-input" />
                </div>
                <div class="field-group">
                  <label
                    ><Activity class="lbl-icon" />
                    {{ $t('dashboard.settings.personal.status') }}</label
                  >
                  <span
                    class="status-badge"
                    :class="userData.isActive ? 'badge-success' : 'badge-danger'"
                  >
                    {{
                      userData.isActive
                        ? $t('dashboard.products.status.active')
                        : $t('dashboard.products.status.inactive')
                    }}
                  </span>
                </div>
                <div class="field-group">
                  <label
                    ><Calendar class="lbl-icon" />
                    {{ $t('dashboard.settings.personal.created_at') }}</label
                  >
                  <p class="text-muted">
                    {{
                      userData.createdAt
                        ? new Date(userData.createdAt).toLocaleString('uz-UZ')
                        : '—'
                    }}
                  </p>
                </div>
                <div class="field-group">
                  <label
                    ><Clock class="lbl-icon" />
                    {{ $t('dashboard.settings.personal.updated_at') }}</label
                  >
                  <p class="text-muted">
                    {{
                      userData.updatedAt
                        ? new Date(userData.updatedAt).toLocaleString('uz-UZ')
                        : '—'
                    }}
                  </p>
                </div>
              </div>
            </div>

            <!-- ── Organization ── -->
            <div v-if="activeTab === 'organization' && userData.organization" class="tab-pane">
              <div class="pane-header">
                <div class="pane-header-left">
                  <div class="pane-icon indigo"><Building2 :size="18" /></div>
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

              <!-- Organization Hero Card -->
              <!-- <div class="shc shc-indigo">
            <div class="shc-glow"></div>
            <div class="shc-inner">
              <div class="shc-icon-wrap shc-icon-indigo">
                <Building2 :size="24" />
              </div>
              <div class="shc-details">
                <span class="shc-eyebrow">{{ $t('dashboard.settings.organization.title') }}</span>
                <span class="shc-name">{{ userData.organization.name || '—' }}</span>
                <div class="shc-chips" v-if="userData.organization.stir">
                  <span class="shc-chip shc-chip-mono">
                    <Hash :size="10" /> {{ userData.organization.stir }}
                  </span>
                  <span class="shc-chip" :class="userData.organization.isActive ? 'shc-chip-green' : 'shc-chip-red'">
                    {{ userData.organization.isActive ? $t('dashboard.products.status.active') : $t('dashboard.products.status.inactive') }}
                  </span>
                </div>
              </div>
              <div class="shc-right">
                <div class="shc-meta-item" v-if="userData.organization.phone">
                  <Phone :size="12" /> {{ userData.organization.phone }}
                </div>
                <div class="shc-meta-item" v-if="userData.organization.createdAt">
                  <Calendar :size="12" />
                  {{ new Date(userData.organization.createdAt).toLocaleDateString('uz-UZ') }}
                </div>
              </div>
            </div>
          </div> -->

              <div class="fields-grid">
                <div class="field-group col-2">
                  <label
                    ><Building2 class="lbl-icon" />
                    {{ $t('dashboard.settings.organization.name') }}</label
                  >
                  <p class="field-highlight" v-if="!isEditing">
                    {{ userData.organization.name || '—' }}
                  </p>
                  <input v-else v-model="editableUser.organization.name" class="field-input" />
                </div>
                <div class="field-group">
                  <label
                    ><Hash class="lbl-icon" />
                    {{ $t('dashboard.settings.organization.stir') }}</label
                  >
                  <p class="mono" v-if="!isEditing">{{ userData.organization.stir || '—' }}</p>
                  <input v-else v-model="editableUser.organization.stir" class="field-input mono" />
                </div>
                <div class="field-group">
                  <label
                    ><Phone class="lbl-icon" />
                    {{ $t('dashboard.settings.organization.phone') }}</label
                  >
                  <p v-if="!isEditing">{{ userData.organization.phone || '—' }}</p>
                  <input v-else v-model="editableUser.organization.phone" class="field-input" />
                </div>
                <div class="field-group">
                  <label
                    ><Activity class="lbl-icon" />
                    {{ $t('dashboard.settings.organization.status') }}</label
                  >
                  <span
                    class="status-badge"
                    :class="userData.organization.isActive ? 'badge-success' : 'badge-danger'"
                  >
                    {{
                      userData.organization.isActive
                        ? $t('dashboard.products.status.active')
                        : $t('dashboard.products.status.inactive')
                    }}
                  </span>
                </div>
                <div class="field-group">
                  <label
                    ><Calendar class="lbl-icon" />
                    {{ $t('dashboard.settings.organization.created_at') }}</label
                  >
                  <p class="text-muted">
                    {{
                      userData.organization.createdAt
                        ? new Date(userData.organization.createdAt).toLocaleString('uz-UZ')
                        : '—'
                    }}
                  </p>
                </div>
                <div class="field-group col-2">
                  <label
                    ><MapPin class="lbl-icon" /> {{ $t('dashboard.settings.shop.address') }}</label
                  >
                  <p v-if="!isEditing">{{ userData.organization.address || '—' }}</p>
                  <input v-else v-model="editableUser.organization.address" class="field-input" />
                </div>
              </div>
            </div>

            <!-- ── Shop ── -->
            <div v-if="activeTab === 'shop' && userData.shop" class="tab-pane">
              <div class="pane-header">
                <div class="pane-header-left">
                  <div class="pane-icon green"><Store :size="18" /></div>
                  <div>
                    <h2>{{ $t('dashboard.settings.tabs.shop') }}</h2>
                    <p>{{ $t('dashboard.settings.shop.desc') }}</p>
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

              <!-- Shop Hero Card -->
              <!-- <div class="shc shc-green">
            <div class="shc-glow"></div>
            <div class="shc-inner">
              <div class="shc-icon-wrap shc-icon-green">
                <Store :size="24" />
              </div>
              <div class="shc-details">
                <span class="shc-eyebrow">{{ $t('dashboard.settings.tabs.shop') }}</span>
                <span class="shc-name">{{ userData.shop.name || '—' }}</span>
                <div class="shc-chips">
                  <span class="shc-chip" :class="userData.shop.isActive ? 'shc-chip-green' : 'shc-chip-red'">
                    {{ userData.shop.isActive ? $t('dashboard.products.status.active') : $t('dashboard.products.status.inactive') }}
                  </span>
                  <span class="shc-chip shc-chip-neutral" v-if="userData.shop.address">
                    <MapPin :size="10" /> {{ userData.shop.address }}
                  </span>
                </div>
              </div>
              <div class="shc-right">
                <div class="shc-meta-item" v-if="userData.shop.phone">
                  <Phone :size="12" /> {{ userData.shop.phone }}
                </div>
                <div class="shc-meta-item" v-if="userData.shop.createdAt">
                  <Calendar :size="12" />
                  {{ new Date(userData.shop.createdAt).toLocaleDateString('uz-UZ') }}
                </div>
              </div>
            </div>
          </div> -->

              <div class="fields-grid">
                <div class="field-group col-2">
                  <label><Store class="lbl-icon" /> {{ $t('dashboard.settings.shop.name') }}</label>
                  <p class="field-highlight" v-if="!isEditing">{{ userData.shop.name || '—' }}</p>
                  <input v-else v-model="editableUser.shop.name" class="field-input" />
                </div>
                <div class="field-group">
                  <label
                    ><Phone class="lbl-icon" /> {{ $t('dashboard.settings.shop.phone') }}</label
                  >
                  <p v-if="!isEditing">{{ userData.shop.phone || '—' }}</p>
                  <input v-else v-model="editableUser.shop.phone" class="field-input" />
                </div>
                <div class="field-group">
                  <label
                    ><Activity class="lbl-icon" /> {{ $t('dashboard.settings.shop.status') }}</label
                  >
                  <span
                    class="status-badge"
                    :class="userData.shop.isActive ? 'badge-success' : 'badge-danger'"
                  >
                    {{
                      userData.shop.isActive
                        ? $t('dashboard.products.status.active')
                        : $t('dashboard.products.status.inactive')
                    }}
                  </span>
                </div>
                <div class="field-group col-2">
                  <label
                    ><MapPin class="lbl-icon" /> {{ $t('dashboard.settings.shop.address') }}</label
                  >
                  <p v-if="!isEditing">{{ userData.shop.address || '—' }}</p>
                  <input v-else v-model="editableUser.shop.address" class="field-input" />
                </div>
                <div class="field-group">
                  <label
                    ><Calendar class="lbl-icon" />
                    {{ $t('dashboard.settings.shop.created_at') }}</label
                  >
                  <p class="text-muted">
                    {{
                      userData.shop.createdAt
                        ? new Date(userData.shop.createdAt).toLocaleString('uz-UZ')
                        : '—'
                    }}
                  </p>
                </div>
              </div>
            </div>

            <!-- ── Subscription ── -->
            <div v-if="activeTab === 'subscription' && userData.subscription" class="tab-pane">
              <div class="pane-header">
                <div class="pane-header-left">
                  <div class="pane-icon amber"><Zap :size="18" /></div>
                  <div>
                    <h2>{{ $t('dashboard.settings.subscription.title') }}</h2>
                    <p>{{ $t('dashboard.settings.subscription.desc') }}</p>
                  </div>
                </div>
              </div>

              <!-- Plan Hero Card -->
              <!-- <div class="sub-hero-card" :class="subStatusClass">
            <div class="sub-hero-bg"></div>
            <div class="sub-hero-inner">
              <div class="sub-hero-left">
                <div class="sub-plan-icon-wrap">
                  <Zap :size="22" />
                </div>
                <div class="sub-plan-info">
                  <span class="sub-plan-label">{{ $t('dashboard.settings.subscription.current_plan') }}</span>
                  <span class="sub-plan-name">{{ userData.subscription.planDisplayName }}</span>
                  <span class="sub-plan-status-text">{{ userData.subscription.statusLabel }}</span>
                </div>
              </div>
              <div class="sub-hero-right">
                <div class="sub-days-bubble" :class="subUrgencyClass">
                  <span class="sub-days-num">{{ userData.subscription.daysRemaining }}</span>
                  <span class="sub-days-text">{{ $t('dashboard.settings.subscription.days_left_label') }}</span>
                </div>
                <div class="sub-end-date">
                  <CalendarClock :size="13" />
                  {{ userData.subscription.endDate ? new Date(userData.subscription.endDate).toLocaleDateString('uz-UZ') : '—' }}
                  {{ $t('dashboard.settings.subscription.trial_ends') }}
                </div>
              </div>
            </div>
          </div> -->

              <div class="fields-grid">
                <div class="field-group">
                  <label
                    ><Zap class="lbl-icon" />
                    {{ $t('dashboard.settings.subscription.plan_name') }}</label
                  >
                  <p class="field-highlight">{{ userData.subscription.planDisplayName || '—' }}</p>
                </div>
                <div class="field-group">
                  <label
                    ><Activity class="lbl-icon" />
                    {{ $t('dashboard.settings.subscription.status') }}</label
                  >
                  <span
                    class="status-badge"
                    :class="{
                      'badge-trial':
                        userData.subscription.isTrial && !userData.subscription.isExpired,
                      'badge-success':
                        !userData.subscription.isTrial && !userData.subscription.isExpired,
                      'badge-danger': userData.subscription.isExpired,
                    }"
                    >{{ userData.subscription.statusLabel }}</span
                  >
                </div>
                <div class="field-group">
                  <label
                    ><Calendar class="lbl-icon" />
                    {{ $t('dashboard.settings.subscription.end_date') }}</label
                  >
                  <p class="text-muted">
                    {{
                      userData.subscription.endDate
                        ? new Date(userData.subscription.endDate).toLocaleString('uz-UZ')
                        : '—'
                    }}
                  </p>
                </div>
                <div class="field-group">
                  <label
                    ><Clock class="lbl-icon" />
                    {{ $t('dashboard.settings.subscription.days_remaining') }}</label
                  >
                  <p
                    :class="
                      subUrgencyClass === 'urgency-critical'
                        ? 'text-danger-bold'
                        : subUrgencyClass === 'urgency-warning'
                          ? 'text-warning-bold'
                          : ''
                    "
                  >
                    {{ userData.subscription.daysRemaining ?? '—' }}
                  </p>
                </div>
                <div class="field-group">
                  <label
                    ><BadgeCheck class="lbl-icon" />
                    {{ $t('dashboard.settings.subscription.is_trial') }}</label
                  >
                  <span
                    class="status-badge"
                    :class="userData.subscription.isTrial ? 'badge-trial' : 'badge-success'"
                  >
                    {{
                      userData.subscription.isTrial
                        ? $t('dashboard.settings.subscription.yes')
                        : $t('dashboard.settings.subscription.no')
                    }}
                  </span>
                </div>
                <div class="field-group">
                  <label
                    ><AlertTriangle class="lbl-icon" />
                    {{ $t('dashboard.settings.subscription.is_expired') }}</label
                  >
                  <span
                    class="status-badge"
                    :class="userData.subscription.isExpired ? 'badge-danger' : 'badge-success'"
                  >
                    {{
                      userData.subscription.isExpired
                        ? $t('dashboard.settings.subscription.yes')
                        : $t('dashboard.settings.subscription.no')
                    }}
                  </span>
                </div>
              </div>
            </div>

            <!-- ── Security ── -->
            <div v-if="activeTab === 'security'" class="tab-pane">
              <div class="pane-header">
                <div class="pane-header-left">
                  <div class="pane-icon red"><ShieldCheck :size="18" /></div>
                  <div>
                    <h2>{{ $t('dashboard.settings.security.title') }}</h2>
                    <p>{{ $t('dashboard.settings.security.desc') }}</p>
                  </div>
                </div>
              </div>

              <!-- Security Hero Card -->
              <!-- <div class="shc shc-red">
            <div class="shc-glow"></div>
            <div class="shc-inner">
              <div class="shc-icon-wrap shc-icon-red">
                <ShieldCheck :size="26" />
              </div>
              <div class="shc-details">
                <span class="shc-eyebrow">{{ $t('dashboard.settings.security.title') }}</span>
                <span class="shc-name">{{ $t('dashboard.settings.security.desc') }}</span>
                <div class="shc-chips">
                  <span class="shc-chip shc-chip-green">
                    <ShieldCheck :size="10" /> {{ $t('dashboard.products.status.active') }}
                  </span>
                </div>
              </div>
              <div class="shc-right">
                <div class="shc-security-lock">
                  <Lock :size="28" class="shc-lock-icon" />
                </div>
              </div>
            </div>
          </div> -->

              <!-- Password Form -->
              <form @submit.prevent="updateSecuritySettings" class="security-form">
                <div class="pw-field-stack">
                  <div class="pw-field-row">
                    <div class="pw-field-card">
                      <div class="pw-field-label">
                        <KeyRound :size="13" />
                        {{ $t('dashboard.settings.security.current_password') }}
                      </div>
                      <div class="pw-wrap">
                        <input
                          v-model="securitySettings.currentPassword"
                          :type="showCurrentPassword ? 'text' : 'password'"
                          class="field-input"
                          placeholder="••••••••"
                          required
                        />
                        <button
                          type="button"
                          class="pw-toggle"
                          @click="showCurrentPassword = !showCurrentPassword"
                        >
                          <Eye v-if="showCurrentPassword" :size="17" />
                          <EyeOff v-else :size="17" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div class="pw-field-row pw-row-2">
                    <div class="pw-field-card">
                      <div class="pw-field-label">
                        <Lock :size="13" />
                        {{ $t('dashboard.settings.security.new_password') }}
                      </div>
                      <div class="pw-wrap">
                        <input
                          v-model="securitySettings.newPassword"
                          :type="showNewPassword ? 'text' : 'password'"
                          class="field-input"
                          placeholder="••••••••"
                          required
                        />
                        <button
                          type="button"
                          class="pw-toggle"
                          @click="showNewPassword = !showNewPassword"
                        >
                          <Eye v-if="showNewPassword" :size="17" />
                          <EyeOff v-else :size="17" />
                        </button>
                      </div>
                    </div>
                    <div class="pw-field-card">
                      <div class="pw-field-label">
                        <Check :size="13" />
                        {{ $t('dashboard.settings.security.confirm_password') }}
                      </div>
                      <div class="pw-wrap">
                        <input
                          v-model="securitySettings.confirmPassword"
                          :type="showConfirmPassword ? 'text' : 'password'"
                          class="field-input"
                          placeholder="••••••••"
                          required
                        />
                        <button
                          type="button"
                          class="pw-toggle"
                          @click="showConfirmPassword = !showConfirmPassword"
                        >
                          <Eye v-if="showConfirmPassword" :size="17" />
                          <EyeOff v-else :size="17" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="form-actions">
                  <button
                    type="submit"
                    class="btn btn-primary-gradient"
                    :disabled="SecurityLoading"
                  >
                    <Save :size="15" v-if="!SecurityLoading" />
                    <span v-if="SecurityLoading" class="spinner"></span>
                    {{
                      SecurityLoading
                        ? $t('dashboard.settings.security.updating')
                        : $t('dashboard.settings.security.update_password_btn')
                    }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Transition>
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
  flex-shrink: 0;
  animation: blink 1.8s ease-in-out infinite;
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}

.hero-title {
  font-size: clamp(1.5rem, 2.8vw, 2rem);
  font-weight: 800;
  color: #0f172a;
  line-height: 1.15;
  letter-spacing: -0.02em;
  margin: 0;
}

.hero-subtitle {
  font-size: 0.9rem;
  color: #64748b;
  margin: 0;
}

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

.avatar-status.online {
  background: #10b981;
}
.avatar-status.offline {
  background: #94a3b8;
}

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
  box-shadow: inset 0 0 0 1px rgba(0, 123, 255, 0.15);
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
}
.tab-transition-wrap {
  width: 100%;
}

.tab-fade-enter-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.tab-fade-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}
.tab-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.tab-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* Pane header */
.pane-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding-bottom: 1.5rem;
  margin-bottom: 1.5rem;
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

.pane-icon.blue {
  background: rgba(0, 123, 255, 0.1);
  color: #007bff;
}
.pane-icon.indigo {
  background: rgba(99, 102, 241, 0.1);
  color: #6366f1;
}
.pane-icon.green {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}
.pane-icon.red {
  background: rgba(239, 68, 68, 0.08);
  color: #ef4444;
}
.pane-icon.amber {
  background: rgba(245, 158, 11, 0.1);
  color: #d97706;
}

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

/* ─── Section Hero Cards (SHC) ──────────────────── */
.shc {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.shc-blue {
  background: linear-gradient(135deg, #0a1628 0%, #0d1f3c 50%, #0a1628 100%);
}
.shc-indigo {
  background: linear-gradient(135deg, #0d0d2a 0%, #151536 50%, #0d0d2a 100%);
}
.shc-green {
  background: linear-gradient(135deg, #071a0e 0%, #0d2618 50%, #071a0e 100%);
}
.shc-red {
  background: linear-gradient(135deg, #1a0909 0%, #2a1010 50%, #1a0909 100%);
}

.shc-glow {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.shc-blue .shc-glow {
  background:
    radial-gradient(circle at 75% 50%, rgba(0, 123, 255, 0.18) 0%, transparent 65%),
    radial-gradient(circle at 15% 80%, rgba(99, 102, 241, 0.1) 0%, transparent 50%);
}
.shc-indigo .shc-glow {
  background:
    radial-gradient(circle at 75% 50%, rgba(99, 102, 241, 0.2) 0%, transparent 65%),
    radial-gradient(circle at 15% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%);
}
.shc-green .shc-glow {
  background:
    radial-gradient(circle at 75% 50%, rgba(16, 185, 129, 0.2) 0%, transparent 65%),
    radial-gradient(circle at 15% 80%, rgba(52, 211, 153, 0.08) 0%, transparent 50%);
}
.shc-red .shc-glow {
  background:
    radial-gradient(circle at 75% 50%, rgba(239, 68, 68, 0.18) 0%, transparent 65%),
    radial-gradient(circle at 15% 80%, rgba(252, 165, 165, 0.08) 0%, transparent 50%);
}

.shc-inner {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1.5rem 1.75rem;
  flex-wrap: wrap;
}

.shc-avatar-wrap {
  position: relative;
  flex-shrink: 0;
}

.shc-avatar {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(0, 123, 255, 0.4), rgba(99, 102, 241, 0.4));
  border: 2px solid rgba(0, 123, 255, 0.35);
  color: #fff;
  font-size: 1.2rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 0.02em;
  box-shadow: 0 0 20px rgba(0, 123, 255, 0.2);
}

.shc-online-dot {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  border: 2.5px solid #0a1628;
}
.dot-online {
  background: #10b981;
}
.dot-offline {
  background: #64748b;
}

.shc-icon-wrap {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.shc-icon-indigo {
  background: rgba(99, 102, 241, 0.2);
  border: 1px solid rgba(99, 102, 241, 0.35);
  color: #a5b4fc;
  box-shadow: 0 0 24px rgba(99, 102, 241, 0.2);
}

.shc-icon-green {
  background: rgba(16, 185, 129, 0.2);
  border: 1px solid rgba(16, 185, 129, 0.35);
  color: #6ee7b7;
  box-shadow: 0 0 24px rgba(16, 185, 129, 0.2);
}

.shc-icon-red {
  background: rgba(239, 68, 68, 0.2);
  border: 1px solid rgba(239, 68, 68, 0.35);
  color: #fca5a5;
  box-shadow: 0 0 24px rgba(239, 68, 68, 0.2);
}

.shc-details {
  display: flex;
  flex-direction: column;
  gap: 5px;
  flex: 1;
}

.shc-eyebrow {
  font-size: 0.68rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.shc-name {
  font-size: 1.25rem;
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.shc-chips {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: 2px;
}

.shc-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.68rem;
  font-weight: 600;
  padding: 3px 9px;
  border-radius: 100px;
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.65);
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.shc-chip-blue {
  background: rgba(0, 123, 255, 0.2);
  color: #93c5fd;
  border-color: rgba(0, 123, 255, 0.3);
}
.shc-chip-green {
  background: rgba(16, 185, 129, 0.2);
  color: #6ee7b7;
  border-color: rgba(16, 185, 129, 0.3);
}
.shc-chip-red {
  background: rgba(239, 68, 68, 0.2);
  color: #fca5a5;
  border-color: rgba(239, 68, 68, 0.3);
}
.shc-chip-mono {
  font-family: 'Courier New', monospace;
  letter-spacing: 0.5px;
}
.shc-chip-neutral {
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.shc-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
  margin-left: auto;
}

.shc-meta-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.38);
  font-weight: 500;
}

.shc-security-lock {
  color: rgba(255, 255, 255, 0.12);
}
.shc-lock-icon {
  stroke-width: 1.2;
}

/* ─── Fields grid ───────────────────────────────── */
.fields-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.col-2 {
  grid-column: span 2;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: #f9fafb;
  border: 1px solid #eef2f7;
  border-radius: 12px;
  padding: 1rem 1.1rem;
  transition:
    background 0.15s,
    border-color 0.15s;
}

.field-group:hover {
  background: #f1f5f9;
  border-color: #e2e8f0;
}

.field-group label {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.69rem;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.07em;
}

.lbl-icon {
  width: 12px;
  height: 12px;
  stroke-width: 2.5;
}

.field-group p {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: #0f172a;
}

.field-highlight {
  font-size: 1.1rem !important;
  font-weight: 700 !important;
  color: #0f172a !important;
}
.text-muted {
  color: #64748b !important;
  font-weight: 500 !important;
}
.mono {
  font-family: 'Courier New', monospace;
  letter-spacing: 1px;
}

.field-input {
  width: 100%;
  padding: 0.65rem 0.9rem;
  background: #fff;
  border: 1.5px solid #e2e8f0;
  border-radius: 9px;
  font-size: 0.93rem;
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
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

/* Status badges */
.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 100px;
  font-size: 0.78rem;
  font-weight: 700;
  width: fit-content;
  letter-spacing: 0.01em;
}

.badge-success {
  background: #dcfce7;
  color: #166534;
}
.badge-danger {
  background: #fee2e2;
  color: #991b1b;
}
.badge-trial {
  background: rgba(245, 158, 11, 0.12);
  color: #92400e;
  border: 1px solid rgba(245, 158, 11, 0.25);
}

/* ─── Subscription Hero ─────────────────────────── */
.sub-hero-card {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.sub-hero-card.sub-status-trial {
  background: linear-gradient(135deg, #1c1917 0%, #292524 50%, #1c1917 100%);
}
.sub-hero-card.sub-status-active {
  background: linear-gradient(135deg, #052e16 0%, #14532d 50%, #052e16 100%);
}
.sub-hero-card.sub-status-expired {
  background: linear-gradient(135deg, #1f0606 0%, #450a0a 50%, #1f0606 100%);
}

.sub-hero-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image:
    radial-gradient(circle at 80% 50%, rgba(245, 158, 11, 0.12) 0%, transparent 60%),
    radial-gradient(circle at 20% 80%, rgba(99, 102, 241, 0.08) 0%, transparent 50%);
}

.sub-status-active .sub-hero-bg {
  background-image:
    radial-gradient(circle at 80% 50%, rgba(16, 185, 129, 0.15) 0%, transparent 60%),
    radial-gradient(circle at 20% 80%, rgba(52, 211, 153, 0.07) 0%, transparent 50%);
}
.sub-status-expired .sub-hero-bg {
  background-image:
    radial-gradient(circle at 80% 50%, rgba(239, 68, 68, 0.15) 0%, transparent 60%),
    radial-gradient(circle at 20% 80%, rgba(252, 165, 165, 0.07) 0%, transparent 50%);
}

.sub-hero-inner {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  padding: 1.75rem 2rem;
  flex-wrap: wrap;
}

.sub-hero-left {
  display: flex;
  align-items: center;
  gap: 1.1rem;
}

.sub-plan-icon-wrap {
  width: 48px;
  height: 48px;
  border-radius: 13px;
  background: rgba(245, 158, 11, 0.18);
  border: 1px solid rgba(245, 158, 11, 0.3);
  color: #fbbf24;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 0 20px rgba(245, 158, 11, 0.15);
}

.sub-status-active .sub-plan-icon-wrap {
  background: rgba(16, 185, 129, 0.18);
  border-color: rgba(16, 185, 129, 0.3);
  color: #34d399;
  box-shadow: 0 0 20px rgba(16, 185, 129, 0.15);
}
.sub-status-expired .sub-plan-icon-wrap {
  background: rgba(239, 68, 68, 0.18);
  border-color: rgba(239, 68, 68, 0.3);
  color: #f87171;
  box-shadow: 0 0 20px rgba(239, 68, 68, 0.15);
}

.sub-plan-info {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.sub-plan-label {
  font-size: 0.7rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.45);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.sub-plan-name {
  font-size: 1.35rem;
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.02em;
  line-height: 1.15;
}
.sub-plan-status-text {
  font-size: 0.82rem;
  color: rgba(255, 255, 255, 0.55);
  font-weight: 500;
}

.sub-hero-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}

.sub-days-bubble {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 14px;
  padding: 0.65rem 1.25rem;
  backdrop-filter: blur(6px);
  min-width: 90px;
}

.sub-days-bubble.urgency-critical {
  background: rgba(239, 68, 68, 0.15);
  border-color: rgba(239, 68, 68, 0.35);
}
.sub-days-bubble.urgency-warning {
  background: rgba(245, 158, 11, 0.15);
  border-color: rgba(245, 158, 11, 0.35);
}
.sub-days-bubble.urgency-ok {
  background: rgba(16, 185, 129, 0.12);
  border-color: rgba(16, 185, 129, 0.3);
}

.sub-days-num {
  font-size: 2rem;
  font-weight: 900;
  line-height: 1;
  color: #fff;
  letter-spacing: -0.03em;
}

.urgency-critical .sub-days-num {
  color: #fca5a5;
}
.urgency-warning .sub-days-num {
  color: #fcd34d;
}
.urgency-ok .sub-days-num {
  color: #6ee7b7;
}

.sub-days-text {
  font-size: 0.68rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: 2px;
}

.sub-end-date {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.4);
  font-weight: 500;
}

.text-danger-bold {
  color: #dc2626 !important;
  font-weight: 700 !important;
}
.text-warning-bold {
  color: #d97706 !important;
  font-weight: 700 !important;
}

/* ─── Security form ─────────────────────────────── */
.security-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.pw-field-stack {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.pw-field-row {
  display: flex;
}
.pw-row-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.pw-field-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: #f9fafb;
  border: 1px solid #eef2f7;
  border-radius: 12px;
  padding: 1rem 1.1rem;
  flex: 1;
  transition: border-color 0.2s;
}

.pw-field-card:focus-within {
  border-color: rgba(0, 123, 255, 0.3);
  background: #f8faff;
}

.pw-field-label {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.69rem;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.07em;
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

.pw-toggle:hover {
  color: #007bff;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  padding-top: 0.25rem;
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

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ─── Responsive ────────────────────────────────── */
@media (max-width: 960px) {
  .settings-container {
    flex-direction: column;
  }

  .settings-sidebar {
    width: 100%;
    flex-direction: row;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    white-space: nowrap;
    padding: 0.5rem;
    gap: 4px;
  }

  .settings-sidebar::-webkit-scrollbar {
    display: none;
  }
  .sidebar-label {
    display: none;
  }

  .tab-btn {
    white-space: nowrap;
    padding: 0.55rem 0.9rem;
    flex-shrink: 0;
    width: auto;
  }
  .tab-arrow {
    display: none;
  }
}

@media (max-width: 680px) {
  .hero-user-card {
    display: none;
  }

  .fields-grid {
    grid-template-columns: 1fr;
  }
  .col-2 {
    grid-column: span 1;
  }

  .pw-row-2 {
    grid-template-columns: 1fr;
  }

  .pane-header {
    flex-direction: column;
  }
  .tab-pane {
    padding: 1.25rem;
  }

  .shc-right {
    display: none;
  }
  .sub-hero-right {
    display: none;
  }
}
</style>
