<script setup>
import { ref, watch } from 'vue'
import { X, Pencil, Check, X as XIcon } from 'lucide-vue-next'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  user: {
    type: Object,
    required: true,
    default: () => ({})
  }
})

const emit = defineEmits(['close', 'update'])

const activeSection = ref(null)
const editableUser = ref({})

// Initialize editableUser when dialog opens or user prop changes
watch(() => props.user, (newUser) => {
  editableUser.value = JSON.parse(JSON.stringify(newUser))
}, { immediate: true, deep: true })

// Reset editing state when dialog closes
watch(() => props.isOpen, (isOpen) => {
  if (!isOpen) {
    activeSection.value = null
    editableUser.value = JSON.parse(JSON.stringify(props.user))
  }
})

const startEditing = (section) => {
  activeSection.value = section
  // Ensure we have fresh data for the section we are editing
  editableUser.value = JSON.parse(JSON.stringify(props.user))
}

const cancelEditing = () => {
  activeSection.value = null
  editableUser.value = JSON.parse(JSON.stringify(props.user))
}

const saveChanges = () => {
  emit('update', editableUser.value)
  activeSection.value = null
}
</script>

<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <header class="modal-header">
        <h2 class="title">User Profile</h2>
        <button class="close-btn" @click="$emit('close')">
          <X class="icon" />
        </button>
      </header>
      
      <div class="modal-body">
        <div class="user-header">
           <div class="avatar-large">{{ user.firstName?.charAt(0) }}{{ user.lastName?.charAt(0) }}</div>
           <div class="user-title">
             <h3>{{ user.firstName }} {{ user.lastName }}</h3>
             <span class="role-badge">{{ user.role }}</span>
           </div>
        </div>

        <!-- Personal Information Section -->
        <div class="info-section">
          <div class="section-header">
            <h3 class="section-title">Personal Information</h3>
            <div class="section-actions">
              <button v-if="activeSection !== 'personal'" class="icon-btn edit-btn" @click="startEditing('personal')">
                <Pencil class="icon-xs" />
              </button>
              <div v-else class="edit-actions">
                <button class="icon-btn cancel-btn" @click="cancelEditing">
                  <XIcon class="icon-xs" />
                </button>
                <button class="icon-btn save-btn" @click="saveChanges">
                  <Check class="icon-xs" />
                </button>
              </div>
            </div>
          </div>
          <div class="info-grid">
            <div class="info-item">
              <label>First Name</label>
              <p v-if="activeSection !== 'personal'">{{ user.firstName }}</p>
              <input v-else v-model="editableUser.firstName" class="input-field" />
            </div>
            <div class="info-item">
              <label>Last Name</label>
              <p v-if="activeSection !== 'personal'">{{ user.lastName }}</p>
              <input v-else v-model="editableUser.lastName" class="input-field" />
            </div>
            <div class="info-item">
              <label>Phone Number</label>
              <p v-if="activeSection !== 'personal'">{{ user.phone }}</p>
              <input v-else v-model="editableUser.phone" class="input-field" />
            </div>
            <div class="info-item">
              <label>Email</label>
              <p v-if="activeSection !== 'personal'">{{ user.email }}</p>
              <input v-else v-model="editableUser.email" class="input-field" />
            </div>
          </div>
        </div>

        <!-- Organization Section -->
        <div class="info-section">
          <div class="section-header">
            <h3 class="section-title">Organization</h3>
             <div class="section-actions">
              <button v-if="activeSection !== 'organization'" class="icon-btn edit-btn" @click="startEditing('organization')">
                <Pencil class="icon-xs" />
              </button>
              <div v-else class="edit-actions">
                <button class="icon-btn cancel-btn" @click="cancelEditing">
                  <XIcon class="icon-xs" />
                </button>
                <button class="icon-btn save-btn" @click="saveChanges">
                  <Check class="icon-xs" />
                </button>
              </div>
            </div>
          </div>
          <div class="info-grid">
            <div class="info-item">
              <label>Organization Name</label>
              <p v-if="activeSection !== 'organization'">{{ user.organizationName }}</p>
              <input v-else v-model="editableUser.organizationName" class="input-field" />
            </div>
            <div class="info-item">
              <label>STIR</label>
              <p v-if="activeSection !== 'organization'">{{ user.stir }}</p>
              <input v-else v-model="editableUser.stir" class="input-field" />
            </div>
            <div class="info-item full-width">
              <label>Address</label>
              <p v-if="activeSection !== 'organization'">{{ user.organizationAddress }}</p>
              <input v-else v-model="editableUser.organizationAddress" class="input-field" />
            </div>
             <div class="info-item">
              <label>Organization Phone</label>
              <p v-if="activeSection !== 'organization'">{{ user.organizationPhone }}</p>
              <input v-else v-model="editableUser.organizationPhone" class="input-field" />
            </div>
             <div class="info-item">
              <label>Subscription</label>
              <p class="subscription-tag">{{ user.subscription }}</p>
            </div>
          </div>
        </div>

        <!-- Store Section -->
        <div class="info-section" v-if="user.store">
          <div class="section-header">
            <h3 class="section-title">Store</h3>
             <div class="section-actions">
              <button v-if="activeSection !== 'store'" class="icon-btn edit-btn" @click="startEditing('store')">
                <Pencil class="icon-xs" />
              </button>
              <div v-else class="edit-actions">
                <button class="icon-btn cancel-btn" @click="cancelEditing">
                  <XIcon class="icon-xs" />
                </button>
                <button class="icon-btn save-btn" @click="saveChanges">
                  <Check class="icon-xs" />
                </button>
              </div>
            </div>
          </div>
          <div class="info-grid">
            <div class="info-item">
              <label>ID</label>
              <p>#{{ user.store.id }}</p>
            </div>
            <div class="info-item">
              <label>Name</label>
              <p v-if="activeSection !== 'store'">{{ user.store.name }}</p>
              <input v-else v-model="editableUser.store.name" class="input-field" />
            </div>
             <div class="info-item">
              <label>Phone</label>
              <p v-if="activeSection !== 'store'">{{ user.store.phone }}</p>
              <input v-else v-model="editableUser.store.phone" class="input-field" />
            </div>
            <div class="info-item full-width">
              <label>Address</label>
              <p v-if="activeSection !== 'store'">{{ user.store.address }}</p>
              <input v-else v-model="editableUser.store.address" class="input-field" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-content {
  background-color: white;
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
}

.title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #0f172a;
  margin: 0;
}

.close-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  color: #64748b;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background-color: #f1f5f9;
  color: #0f172a;
}

.icon {
  width: 20px;
  height: 20px;
}

.icon-xs {
  width: 14px;
  height: 14px;
}

.modal-body {
  padding: 1.5rem;
}

.user-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #f1f5f9;
}

.avatar-large {
  width: 64px;
  height: 64px;
  background-color: #2563eb;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 600;
}

.user-title h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #0f172a;
}

.role-badge {
  display: inline-block;
  margin-top: 0.25rem;
  padding: 0.25rem 0.75rem;
  background-color: #eff6ff;
  color: #2563eb;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
}

.info-section {
  margin-bottom: 1.5rem;
}

.info-section:last-child {
  margin-bottom: 0;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #f1f5f9;
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  color: #334155;
  margin: 0;
}

.section-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.edit-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
  padding: 0;
}

.edit-btn {
  background: transparent;
  color: #64748b;
}

.edit-btn:hover {
  background-color: #f1f5f9;
  color: #2563eb;
}

.save-btn {
  background-color: #2563eb;
  color: white;
}

.save-btn:hover {
  background-color: #1d4ed8;
}

.cancel-btn {
  background-color: white;
  border-color: #e2e8f0;
  color: #64748b;
}

.cancel-btn:hover {
  background-color: #f8fafc;
  color: #ef4444;
  border-color: #cbd5e1;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-item.full-width {
  grid-column: span 2;
}

.info-item label {
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
}

.info-item p {
  margin: 0;
  font-size: 0.95rem;
  color: #0f172a;
  font-weight: 500;
  word-break: break-all;
  min-height: 1.5rem;
  display: flex;
  align-items: center;
}

.input-field {
  width: 100%;
  padding: 0.375rem 0.5rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 0.95rem;
  color: #0f172a;
  outline: none;
  transition: all 0.2s;
}

.input-field:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
}

.subscription-tag {
  color: #16a34a !important;
  font-weight: 600 !important;
}

@media (max-width: 640px) {
  .modal-content {
    max-width: 100%;
    height: 100%;
    border-radius: 0;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .info-item.full-width {
    grid-column: span 1;
  }
}
</style>
