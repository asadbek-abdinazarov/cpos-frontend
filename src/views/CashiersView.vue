<script setup>
import { ref, onMounted } from 'vue'
import {
  Users,
  // Search,
  Plus,
  Power,
  ChevronLeft,
  ChevronRight,
  // AlertTriangle,
  X,
} from 'lucide-vue-next'
import { getCashiers, createCashier, toggleCashierStatus } from '@/services/api'
import { useNotification } from '@/composables/useNotification'
import { useI18n } from 'vue-i18n'

const { showNotification } = useNotification()
const { t } = useI18n()

const loading = ref(false)
const cashiers = ref([])
const totalElements = ref(0)
const totalPages = ref(1)
const currentPage = ref(1)
const itemsPerPage = ref(10)
// const searchQuery = ref('')

const fetchCashiers = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value - 1,
      size: itemsPerPage.value,
      sort: 'id,desc',
    }
    // API hozircha faqart page/size/sort qabul qilmoqda.
    const res = await getCashiers(params)
    if (res.data && res.data.success) {
      cashiers.value = res.data.data.content
      totalPages.value = res.data.data.page.totalPages === 0 ? 1 : res.data.data.page.totalPages
      totalElements.value = res.data.data.page.totalElements
    }
  } catch (error) {
    console.error('Failed to load cashiers', error)
    showNotification({ type: 'error', message: 'Kassirlarni yuklashda xatolik!' })
  } finally {
    loading.value = false
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    fetchCashiers()
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    fetchCashiers()
  }
}

// TOGGLE STATUS
const handleToggleStatus = async (cashier) => {
  try {
    const res = await toggleCashierStatus(cashier.id)
    if (res.data && res.data.success) {
      cashier.isActive = !cashier.isActive
      showNotification({
        type: 'success',
        message: `Kassir holati ${cashier.isActive ? 'faol' : 'nofaol'} qilindi`,
      })
    }
  } catch (err) {
    console.error(err)
    showNotification({ type: 'error', message: 'Holatni oʻzgartirib boʻlmadi' })
  }
}

// CREATE MODAL
const isCreateModalOpen = ref(false)
const isSubmitting = ref(false)

const newCashier = ref({
  firstName: '',
  lastName: '',
  username: '',
  phone: '',
  password: '',
})

const openCreateModal = () => {
  newCashier.value = { firstName: '', lastName: '', username: '', phone: '', password: '' }
  isCreateModalOpen.value = true
}

const closeCreateModal = () => {
  isCreateModalOpen.value = false
}

const handleCreateCashier = async () => {
  isSubmitting.value = true
  try {
    const res = await createCashier(newCashier.value)
    if (res.data && res.data.success) {
      showNotification({ type: 'success', message: 'Yangi kassir qoʻshildi' })
      closeCreateModal()
      currentPage.value = 1
      await fetchCashiers()
    }
  } catch (error) {
    console.error(error)
    showNotification({ type: 'error', message: 'Kassir qoshishda xatolik yuz berdi' })
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  fetchCashiers()
})
</script>

<template>
  <div class="cashiers-page">
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">{{ t('dashboard.sidebar.cashiers') || 'Kassirlar' }}</h1>
        <p class="text-subtitle">
          Barcha kassirlarni boshqarish, faollashtirish va yangi tahrirlash.
        </p>
      </div>
      <div class="header-actions">
        <button class="btn btn-primary" @click="openCreateModal">
          <Plus class="icon-sm" />
          Yangi kassir qoʻshish
        </button>
      </div>
    </div>

    <!-- Table Card -->
    <div class="card table-card">
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Kassir ismi</th>
              <th>Username</th>
              <th>Telefon raqam</th>
              <th>Holati</th>
              <th>API Kalit (xApiKey)</th>
              <th class="text-right">Harakatlar</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="loading">
              <tr v-for="n in itemsPerPage" :key="n" class="skel-row">
                <td><div class="skel" style="width: 20px; height: 13px"></div></td>
                <td>
                  <div class="user-cell">
                    <div class="skel skel-avatar"></div>
                    <div class="skel skel-name"></div>
                  </div>
                </td>
                <td><div class="skel skel-name" style="width: 80px"></div></td>
                <td><div class="skel" style="width: 100px; height: 13px"></div></td>
                <td><div class="skel skel-badge-xs"></div></td>
                <td><div class="skel" style="width: 150px; height: 13px"></div></td>
                <td>
                  <div style="display: flex; justify-content: flex-end">
                    <div class="skel skel-action"></div>
                  </div>
                </td>
              </tr>
            </template>
            <tr v-else v-for="cashier in cashiers" :key="cashier.id">
              <td>{{ cashier.id }}</td>
              <td>
                <div class="user-cell">
                  <div class="avatar-circle">
                    {{ cashier.firstName.charAt(0) }}{{ cashier.lastName.charAt(0) }}
                  </div>
                  <span class="font-medium">{{ cashier.firstName }} {{ cashier.lastName }}</span>
                </div>
              </td>
              <td>@{{ cashier.username }}</td>
              <td>{{ cashier.phone }}</td>
              <td>
                <span class="status-badge" :class="cashier.isActive ? 'active' : 'inactive'">
                  {{ cashier.isActive ? 'Faol' : 'Nofaol' }}
                </span>
              </td>
              <td class="font-mono text-sm text-gray-500">
                <div class="api-key-text" :title="cashier.xApiKey || cashier.xapiKey">
                  {{ cashier.xApiKey || cashier.xapiKey || '—' }}
                </div>
              </td>
              <td class="text-right">
                <button
                  class="action-btn toggle-btn"
                  :class="cashier.isActive ? 'text-red-500' : 'text-green-500'"
                  :title="cashier.isActive ? 'Faoliyatni toʻxtatish' : 'Faollashtirish'"
                  @click="handleToggleStatus(cashier)"
                >
                  <Power class="icon-sm" />
                </button>
              </td>
            </tr>
            <tr v-if="!loading && cashiers.length === 0">
              <td colspan="7" class="empty-state">Hozircha kassirlar yoʻq.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="pagination-footer">
        <span class="pagination-info">
          Kursatilyapti {{ (currentPage - 1) * itemsPerPage + (cashiers.length > 0 ? 1 : 0) }} dan
          {{ Math.min(currentPage * itemsPerPage, totalElements) }} gacha. Jami
          {{ totalElements }} yozuv.
        </span>
        <div class="pagination-controls">
          <button class="page-btn" @click="prevPage" :disabled="currentPage === 1">
            <ChevronLeft class="icon-sm" />
          </button>
          <span class="current-page">{{ currentPage }} - sahifa</span>
          <button class="page-btn" @click="nextPage" :disabled="currentPage === totalPages">
            <ChevronRight class="icon-sm" />
          </button>
        </div>
      </div>
    </div>

    <!-- Create Cashier Modal -->
    <div v-if="isCreateModalOpen" class="modal-overlay" @click.self="closeCreateModal">
      <div class="modal-content card slide-in">
        <div class="modal-header">
          <div class="header-icon-wrapper">
            <Users class="icon-md text-primary" />
          </div>
          <h2 class="modal-title">Yangi kassir qoʻshish</h2>
          <button class="close-btn" @click="closeCreateModal">
            <X class="icon-sm" />
          </button>
        </div>

        <form @submit.prevent="handleCreateCashier" class="modal-form">
          <div class="form-row">
            <div class="form-group grid-half">
              <label>Ism</label>
              <input
                type="text"
                v-model="newCashier.firstName"
                required
                class="input-field"
                placeholder="Masalan: Ali"
              />
            </div>
            <div class="form-group grid-half">
              <label>Familiya</label>
              <input
                type="text"
                v-model="newCashier.lastName"
                required
                class="input-field"
                placeholder="Masalan: Valiyev"
              />
            </div>
          </div>
          <div class="form-group">
            <label>Foydalanuvchi nomi (Username)</label>
            <input
              type="text"
              v-model="newCashier.username"
              required
              class="input-field"
              placeholder="Masalan: ali_cashier"
            />
          </div>
          <div class="form-group">
            <label>Telefon raqam</label>
            <input
              type="text"
              v-model="newCashier.phone"
              required
              class="input-field"
              placeholder="Masalan: +998901234567"
            />
          </div>
          <div class="form-group">
            <label>Parol</label>
            <input
              type="password"
              v-model="newCashier.password"
              required
              class="input-field"
              placeholder="Parol kiriting"
            />
          </div>

          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="closeCreateModal"
              :disabled="isSubmitting"
            >
              Bekor qilish
            </button>
            <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
              <span v-if="isSubmitting" class="spinner"></span>
              Yaratish
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cashiers-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
}

.text-subtitle {
  color: #64748b;
  font-size: 0.9rem;
  margin-top: 4px;
}

.btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-primary {
  background-color: #2563eb;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #1d4ed8;
}

.btn-secondary {
  background-color: #f1f5f9;
  color: #475569;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #e2e8f0;
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.icon-sm {
  width: 18px;
  height: 18px;
}

.icon-md {
  width: 24px;
  height: 24px;
}

/* Card */
.card {
  background: white;
  border-radius: 12px;
  border: 1px solid #f1f5f9;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

/* Table */
.table-responsive {
  overflow-x: auto;
  overflow-y: visible;
  overscroll-behavior-x: contain;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 1rem 1.5rem;
  text-align: left;
  vertical-align: middle;
  white-space: nowrap;
}

.data-table th {
  background-color: #f8fafc;
  color: #64748b;
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #e2e8f0;
}

.data-table td {
  border-bottom: 1px solid #f1f5f9;
  color: #334155;
  font-size: 0.9rem;
}

.data-table tr:hover td {
  background-color: #f8fafc;
}

/* Specific Cells */
.user-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.avatar-circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #eff6ff;
  color: #2563eb;
  font-weight: 600;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
}

.font-medium {
  font-weight: 600;
}

.font-mono {
  font-family: inherit; /* use regular font, or monospace if preferred */
}

.api-key-text {
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
}

.text-right {
  text-align: right;
}

.status-badge {
  padding: 0.25rem 0.6rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-badge.active {
  background-color: #dcfce7;
  color: #16a34a;
}

.status-badge.inactive {
  background-color: #f1f5f9;
  color: #64748b;
}

.action-btn {
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e2e8f0;
  background: white;
  border-radius: 6px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #f1f5f9;
  color: #0f172a;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #64748b;
}

.text-red-500 {
  color: #ef4444;
}
.text-green-500 {
  color: #10b981;
}

.toggle-btn:hover {
  border-color: currentColor;
}

/* Pagination */
.pagination-footer {
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}

.pagination-info {
  font-size: 0.85rem;
  color: #64748b;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.page-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e2e8f0;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  color: #64748b;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.current-page {
  font-size: 0.85rem;
  font-weight: 500;
  color: #0f172a;
  margin: 0 0.5rem;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
}

.slide-in {
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;
}

.header-icon-wrapper {
  width: 48px;
  height: 48px;
  background-color: #eff6ff;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.text-primary {
  color: #2563eb;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
  flex: 1;
}

.close-btn {
  background: transparent;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
}

.close-btn:hover {
  background: #f1f5f9;
  color: #0f172a;
}

.modal-form {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.grid-half {
  flex: 1;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #334155;
}

.input-field {
  padding: 0.6rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #0f172a;
  outline: none;
  transition: all 0.2s;
}

.input-field:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1rem;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 640px) {
  .form-row {
    flex-direction: column;
  }

  .data-table th,
  .data-table td {
    padding: 0.65rem 0.75rem;
    font-size: 0.8125rem;
  }

  .pagination-footer {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
}
</style>
