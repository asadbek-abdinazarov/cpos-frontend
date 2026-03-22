<script setup>
import { ref, onMounted } from 'vue'
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
} from 'lucide-vue-next'
import { getUserProfile, updatePassword } from '@/services/api'
import { useNotification } from '@/composables/useNotification'

const { showNotification } = useNotification()

const activeTab = ref('personal')

// Tab configuration
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

      // Filter tabs based on available data
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
  // Mock save API behavior
  Object.assign(userData.value, editableUser.value)
  isEditing.value = false
  showNotification({ type: 'success', message: 'Profile updated successfully!' })
}

// Mock Data for other tabs
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
    <div class="page-header">
      <h1 class="page-title">{{ $t('dashboard.settings.title') }}</h1>
      <p class="text-subtitle">{{ $t('dashboard.settings.subtitle') }}</p>
    </div>

    <div class="settings-container">
      <!-- Sidebar / Tabs -->
      <div class="settings-sidebar card">
        <button
          v-for="tab in availableTabs"
          :key="tab.id"
          class="tab-btn"
          :class="{ active: activeTab === tab.id }"
          @click="setActiveTab(tab.id)"
        >
          <component :is="tab.icon" class="tab-icon" />
          {{ $t('dashboard.settings.tabs.' + tab.id) }}
        </button>
      </div>

      <!-- Content Area -->
      <div class="settings-content card">
        <!-- Personal Info Tab -->
        <div v-if="activeTab === 'personal'" class="tab-pane">
          <div class="pane-header">
            <div class="header-titles">
              <h2>{{ $t('dashboard.settings.personal.title') }}</h2>
              <p>{{ $t('dashboard.settings.personal.desc') }}</p>
            </div>
            <div class="card-actions">
              <button v-if="!isEditing" class="action-btn edit" @click="startEditing">
                <Pencil class="icon-sm" /> {{ $t('dashboard.settings.buttons.edit') }}
              </button>
              <div v-else class="action-group">
                <button class="action-btn cancel" @click="cancelEditing">
                  <XIcon class="icon-sm" /> {{ $t('dashboard.settings.buttons.cancel') }}
                </button>
                <button class="action-btn save" @click="saveChanges">
                  <Check class="icon-sm" /> {{ $t('dashboard.settings.buttons.save') }}
                </button>
              </div>
            </div>
          </div>

          <div class="card-body grid-2">
            <div class="data-group">
              <label
                ><User class="label-icon" />
                {{ $t('dashboard.settings.personal.first_name') }}</label
              >
              <p v-if="!isEditing">{{ userData.firstName || '—' }}</p>
              <input v-else v-model="editableUser.firstName" class="premium-input" />
            </div>
            <div class="data-group">
              <label
                ><User class="label-icon" />
                {{ $t('dashboard.settings.personal.last_name') }}</label
              >
              <p v-if="!isEditing">{{ userData.lastName || '—' }}</p>
              <input v-else v-model="editableUser.lastName" class="premium-input" />
            </div>
            <div class="data-group">
              <label
                ><User class="label-icon" /> {{ $t('dashboard.settings.personal.username') }}</label
              >
              <p v-if="!isEditing">{{ userData.username || '—' }}</p>
              <input v-else v-model="editableUser.username" class="premium-input" />
            </div>
            <div class="data-group">
              <label
                ><Phone class="label-icon" /> {{ $t('dashboard.settings.personal.phone') }}</label
              >
              <p v-if="!isEditing">{{ userData.phone || '—' }}</p>
              <input v-else v-model="editableUser.phone" class="premium-input" />
            </div>
            <div class="data-group">
              <label
                ><Mail class="label-icon" /> {{ $t('dashboard.settings.personal.email') }}</label
              >
              <p v-if="!isEditing">{{ userData.email || '—' }}</p>
              <input v-else v-model="editableUser.email" class="premium-input" />
            </div>
            <div class="data-group">
              <label
                ><Activity class="label-icon" />
                {{ $t('dashboard.settings.personal.status') }}</label
              >
              <span
                class="status-badge sm"
                :class="userData.isActive ? 'badge-success' : 'badge-danger'"
              >
                {{
                  userData.isActive
                    ? $t('dashboard.products.status.active')
                    : $t('dashboard.products.status.inactive')
                }}
              </span>
            </div>
            <div class="data-group">
              <label
                ><Calendar class="label-icon" />
                {{ $t('dashboard.settings.personal.created_at') }}</label
              >
              <p class="text-subtle">
                {{
                  userData.createdAt ? new Date(userData.createdAt).toLocaleString('uz-UZ') : '—'
                }}
              </p>
            </div>
            <div class="data-group">
              <label
                ><Clock class="label-icon" />
                {{ $t('dashboard.settings.personal.updated_at') }}</label
              >
              <p class="text-subtle">
                {{
                  userData.updatedAt ? new Date(userData.updatedAt).toLocaleString('uz-UZ') : '—'
                }}
              </p>
            </div>
          </div>
        </div>

        <!-- Organization Tab -->
        <div v-if="activeTab === 'organization' && userData.organization" class="tab-pane">
          <div class="pane-header">
            <div class="header-titles">
              <h2>{{ $t('dashboard.settings.organization.title') }}</h2>
              <p>{{ $t('dashboard.settings.organization.desc') }}</p>
            </div>
            <div class="card-actions">
              <button v-if="!isEditing" class="action-btn edit" @click="startEditing">
                <Pencil class="icon-sm" /> {{ $t('dashboard.settings.buttons.edit') }}
              </button>
              <div v-else class="action-group">
                <button class="action-btn cancel" @click="cancelEditing">
                  <XIcon class="icon-sm" /> {{ $t('dashboard.settings.buttons.cancel') }}
                </button>
                <button class="action-btn save" @click="saveChanges">
                  <Check class="icon-sm" /> {{ $t('dashboard.settings.buttons.save') }}
                </button>
              </div>
            </div>
          </div>

          <div class="card-body grid-2">
            <div class="data-group col-span-2">
              <label
                ><Building2 class="label-icon" />
                {{ $t('dashboard.settings.organization.name') }}</label
              >
              <h4 class="highlight-text" v-if="!isEditing">
                {{ userData.organization.name || '—' }}
              </h4>
              <input v-else v-model="editableUser.organization.name" class="premium-input" />
            </div>
            <div class="data-group">
              <label
                ><Hash class="label-icon" /> {{ $t('dashboard.settings.organization.stir') }}</label
              >
              <p class="mono-text" v-if="!isEditing">{{ userData.organization.stir || '—' }}</p>
              <input
                v-else
                v-model="editableUser.organization.stir"
                class="premium-input mono-text"
              />
            </div>
            <div class="data-group">
              <label
                ><Phone class="label-icon" />
                {{ $t('dashboard.settings.organization.phone') }}</label
              >
              <p v-if="!isEditing">{{ userData.organization.phone || '—' }}</p>
              <input v-else v-model="editableUser.organization.phone" class="premium-input" />
            </div>
            <div class="data-group">
              <label
                ><Activity class="label-icon" />
                {{ $t('dashboard.settings.organization.status') }}</label
              >
              <span
                class="status-badge sm"
                :class="userData.organization.isActive ? 'badge-success' : 'badge-danger'"
              >
                {{
                  userData.organization.isActive
                    ? $t('dashboard.products.status.active')
                    : $t('dashboard.products.status.inactive')
                }}
              </span>
            </div>
            <div class="data-group">
              <label
                ><Calendar class="label-icon" />
                {{ $t('dashboard.settings.organization.created_at') }}</label
              >
              <p class="text-subtle">
                {{
                  userData.organization.createdAt
                    ? new Date(userData.organization.createdAt).toLocaleString('uz-UZ')
                    : '—'
                }}
              </p>
            </div>
            <div class="data-group col-span-2">
              <label
                ><MapPin class="label-icon" /> {{ $t('dashboard.settings.shop.address') }}</label
              >
              <p v-if="!isEditing">{{ userData.organization.address || '—' }}</p>
              <input v-else v-model="editableUser.organization.address" class="premium-input" />
            </div>
          </div>
        </div>

        <!-- Shop Tab -->
        <div v-if="activeTab === 'shop' && userData.shop" class="tab-pane">
          <div class="pane-header">
            <div class="header-titles">
              <h2>Shop Details</h2>
              <p>Information about your primary store branch.</p>
            </div>
            <div class="card-actions">
              <button v-if="!isEditing" class="action-btn edit" @click="startEditing">
                <Pencil class="icon-sm" /> Edit
              </button>
              <div v-else class="action-group">
                <button class="action-btn cancel" @click="cancelEditing">
                  <XIcon class="icon-sm" /> Cancel
                </button>
                <button class="action-btn save" @click="saveChanges">
                  <Check class="icon-sm" /> Save
                </button>
              </div>
            </div>
          </div>

          <div class="card-body grid-2">
            <div class="data-group col-span-2">
              <label><Store class="label-icon" /> {{ $t('dashboard.settings.shop.name') }}</label>
              <h4 class="highlight-text" v-if="!isEditing">{{ userData.shop.name || '—' }}</h4>
              <input v-else v-model="editableUser.shop.name" class="premium-input" />
            </div>
            <div class="data-group">
              <label><Phone class="label-icon" /> {{ $t('dashboard.settings.shop.phone') }}</label>
              <p v-if="!isEditing">{{ userData.shop.phone || '—' }}</p>
              <input v-else v-model="editableUser.shop.phone" class="premium-input" />
            </div>
            <div class="data-group">
              <label
                ><Activity class="label-icon" /> {{ $t('dashboard.settings.shop.status') }}</label
              >
              <span
                class="status-badge sm"
                :class="userData.shop.isActive ? 'badge-success' : 'badge-danger'"
              >
                {{
                  userData.shop.isActive
                    ? $t('dashboard.products.status.active')
                    : $t('dashboard.products.status.inactive')
                }}
              </span>
            </div>
            <div class="data-group">
              <label
                ><Calendar class="label-icon" />
                {{ $t('dashboard.settings.shop.created_at') }}</label
              >
              <p class="text-subtle">
                {{
                  userData.shop.createdAt
                    ? new Date(userData.shop.createdAt).toLocaleString('uz-UZ')
                    : '—'
                }}
              </p>
            </div>
            <div class="data-group col-span-2">
              <label
                ><MapPin class="label-icon" /> {{ $t('dashboard.settings.shop.address') }}</label
              >
              <p v-if="!isEditing">{{ userData.shop.address || '—' }}</p>
              <input v-else v-model="editableUser.shop.address" class="premium-input" />
            </div>
          </div>
        </div>

        <!-- Security Tab -->
        <div v-if="activeTab === 'security'" class="tab-pane">
          <div class="pane-header">
            <div class="header-titles">
              <h2>{{ $t('dashboard.settings.security.title') }}</h2>
              <p>{{ $t('dashboard.settings.security.desc') }}</p>
            </div>
          </div>

          <form @submit.prevent="updateSecuritySettings" class="settings-form">
            <div class="form-group">
              <label>{{ $t('dashboard.settings.security.current_password') }}</label>
              <div class="password-input-wrapper">
                <input
                  v-model="securitySettings.currentPassword"
                  :type="showCurrentPassword ? 'text' : 'password'"
                  class="premium-input"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  class="password-toggle"
                  @click="showCurrentPassword = !showCurrentPassword"
                >
                  <Eye v-if="showCurrentPassword" class="icon" />
                  <EyeOff v-else class="icon" />
                </button>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>{{ $t('dashboard.settings.security.new_password') }}</label>
                <div class="password-input-wrapper">
                  <input
                    v-model="securitySettings.newPassword"
                    :type="showNewPassword ? 'text' : 'password'"
                    class="premium-input"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    class="password-toggle"
                    @click="showNewPassword = !showNewPassword"
                  >
                    <Eye v-if="showNewPassword" class="icon" />
                    <EyeOff v-else class="icon" />
                  </button>
                </div>
              </div>
              <div class="form-group">
                <label>{{ $t('dashboard.settings.security.confirm_password') }}</label>
                <div class="password-input-wrapper">
                  <input
                    v-model="securitySettings.confirmPassword"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    class="premium-input"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    class="password-toggle"
                    @click="showConfirmPassword = !showConfirmPassword"
                  >
                    <Eye v-if="showConfirmPassword" class="icon" />
                    <EyeOff v-else class="icon" />
                  </button>
                </div>
              </div>
            </div>

            <hr class="separator" />

            <!-- <div class="toggle-section">
              <div class="toggle-info">
                <div class="toggle-header">
                  <Lock class="icon-md text-primary" />
                  <h3>Two-Factor Authentication</h3>
                </div>
                <p>Add an extra layer of security to your account.</p>
              </div>
              <div class="toggle-switch">
                <input type="checkbox" id="2fa" v-model="securitySettings.twoFactor" />
                <label for="2fa"></label>
              </div>
            </div> -->

            <div class="form-actions">
              <button type="submit" class="btn btn-primary" :disabled="SecurityLoading">
                <Save class="icon-sm" v-if="!SecurityLoading" />
                <span v-if="SecurityLoading" class="spinner-small"></span>
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
    </div>
  </div>
</template>

<style scoped>
.settings-page {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 0.5rem;
}

.page-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.25rem;
}

.text-subtitle {
  color: #64748b;
  font-size: 0.95rem;
}

.status-indicator {
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 4px solid #2563eb;
}

.status-indicator.active {
  background-color: #10b981;
}
.status-indicator.inactive {
  background-color: #ef4444;
}

.hero-text {
  color: white;
}

.user-fullname {
  font-size: 1.5rem;
  margin: 0 0 0.2rem 0;
  font-weight: 700;
}

.user-username {
  font-size: 0.95rem;
  opacity: 0.8;
  margin: 0 0 1rem 0;
}

.user-badges {
  display: flex;
  gap: 0.5rem;
}

.role-badge {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.25rem 0.8rem;
  border-radius: 99px;
  font-size: 0.85rem;
  font-weight: 600;
  backdrop-filter: blur(4px);
}

.status-badge {
  padding: 0.25rem 0.8rem;
  border-radius: 99px;
  font-size: 0.85rem;
  font-weight: 600;
}

.badge-success {
  background: #dcfce7;
  color: #166534;
}
.badge-danger {
  background: #fee2e2;
  color: #991b1b;
}

/* Main Settings Layout */
.settings-container {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
}

.card {
  background: white;
  border-radius: 16px;
  border: 1px solid #f1f5f9;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

/* Sidebar */
.settings-sidebar {
  width: 260px;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  padding: 1rem;
  gap: 0.25rem;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 1rem;
  background: transparent;
  border: none;
  border-radius: 10px;
  color: #64748b;
  font-weight: 500;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;
}

.tab-btn:hover {
  background-color: #f8fafc;
  color: #0f172a;
}

.tab-btn.active {
  background-color: #eff6ff;
  color: #2563eb;
  font-weight: 600;
}

.tab-icon {
  width: 18px;
  height: 18px;
}

/* Content Area */
.settings-content {
  flex: 1;
  min-height: 480px;
}

.tab-pane {
  padding: 2.5rem;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.pane-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  border-bottom: 2px solid #f8fafc;
  padding-bottom: 1.5rem;
}

.header-titles h2 {
  font-size: 1.4rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.25rem 0;
}

.header-titles p {
  color: #64748b;
  font-size: 0.95rem;
  margin: 0;
}

/* Edit actions */
.card-actions {
  display: flex;
  gap: 0.5rem;
}
.action-group {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid #e2e8f0;
  background: white;
  color: #64748b;
}

.action-btn.edit:hover {
  background: #f8fafc;
  color: #2563eb;
  border-color: #cbd5e1;
}
.action-btn.save {
  background: #2563eb;
  color: white;
  border-color: #2563eb;
}
.action-btn.save:hover {
  background: #1d4ed8;
}
.action-btn.cancel:hover {
  background: #fef2f2;
  color: #ef4444;
  border-color: #fca5a5;
}

/* Data Grid */
.grid-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
}

.col-span-2 {
  grid-column: span 2;
}

.data-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.data-group label {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.label-icon {
  width: 14px;
  height: 14px;
  stroke-width: 2.5;
}

.data-group p {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 500;
  color: #1e293b;
  word-break: break-word;
}

.data-group .highlight-text {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
}

.data-group .text-subtle {
  color: #64748b;
}
.data-group .mono-text {
  font-family: 'Courier New', Courier, monospace;
  letter-spacing: 1px;
  font-weight: 600;
}

/* Input edit mode */
.premium-input {
  width: 100%;
  padding: 0.75rem 1rem;
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 1rem;
  color: #0f172a;
  font-weight: 500;
  transition: all 0.2s ease;
  font-family: inherit;
}

.premium-input:focus {
  outline: none;
  background: white;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

/* Forms (Security, Notifications) */
.settings-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
}
.form-row {
  display: flex;
  gap: 1.5rem;
}

.form-group label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #334155;
}

.separator {
  border: none;
  border-top: 1px solid #f1f5f9;
  margin: 1rem 0;
}

/* Password Toggle Styles */
.password-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.password-input-wrapper input {
  padding-right: 2.5rem;
}

.password-toggle {
  position: absolute;
  right: 0.75rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  transition: color 0.2s ease;
}

.password-toggle:hover {
  color: #0f172a;
}

.password-toggle .icon {
  width: 20px;
  height: 20px;
}

.spinner-small {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  display: inline-block;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}

.btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  font-size: 0.95rem;
  transition: all 0.2s;
}

.btn-primary {
  background-color: #2563eb;
  color: white;
}
.btn-primary:hover {
  background-color: #1d4ed8;
}

.toggle-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.toggle-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}
.toggle-header h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #0f172a;
}
.toggle-info p {
  color: #64748b;
  font-size: 0.9rem;
}
.text-primary {
  color: #2563eb;
}
.icon-md {
  width: 20px;
  height: 20px;
}

.toggle-switch {
  position: relative;
  width: 44px;
  height: 24px;
}
.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.toggle-switch label {
  position: absolute;
  cursor: pointer;
  inset: 0;
  background-color: #cbd5e1;
  transition: 0.4s;
  border-radius: 24px;
}
.toggle-switch label:before {
  position: absolute;
  content: '';
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}
.toggle-switch input:checked + label {
  background-color: #2563eb;
}
.toggle-switch input:checked + label:before {
  transform: translateX(20px);
}

.checkbox-row {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.checkbox-row input[type='checkbox'] {
  width: 18px;
  height: 18px;
  margin-top: 2px;
  accent-color: #2563eb;
  cursor: pointer;
}
.checkbox-row label {
  display: flex;
  flex-direction: column;
  cursor: pointer;
}
.checkbox-row label strong {
  color: #0f172a;
  font-weight: 600;
  margin-bottom: 2px;
}
.checkbox-row label span {
  color: #64748b;
  font-size: 0.9rem;
}

@media (max-width: 900px) {
  .settings-container {
    flex-direction: column;
  }
  .settings-sidebar {
    width: 100%;
    flex-direction: row;
    overflow-x: auto;
    padding: 0.5rem;
  }
  .tab-btn {
    white-space: nowrap;
    padding: 0.6rem 1rem;
  }
}

@media (max-width: 640px) {
  .grid-2 {
    grid-template-columns: 1fr;
  }
  .col-span-2 {
    grid-column: span 1;
  }
  .form-row {
    flex-direction: column;
  }
  .pane-header {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
