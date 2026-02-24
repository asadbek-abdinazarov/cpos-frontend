<script setup>
import { ref, onMounted } from 'vue'
import {
  User,
  Lock,
  Bell,
  CreditCard,
  Building2,
  Store,
  Package,
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
  Save
} from 'lucide-vue-next'
import { getUserProfile } from '@/services/api'
import { useNotification } from '@/composables/useNotification'

const { showNotification } = useNotification()

const activeTab = ref('personal')

// Tab configuration
const availableTabs = ref([
  { id: 'personal', label: 'Personal Info', icon: User },
  { id: 'organization', label: 'Organization', icon: Building2 },
  { id: 'shop', label: 'Shop', icon: Store },
  { id: 'warehouse', label: 'Warehouse', icon: Package },
  { id: 'security', label: 'Security', icon: Lock },
  { id: 'notifications', label: 'Notifications', icon: Bell }
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
  organization: null,
  shop: null
})

const editableUser = ref({})
const isEditing = ref(false)

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
        roles: u.roles ? u.roles.map(r => ({
          name: r.name,
          permissions: r.permissions ? r.permissions.map(p => ({
            name: p.name
          })) : []
        })) : [],
        organization: u.organization ? {
          name: u.organization.name || '',
          stir: u.organization.stir || '',
          address: u.organization.address || '',
          phone: u.organization.phone || '',
          isActive: !!u.organization.isActive
        } : null,
        shop: u.shop ? {
          name: u.shop.name || '',
          address: u.shop.address || '',
          phone: u.shop.phone || '',
          isActive: !!u.shop.isActive,
          warehouse: u.shop.warehouse ? {
            name: u.shop.warehouse.name || '',
            address: u.shop.warehouse.address || '',
            phone: u.shop.warehouse.phone || '',
            isActive: !!u.shop.warehouse.isActive
          } : null
        } : null
      }

      // Filter tabs based on available data
      availableTabs.value = [
        { id: 'personal', label: 'Personal Info', icon: User },
        ...(userData.value.organization ? [{ id: 'organization', label: 'Organization', icon: Building2 }] : []),
        ...(userData.value.shop ? [{ id: 'shop', label: 'Shop Details', icon: Store }] : []),
        ...(userData.value.shop && userData.value.shop.warehouse ? [{ id: 'warehouse', label: 'Warehouse', icon: Package }] : []),
        { id: 'security', label: 'Security', icon: Lock },
        { id: 'notifications', label: 'Notifications', icon: Bell }
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
  twoFactor: false
})

const notificationSettings = ref({
  emailOrder: true,
  emailStock: true,
  emailMarketing: false,
  smsOrder: false,
  pushNotifications: true
})

const saveOtherSettings = () => {
  showNotification({ type: 'success', message: 'Settings saved successfully!' })
}
</script>

<template>
  <div class="settings-page">
    <div class="page-header">
      <h1 class="page-title">Settings</h1>
      <p class="text-subtitle">Manage your account and store preferences</p>
    </div>

  

    <div class="settings-container">
      <!-- Sidebar / Tabs -->
      <div class="settings-sidebar card">
        <button
          v-for="tab in availableTabs"
          :key="tab.id"
          class="tab-btn"
          :class="{ active: activeTab === tab.id }"
          @click="activeTab = tab.id; isEditing = false"
        >
          <component :is="tab.icon" class="tab-icon" />
          {{ tab.label }}
        </button>
      </div>

      <!-- Content Area -->
      <div class="settings-content card">
        
        <!-- Personal Info Tab -->
        <div v-if="activeTab === 'personal'" class="tab-pane">
          <div class="pane-header">
            <div class="header-titles">
               <h2>Personal Information</h2>
               <p>Update your personal details and contact info.</p>
            </div>
            <div class="card-actions">
               <button v-if="!isEditing" class="action-btn edit" @click="startEditing">
                 <Pencil class="icon-sm" /> Edit
               </button>
               <div v-else class="action-group">
                 <button class="action-btn cancel" @click="cancelEditing"><XIcon class="icon-sm" /> Cancel</button>
                 <button class="action-btn save" @click="saveChanges"><Check class="icon-sm" /> Save</button>
               </div>
            </div>
          </div>

          <div class="card-body grid-2">
            <div class="data-group">
              <label><User class="label-icon"/> Username</label>
              <p v-if="!isEditing">{{ userData.username || '—' }}</p>
              <input v-else v-model="editableUser.username" class="premium-input" />
            </div>
            <div class="data-group">
              <label><Activity class="label-icon"/> Status</label>
              <span class="status-badge sm" :class="userData.isActive ? 'badge-success' : 'badge-danger'">
                    {{ userData.isActive ? 'Active' : 'Inactive' }}
              </span>
            </div>
            <div class="data-group">
              <label><User class="label-icon"/> First Name</label>
              <p v-if="!isEditing">{{ userData.firstName || '—' }}</p>
              <input v-else v-model="editableUser.firstName" class="premium-input" />
            </div>
            <div class="data-group">
              <label><User class="label-icon"/> Last Name</label>
              <p v-if="!isEditing">{{ userData.lastName || '—' }}</p>
              <input v-else v-model="editableUser.lastName" class="premium-input" />
            </div>
            <div class="data-group">
              <label><Phone class="label-icon"/> Phone Number</label>
              <p v-if="!isEditing">{{ userData.phone || '—' }}</p>
              <input v-else v-model="editableUser.phone" class="premium-input" />
            </div>
            <div class="data-group">
              <label><Mail class="label-icon"/> Email Address</label>
              <p v-if="!isEditing">{{ userData.email || '—' }}</p>
              <input v-else v-model="editableUser.email" class="premium-input" />
            </div>
             <div class="data-group">
              <label><Calendar class="label-icon"/> Created At</label>
              <p class="text-subtle">{{ userData.createdAt ? new Date(userData.createdAt).toLocaleString('uz-UZ') : '—' }}</p>
            </div>
            <div class="data-group">
              <label><Clock class="label-icon"/> Updated At</label>
              <p class="text-subtle">{{ userData.updatedAt ? new Date(userData.updatedAt).toLocaleString('uz-UZ') : '—' }}</p>
            </div>
          </div>
        </div>

        <!-- Organization Tab -->
        <div v-if="activeTab === 'organization' && userData.organization" class="tab-pane">
          <div class="pane-header">
             <div class="header-titles">
                <h2>Organization Details</h2>
                <p>Manage your company's profile information.</p>
             </div>
             <div class="card-actions">
               <button v-if="!isEditing" class="action-btn edit" @click="startEditing">
                 <Pencil class="icon-sm" /> Edit
               </button>
               <div v-else class="action-group">
                 <button class="action-btn cancel" @click="cancelEditing"><XIcon class="icon-sm" /> Cancel</button>
                 <button class="action-btn save" @click="saveChanges"><Check class="icon-sm" /> Save</button>
               </div>
            </div>
          </div>

          <div class="card-body grid-2">
            <div class="data-group col-span-2">
              <label><Building2 class="label-icon"/> Organization Name</label>
              <h4 class="highlight-text" v-if="!isEditing">{{ userData.organization.name || '—' }}</h4>
              <input v-else v-model="editableUser.organization.name" class="premium-input" />
            </div>
            <div class="data-group">
              <label><Hash class="label-icon"/> STIR</label>
              <p class="mono-text" v-if="!isEditing">{{ userData.organization.stir || '—' }}</p>
              <input v-else v-model="editableUser.organization.stir" class="premium-input mono-text" />
            </div>
            <div class="data-group">
              <label><Phone class="label-icon"/> Org Phone</label>
              <p v-if="!isEditing">{{ userData.organization.phone || '—' }}</p>
              <input v-else v-model="editableUser.organization.phone" class="premium-input" />
            </div>
            <div class="data-group col-span-2">
              <label><MapPin class="label-icon"/> Address</label>
              <p v-if="!isEditing">{{ userData.organization.address || '—' }}</p>
              <input v-else v-model="editableUser.organization.address" class="premium-input" />
            </div>
            <div class="data-group">
              <label><Activity class="label-icon"/> Status</label>
              <span class="status-badge sm" :class="userData.organization.isActive ? 'badge-success' : 'badge-danger'">
                {{ userData.organization.isActive ? 'Active' : 'Inactive' }}
              </span>
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
                 <button class="action-btn cancel" @click="cancelEditing"><XIcon class="icon-sm" /> Cancel</button>
                 <button class="action-btn save" @click="saveChanges"><Check class="icon-sm" /> Save</button>
               </div>
            </div>
          </div>

          <div class="card-body grid-2">
             <div class="data-group col-span-2">
                <label><Store class="label-icon"/> Shop Name</label>
                <h4 class="highlight-text" v-if="!isEditing">{{ userData.shop.name || '—' }}</h4>
                <input v-else v-model="editableUser.shop.name" class="premium-input" />
              </div>
              <div class="data-group">
                <label><Phone class="label-icon"/> Phone</label>
                <p v-if="!isEditing">{{ userData.shop.phone || '—' }}</p>
                <input v-else v-model="editableUser.shop.phone" class="premium-input" />
              </div>
              <div class="data-group">
                <label><Activity class="label-icon"/> Status</label>
                <span class="status-badge sm" :class="userData.shop.isActive ? 'badge-success' : 'badge-danger'">
                  {{ userData.shop.isActive ? 'Active' : 'Inactive' }}
                </span>
              </div>
              <div class="data-group col-span-2">
                <label><MapPin class="label-icon"/> Address</label>
                <p v-if="!isEditing">{{ userData.shop.address || '—' }}</p>
                <input v-else v-model="editableUser.shop.address" class="premium-input" />
              </div>
          </div>
        </div>

        <!-- Warehouse Tab -->
        <div v-if="activeTab === 'warehouse' && userData.shop?.warehouse" class="tab-pane">
          <div class="pane-header">
             <div class="header-titles">
                <h2>Warehouse Details</h2>
                <p>Information about your associated warehouse storage.</p>
             </div>
             <div class="card-actions">
               <button v-if="!isEditing" class="action-btn edit" @click="startEditing">
                 <Pencil class="icon-sm" /> Edit
               </button>
               <div v-else class="action-group">
                 <button class="action-btn cancel" @click="cancelEditing"><XIcon class="icon-sm" /> Cancel</button>
                 <button class="action-btn save" @click="saveChanges"><Check class="icon-sm" /> Save</button>
               </div>
            </div>
          </div>

          <div class="card-body grid-2">
              <div class="data-group col-span-2">
                <label><Package class="label-icon"/> Warehouse Name</label>
                <h4 class="highlight-text" v-if="!isEditing">{{ userData.shop.warehouse.name || '—' }}</h4>
                <input v-else v-model="editableUser.shop.warehouse.name" class="premium-input" />
              </div>
              <div class="data-group">
                <label><Phone class="label-icon"/> Phone</label>
                <p v-if="!isEditing">{{ userData.shop.warehouse.phone || '—' }}</p>
                <input v-else v-model="editableUser.shop.warehouse.phone" class="premium-input" />
              </div>
              <div class="data-group">
                <label><Activity class="label-icon"/> Status</label>
                 <span class="status-badge sm" :class="userData.shop.warehouse.isActive ? 'badge-success' : 'badge-danger'">
                  {{ userData.shop.warehouse.isActive ? 'Active' : 'Inactive' }}
                </span>
              </div>
              <div class="data-group col-span-2">
                <label><MapPin class="label-icon"/> Address</label>
                <p v-if="!isEditing">{{ userData.shop.warehouse.address || '—' }}</p>
                <input v-else v-model="editableUser.shop.warehouse.address" class="premium-input" />
              </div>
          </div>
        </div>

        <!-- Security Tab -->
        <div v-if="activeTab === 'security'" class="tab-pane">
          <div class="pane-header">
            <div class="header-titles">
               <h2>Security Settings</h2>
               <p>Manage your password and authentication methods.</p>
            </div>
          </div>

          <form @submit.prevent="saveOtherSettings" class="settings-form">
            <div class="form-group">
              <label>Current Password</label>
              <input v-model="securitySettings.currentPassword" type="password" class="premium-input" placeholder="••••••••" />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>New Password</label>
                <input v-model="securitySettings.newPassword" type="password" class="premium-input" placeholder="••••••••" />
              </div>
              <div class="form-group">
                <label>Confirm New Password</label>
                <input v-model="securitySettings.confirmPassword" type="password" class="premium-input" placeholder="••••••••" />
              </div>
            </div>

            <hr class="separator" />

            <div class="toggle-section">
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
            </div>

            <div class="form-actions">
              <button type="submit" class="btn btn-primary">
                <Save class="icon-sm" /> Update Security
              </button>
            </div>
          </form>
        </div>

        <!-- Notifications Tab -->
         <div v-if="activeTab === 'notifications'" class="tab-pane">
          <div class="pane-header">
            <div class="header-titles">
               <h2>Notifications</h2>
               <p>Choose what you want to be notified about.</p>
            </div>
          </div>

          <div class="notification-group">
            <h3>Email Alerts</h3>
            <div class="checkbox-row">
              <input type="checkbox" id="emailOrder" v-model="notificationSettings.emailOrder" />
              <label for="emailOrder">
                <strong>New Orders</strong>
                <span>Get notified when a new order is placed.</span>
              </label>
            </div>
            <div class="checkbox-row">
              <input type="checkbox" id="emailStock" v-model="notificationSettings.emailStock" />
              <label for="emailStock">
                <strong>Low Stock Warning</strong>
                <span>Get notified when product stock is low.</span>
              </label>
            </div>
             <div class="checkbox-row">
              <input type="checkbox" id="emailMarketing" v-model="notificationSettings.emailMarketing" />
              <label for="emailMarketing">
                <strong>Marketing Emails</strong>
                <span>Receive updates about new features and promotions.</span>
              </label>
            </div>
          </div>

          <hr class="separator" />

           <div class="notification-group">
            <h3>Push Notifications</h3>
             <div class="checkbox-row">
              <input type="checkbox" id="pushNotif" v-model="notificationSettings.pushNotifications" />
              <label for="pushNotif">
                <strong>Browser Notifications</strong>
                <span>Receive real-time alerts in your browser.</span>
              </label>
            </div>
          </div>

          <div class="form-actions">
             <button @click="saveOtherSettings" class="btn btn-primary">
                <Save class="icon-sm" /> Save Preferences
              </button>
          </div>
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
  color: #0F172A;
  margin-bottom: 0.25rem;
}

.text-subtitle {
  color: #64748B;
  font-size: 0.95rem;
}


.status-indicator {
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 4px solid #2563EB;
}

.status-indicator.active { background-color: #10B981; }
.status-indicator.inactive { background-color: #EF4444; }

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

.badge-success { background: #DCFCE7; color: #166534; }
.badge-danger { background: #FEE2E2; color: #991B1B; }

/* Main Settings Layout */
.settings-container {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
}

.card {
  background: white;
  border-radius: 16px;
  border: 1px solid #F1F5F9;
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
  color: #64748B;
  font-weight: 500;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;
}

.tab-btn:hover {
  background-color: #F8FAFC;
  color: #0F172A;
}

.tab-btn.active {
  background-color: #EFF6FF;
  color: #2563EB;
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
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}

.pane-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  border-bottom: 2px solid #F8FAFC;
  padding-bottom: 1.5rem;
}

.header-titles h2 {
  font-size: 1.4rem;
  font-weight: 700;
  color: #0F172A;
  margin: 0 0 0.25rem 0;
}

.header-titles p {
  color: #64748B;
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
  border: 1px solid #E2E8F0;
  background: white;
  color: #64748B;
}

.action-btn.edit:hover { background: #F8FAFC; color: #2563EB; border-color: #CBD5E1; }
.action-btn.save { background: #2563EB; color: white; border-color: #2563EB; }
.action-btn.save:hover { background: #1D4ED8; }
.action-btn.cancel:hover { background: #FEF2F2; color: #EF4444; border-color: #FCA5A5; }

/* Data Grid */
.grid-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
}

.col-span-2 { grid-column: span 2; }

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
  color: #94A3B8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.label-icon { width: 14px; height: 14px; stroke-width: 2.5; }

.data-group p {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 500;
  color: #1E293B;
  word-break: break-word;
}

.data-group .highlight-text {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #0F172A;
}

.data-group .text-subtle { color: #64748B; }
.data-group .mono-text { font-family: 'Courier New', Courier, monospace; letter-spacing: 1px; font-weight: 600;}

/* Input edit mode */
.premium-input {
  width: 100%;
  padding: 0.75rem 1rem;
  background: #F8FAFC;
  border: 1px solid #CBD5E1;
  border-radius: 8px;
  font-size: 1rem;
  color: #0F172A;
  font-weight: 500;
  transition: all 0.2s ease;
  font-family: inherit;
}

.premium-input:focus {
  outline: none;
  background: white;
  border-color: #3B82F6;
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
  border-top: 1px solid #F1F5F9;
  margin: 1rem 0;
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

.btn-primary { background-color: #2563EB; color: white; }
.btn-primary:hover { background-color: #1D4ED8; }

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
  color: #0F172A;
}
.toggle-info p {
  color: #64748B;
  font-size: 0.9rem;
}
.text-primary { color: #2563EB; }
.icon-md { width: 20px; height: 20px; }

.toggle-switch {
  position: relative;
  width: 44px;
  height: 24px;
}
.toggle-switch input { opacity: 0; width: 0; height: 0; }
.toggle-switch label {
  position: absolute;
  cursor: pointer;
  inset: 0;
  background-color: #CBD5E1;
  transition: .4s;
  border-radius: 24px;
}
.toggle-switch label:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}
.toggle-switch input:checked + label { background-color: #2563EB; }
.toggle-switch input:checked + label:before { transform: translateX(20px); }

/* Notifications Checkbox */
.notification-group h3 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1.25rem;
}

.checkbox-row {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.checkbox-row input[type="checkbox"] {
  width: 18px;
  height: 18px;
  margin-top: 2px;
  accent-color: #2563EB;
  cursor: pointer;
}
.checkbox-row label {
  display: flex;
  flex-direction: column;
  cursor: pointer;
}
.checkbox-row label strong {
  color: #0F172A;
  font-weight: 600;
  margin-bottom: 2px;
}
.checkbox-row label span {
  color: #64748B;
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
  .grid-2 { grid-template-columns: 1fr; }
  .col-span-2 { grid-column: span 1; }
  .form-row { flex-direction: column; }
  .pane-header { flex-direction: column; gap: 1rem; }
}
</style>
