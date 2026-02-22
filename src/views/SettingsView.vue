<script setup>
import { ref } from 'vue'
import {
  User,
  Lock,
  Bell,
  CreditCard,
  Save,
  Camera,
  Shield,
  /*
  Globe,
  Moon,
  Mail
  */
} from 'lucide-vue-next'

const activeTab = ref('general')

const tabs = [
  { id: 'general', label: 'General', icon: User },
  { id: 'security', label: 'Security', icon: Lock },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'billing', label: 'Billing', icon: CreditCard },
]

// Mock Data Models
const generalSettings = ref({
  storeName: 'My Awesome Store',
  email: 'admin@cpos.uz',
  phone: '+998 90 123 45 67',
  currency: 'USD',
  timezone: 'UTC+5 (Tashkent)',
  language: 'English'
})

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

const saveSettings = () => {
  // Mock save functionality
  alert('Settings saved successfully!')
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
      <div class="settings-sidebar">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="tab-btn"
          :class="{ active: activeTab === tab.id }"
          @click="activeTab = tab.id"
        >
          <component :is="tab.icon" class="tab-icon" />
          {{ tab.label }}
        </button>
      </div>

      <!-- Content Area -->
      <div class="settings-content card">
        
        <!-- General Tab -->
        <div v-if="activeTab === 'general'" class="tab-pane">
          <div class="pane-header">
            <h2>General Information</h2>
            <p>Update your store's basic information.</p>
          </div>

          <div class="form-group avatar-section">
            <div class="avatar-wrapper">
              <span class="avatar-placeholder">S</span>
              <button class="upload-btn">
                <Camera class="icon-sm" />
              </button>
            </div>
            <div class="avatar-info">
              <h3>Store Logo</h3>
              <p>Recommended size: 500x500px</p>
            </div>
          </div>

          <form @submit.prevent="saveSettings" class="settings-form">
            <div class="form-row">
              <div class="form-group">
                <label>Store Name</label>
                <input v-model="generalSettings.storeName" type="text" class="input-field" />
              </div>
              <div class="form-group">
                <label>Contact Email</label>
                <input v-model="generalSettings.email" type="email" class="input-field" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Phone Number</label>
                <input v-model="generalSettings.phone" type="text" class="input-field" />
              </div>
              <div class="form-group">
                <label>Currency</label>
                <select v-model="generalSettings.currency" class="input-field">
                  <option value="USD">USD ($)</option>
                  <option value="UZS">UZS (so'm)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>
            </div>

             <div class="form-row">
              <div class="form-group">
                <label>Timezone</label>
                <select v-model="generalSettings.timezone" class="input-field">
                  <option>UTC+5 (Tashkent)</option>
                  <option>UTC+0 (London)</option>
                  <option>UTC-5 (New York)</option>
                </select>
              </div>
              <div class="form-group">
                <label>Language</label>
                <select v-model="generalSettings.language" class="input-field">
                  <option>English</option>
                  <option>Uzbek</option>
                  <option>Russian</option>
                </select>
              </div>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn btn-primary">
                <Save class="icon-sm" /> Save Changes
              </button>
            </div>
          </form>
        </div>

        <!-- Security Tab -->
        <div v-if="activeTab === 'security'" class="tab-pane">
          <div class="pane-header">
            <h2>Security Settings</h2>
            <p>Manage your password and authentication methods.</p>
          </div>

          <form @submit.prevent="saveSettings" class="settings-form">
            <div class="form-group">
              <label>Current Password</label>
              <input v-model="securitySettings.currentPassword" type="password" class="input-field" placeholder="••••••••" />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>New Password</label>
                <input v-model="securitySettings.newPassword" type="password" class="input-field" placeholder="••••••••" />
              </div>
              <div class="form-group">
                <label>Confirm New Password</label>
                <input v-model="securitySettings.confirmPassword" type="password" class="input-field" placeholder="••••••••" />
              </div>
            </div>

            <hr class="separator" />

            <div class="toggle-section">
              <div class="toggle-info">
                <div class="toggle-header">
                  <Shield class="icon-md text-primary" />
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
            <h2>Notifications</h2>
            <p>Choose what you want to be notified about.</p>
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
             <button @click="saveSettings" class="btn btn-primary">
                <Save class="icon-sm" /> Save Preferences
              </button>
          </div>
        </div>

        <!-- Billing (Placeholder) -->
        <div v-if="activeTab === 'billing'" class="tab-pane">
           <div class="empty-state">
             <CreditCard class="empty-icon" />
             <h3>Billing & Plans</h3>
             <p>Billing management is coming soon.</p>
             <button class="btn btn-outline">Contact Support</button>
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
  margin-bottom: 1rem;
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

.settings-container {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
}

/* Sidebar */
.settings-sidebar {
  width: 250px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex-shrink: 0;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: transparent;
  border: none;
  border-radius: 8px;
  color: #64748B;
  font-weight: 500;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;
}

.tab-btn:hover {
  background-color: #F1F5F9;
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
  background: white;
  border-radius: 16px;
  border: 1px solid #F1F5F9;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  min-height: 400px;
}

.tab-pane {
  padding: 2rem;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}

.pane-header {
  margin-bottom: 2rem;
  border-bottom: 1px solid #F1F5F9;
  padding-bottom: 1rem;
}

.pane-header h2 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0F172A;
  margin-bottom: 0.5rem;
}

.pane-header p {
  color: #64748B;
  font-size: 0.9rem;
}

/* Forms */
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

label {
  font-size: 0.9rem;
  font-weight: 500;
  color: #334155;
}

.input-field {
  padding: 0.6rem 1rem;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #0F172A;
  background: white;
  outline: none;
  transition: border-color 0.2s;
}

.input-field:focus {
  border-color: #2563EB;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
}

/* Avatar Section */
.avatar-section {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1rem;
}

.avatar-wrapper {
  position: relative;
  width: 80px;
  height: 80px;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background-color: #EFF6FF;
  color: #2563EB;
  font-size: 2rem;
  font-weight: 700;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 28px;
  height: 28px;
  background: #2563EB;
  color: white;
  border: 2px solid white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.avatar-info h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #0F172A;
}

.avatar-info p {
  font-size: 0.85rem;
  color: #64748B;
}

/* Actions */
.form-actions {
  margin-top: 1rem;
  display: flex;
  justify-content: flex-end;
}

.btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.btn-primary {
  background-color: #2563EB;
  color: white;
}

.btn-primary:hover {
  background-color: #1D4ED8;
}

.btn-outline {
  background: white;
  border: 1px solid #E2E8F0;
  color: #475569;
}

.icon-sm { width: 18px; height: 18px; }

/* Separator */
.separator {
  border: none;
  border-top: 1px solid #F1F5F9;
  margin: 1rem 0;
}

/* Toggle Sections */
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

.icon-md { width: 20px; height: 20px; }
.text-primary { color: #2563EB; }

/* Toggle Switch */
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
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
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

.toggle-switch input:checked + label {
  background-color: #2563EB;
}

.toggle-switch input:checked + label:before {
  transform: translateX(20px);
}

/* Checkbox Rows */
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
  font-size: 0.85rem;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  text-align: center;
  color: #64748B;
}

.empty-icon {
  width: 48px;
  height: 48px;
  color: #CBD5E1;
  margin-bottom: 1rem;
}

.empty-state h3 {
  font-size: 1.25rem;
  color: #0F172A;
  margin-bottom: 0.5rem;
}

.empty-state .btn {
  margin-top: 1.5rem;
}

/* Responsive */
@media (max-width: 768px) {
  .settings-container {
    flex-direction: column;
    gap: 1.5rem;
  }

  .settings-sidebar {
    width: 100%;
    flex-direction: row;
    overflow-x: auto;
    padding-bottom: 0.5rem;
  }

  .tab-btn {
    white-space: nowrap;
    padding: 0.6rem 0.8rem;
    font-size: 0.9rem;
  }

  .form-row {
    flex-direction: column;
    gap: 1rem;
  }

  .toggle-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .toggle-switch {
    margin-top: 0.5rem;
  }
}
</style>
