<script setup>
import { ref, onMounted } from 'vue'
import { useDelayedLoading } from '@/composables/useDelayedLoading'
import BasePagination from '@/components/dashboard/BasePagination.vue'
import {
  Users,
  Plus,
  Power,
  X,
} from 'lucide-vue-next'
import { getCashiers, createCashier, toggleCashierStatus } from '@/services/api'
import { useNotification } from '@/composables/useNotification'
import { useI18n } from 'vue-i18n'

const { showNotification } = useNotification()
const { t } = useI18n()

const { loading, showSkeleton, startLoading, stopLoading } = useDelayedLoading()
const cashiers = ref([])
const totalElements = ref(0)
const totalPages = ref(1)
const currentPage = ref(1)
const itemsPerPage = ref(10)

const fetchCashiers = async () => {
  startLoading()
  try {
    const res = await getCashiers({
      page: currentPage.value - 1,
      size: itemsPerPage.value,
      sort: 'id,desc',
    })
    if (res.data?.success) {
      cashiers.value = res.data.data.content
      totalPages.value = res.data.data.page.totalPages === 0 ? 1 : res.data.data.page.totalPages
      totalElements.value = res.data.data.page.totalElements
    }
  } catch {
    showNotification({ type: 'error', message: 'Kassirlarni yuklashda xatolik!' })
  } finally {
    stopLoading()
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) { currentPage.value++; fetchCashiers() }
}
const prevPage = () => {
  if (currentPage.value > 1) { currentPage.value--; fetchCashiers() }
}
const goToPage = (page) => {
  currentPage.value = page
  fetchCashiers()
}

const handleToggleStatus = async (cashier) => {
  try {
    const res = await toggleCashierStatus(cashier.id)
    if (res.data?.success) {
      cashier.isActive = !cashier.isActive
      showNotification({
        type: 'success',
        message: t('dashboard.cashiers.toggled', {
          status: t(cashier.isActive ? 'dashboard.cashiers.status_active' : 'dashboard.cashiers.status_inactive'),
        }),
      })
    }
  } catch {
    showNotification({ type: 'error', message: t('dashboard.cashiers.toggle_error') })
  }
}

const isCreateModalOpen = ref(false)
const isSubmitting = ref(false)
const newCashier = ref({ firstName: '', lastName: '', username: '', phone: '', password: '' })

const openCreateModal = () => {
  newCashier.value = { firstName: '', lastName: '', username: '', phone: '', password: '' }
  isCreateModalOpen.value = true
}
const closeCreateModal = () => { isCreateModalOpen.value = false }

const handleCreateCashier = async () => {
  isSubmitting.value = true
  try {
    const res = await createCashier(newCashier.value)
    if (res.data?.success) {
      showNotification({ type: 'success', message: t('dashboard.cashiers.created') })
      closeCreateModal()
      currentPage.value = 1
      await fetchCashiers()
    }
  } catch {
    showNotification({ type: 'error', message: t('dashboard.cashiers.create_error') })
  } finally {
    isSubmitting.value = false
  }
}

onMounted(fetchCashiers)
</script>

<template>
  <div class="cashiers-page">

    <!-- ─── Hero ───────────────────────────────────── -->
    <div class="cs-hero">
      <div class="cs-hero-grid"></div>
      <div class="cs-orb cs-orb-1"></div>
      <div class="cs-orb cs-orb-2"></div>
      <div class="cs-hero-body">
        <div class="cs-hero-left">
          <div class="cs-badge">
            <Users :size="11" />
            {{ t('dashboard.sidebar.cashiers') }}
          </div>
          <h1 class="cs-title">{{ t('dashboard.sidebar.cashiers') }}</h1>
          <p class="cs-subtitle">{{ $t('dashboard.cashiers.subtitle') }}</p>
        </div>
        <div class="cs-hero-actions">
          <button class="cs-btn-primary" @click="openCreateModal">
            <Plus :size="15" />
            {{ $t('dashboard.cashiers.add') }}
          </button>
        </div>
      </div>
    </div>

    <!-- ─── Table card ──────────────────────────────── -->
    <div class="cs-card">
      <div class="cs-table-wrap">
        <table class="cs-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>{{ $t('dashboard.cashiers.col_name') }}</th>
              <th>{{ $t('dashboard.cashiers.col_username') }}</th>
              <th>{{ $t('dashboard.cashiers.col_phone') }}</th>
              <th>{{ $t('dashboard.cashiers.col_status') }}</th>
              <th>{{ $t('dashboard.cashiers.col_apikey') }}</th>
              <th class="th-actions">{{ $t('dashboard.cashiers.col_actions') }}</th>
            </tr>
          </thead>
          <tbody>

            <!-- Skeleton -->
            <template v-if="showSkeleton">
              <tr v-for="n in itemsPerPage" :key="n" class="skel-row">
                <td><div class="skel" style="width:28px;height:12px"></div></td>
                <td>
                  <div class="cs-user-cell">
                    <div class="skel skel-avatar"></div>
                    <div class="skel skel-name"></div>
                  </div>
                </td>
                <td><div class="skel skel-name" style="width:80px"></div></td>
                <td><div class="skel" style="width:110px;height:12px"></div></td>
                <td><div class="skel skel-badge"></div></td>
                <td><div class="skel" style="width:140px;height:12px"></div></td>
                <td>
                  <div style="display:flex;justify-content:flex-end">
                    <div class="skel skel-act"></div>
                  </div>
                </td>
              </tr>
            </template>

            <!-- Rows -->
            <tr v-else v-for="cashier in cashiers" :key="cashier.id" class="cs-row">
              <td class="td-id">#{{ cashier.id }}</td>
              <td>
                <div class="cs-user-cell">
                  <div class="cs-avatar">
                    {{ cashier.firstName?.[0] ?? '' }}{{ cashier.lastName?.[0] ?? '' }}
                  </div>
                  <span class="cs-fullname">{{ cashier.firstName }} {{ cashier.lastName }}</span>
                </div>
              </td>
              <td class="td-username">@{{ cashier.username }}</td>
              <td class="td-phone">{{ cashier.phone }}</td>
              <td>
                <span class="cs-status" :class="cashier.isActive ? 'cs-status-active' : 'cs-status-inactive'">
                  {{ cashier.isActive ? $t('dashboard.cashiers.status_active') : $t('dashboard.cashiers.status_inactive') }}
                </span>
              </td>
              <td class="td-apikey">
                <span :title="cashier.xApiKey || cashier.xapiKey">
                  {{ cashier.xApiKey || cashier.xapiKey || '—' }}
                </span>
              </td>
              <td>
                <div class="cs-actions-cell">
                  <button
                    class="cs-act-btn"
                    :class="cashier.isActive ? 'cs-act-off' : 'cs-act-on'"
                    :title="cashier.isActive ? $t('dashboard.cashiers.deactivate') : $t('dashboard.cashiers.activate')"
                    @click="handleToggleStatus(cashier)"
                  >
                    <Power :size="14" />
                  </button>
                </div>
              </td>
            </tr>

            <!-- Empty -->
            <tr v-if="!loading && cashiers.length === 0">
              <td colspan="7" class="cs-empty">
                <div class="cs-empty-inner">
                  <div class="cs-empty-icon"><Users :size="28" /></div>
                  <p>{{ $t('dashboard.cashiers.empty') }}</p>
                </div>
              </td>
            </tr>

          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <BasePagination
        :current-page="currentPage"
        :total-pages="totalPages"
        :total-elements="totalElements"
        :items-per-page="itemsPerPage"
        @page-change="goToPage"
      />
    </div>

    <!-- ─── Create Modal ─────────────────────────────── -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="isCreateModalOpen" class="cs-modal-overlay" @click.self="closeCreateModal">
          <div class="cs-modal">
            <div class="cs-modal-header">
              <div class="cs-modal-icon-wrap">
                <Users :size="22" />
              </div>
              <h2 class="cs-modal-title">{{ $t('dashboard.cashiers.modal_title') }}</h2>
              <button class="cs-close-btn" @click="closeCreateModal">
                <X :size="16" />
              </button>
            </div>

            <form @submit.prevent="handleCreateCashier" class="cs-modal-form">
              <div class="cs-form-row">
                <div class="cs-form-group">
                  <label>{{ $t('dashboard.cashiers.field_first_name') }}</label>
                  <input v-model="newCashier.firstName" type="text" required :placeholder="$t('dashboard.cashiers.ph_first_name')" />
                </div>
                <div class="cs-form-group">
                  <label>{{ $t('dashboard.cashiers.field_last_name') }}</label>
                  <input v-model="newCashier.lastName" type="text" required :placeholder="$t('dashboard.cashiers.ph_last_name')" />
                </div>
              </div>
              <div class="cs-form-group">
                <label>{{ $t('dashboard.cashiers.field_username') }}</label>
                <input v-model="newCashier.username" type="text" required :placeholder="$t('dashboard.cashiers.ph_username')" />
              </div>
              <div class="cs-form-group">
                <label>{{ $t('dashboard.cashiers.field_phone') }}</label>
                <input v-model="newCashier.phone" type="text" required :placeholder="$t('dashboard.cashiers.ph_phone')" />
              </div>
              <div class="cs-form-group">
                <label>{{ $t('dashboard.cashiers.field_password') }}</label>
                <input v-model="newCashier.password" type="password" required :placeholder="$t('dashboard.cashiers.ph_password')" />
              </div>

              <div class="cs-modal-footer">
                <button type="button" class="cs-btn-ghost" @click="closeCreateModal" :disabled="isSubmitting">
                  {{ $t('dashboard.cashiers.btn_cancel') }}
                </button>
                <button type="submit" class="cs-btn-primary" :disabled="isSubmitting">
                  <span v-if="isSubmitting" class="cs-spinner"></span>
                  {{ $t('dashboard.cashiers.btn_create') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<style scoped>
.cashiers-page {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* ─── Hero ─────────────────────────────────────── */
.cs-hero {
  position: relative;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  padding: 1.75rem 2rem;
  overflow: hidden;
}

.cs-hero-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(0,123,255,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,123,255,0.03) 1px, transparent 1px);
  background-size: 28px 28px;
  pointer-events: none;
}

.cs-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(70px);
  pointer-events: none;
}
.cs-orb-1 {
  width: 320px; height: 320px;
  background: radial-gradient(circle, rgba(0,123,255,0.09) 0%, transparent 70%);
  top: -100px; right: -60px;
}
.cs-orb-2 {
  width: 220px; height: 220px;
  background: radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%);
  bottom: -80px; left: -40px;
}

.cs-hero-body {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.25rem;
  flex-wrap: wrap;
}

.cs-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 0.3rem 0.8rem;
  border-radius: 100px;
  background: rgba(0,123,255,0.08);
  border: 1px solid rgba(0,123,255,0.18);
  color: #007bff;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 0.6rem;
}

.cs-title {
  margin: 0 0 0.3rem;
  font-size: 1.6rem;
  font-weight: 800;
  background: linear-gradient(135deg, #0f172a 0%, #007bff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;
}

.cs-subtitle {
  margin: 0;
  font-size: 0.875rem;
  color: #64748b;
}

.cs-hero-actions {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-shrink: 0;
}

/* ─── Buttons ──────────────────────────────────── */
.cs-btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0.6rem 1.1rem;
  background: linear-gradient(135deg, #007bff, #6366f1);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 10px rgba(0,123,255,0.25);
  font-family: inherit;
}
.cs-btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(0,123,255,0.35);
}
.cs-btn-primary:disabled { opacity: 0.65; cursor: not-allowed; }

.cs-btn-ghost {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0.6rem 1.1rem;
  background: #f1f5f9;
  color: #475569;
  border: none;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}
.cs-btn-ghost:hover:not(:disabled) { background: #e2e8f0; color: #0f172a; }
.cs-btn-ghost:disabled { opacity: 0.65; cursor: not-allowed; }

/* ─── Table card ───────────────────────────────── */
.cs-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  overflow: hidden;
}

.cs-table-wrap {
  overflow-x: auto;
  overscroll-behavior-x: contain;
}

.cs-table {
  width: 100%;
  border-collapse: collapse;
}

.cs-table th {
  background: #f8fafc;
  padding: 0.85rem 1.25rem;
  text-align: left;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: #64748b;
  white-space: nowrap;
  border-bottom: 1px solid #f1f5f9;
}

.cs-table td {
  padding: 0.9rem 1.25rem;
  border-bottom: 1px solid #f8fafc;
  font-size: 0.875rem;
  color: #334155;
  vertical-align: middle;
}

.th-actions { text-align: right; }

.cs-row { transition: background 0.12s; }
.cs-row:hover td { background: #f8fafc; }
.cs-row:last-child td { border-bottom: none; }

.td-id       { color: #94a3b8; font-size: 0.78rem; font-weight: 600; white-space: nowrap; }
.td-username { color: #64748b; }
.td-phone    { color: #475569; font-weight: 500; white-space: nowrap; }
.td-apikey span {
  display: inline-block;
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.78rem;
  color: #94a3b8;
  vertical-align: middle;
}

/* ─── User cell ────────────────────────────────── */
.cs-user-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.cs-avatar {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, rgba(0,123,255,0.15), rgba(99,102,241,0.15));
  color: #007bff;
  font-weight: 700;
  font-size: 0.78rem;
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  flex-shrink: 0;
  letter-spacing: 0.03em;
}

.cs-fullname {
  font-weight: 600;
  color: #0f172a;
  font-size: 0.875rem;
  white-space: nowrap;
}

/* ─── Status badge ─────────────────────────────── */
.cs-status {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.7rem;
  border-radius: 100px;
  font-size: 0.72rem;
  font-weight: 700;
  white-space: nowrap;
}
.cs-status-active {
  background: rgba(16,185,129,0.1);
  color: #059669;
  border: 1px solid rgba(16,185,129,0.2);
}
.cs-status-inactive {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

/* ─── Action buttons ───────────────────────────── */
.cs-actions-cell {
  display: flex;
  justify-content: flex-end;
  gap: 0.35rem;
}

.cs-act-btn {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid #e2e8f0;
  background: #fff;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s;
  color: #64748b;
}

.cs-act-on:hover {
  background: rgba(16,185,129,0.08);
  color: #059669;
  border-color: rgba(16,185,129,0.3);
}
.cs-act-off:hover {
  background: #fef2f2;
  color: #dc2626;
  border-color: #fecaca;
}

/* ─── Empty ─────────────────────────────────────── */
.cs-empty { text-align: center; padding: 3rem; }
.cs-empty-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
  color: #94a3b8;
}
.cs-empty-icon {
  width: 56px; height: 56px;
  border-radius: 14px;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #cbd5e1;
}
.cs-empty p { font-size: 0.875rem; margin: 0; }

/* ─── Skeleton ──────────────────────────────────── */
@keyframes shimmer {
  0%   { background-position: -400px 0; }
  100% { background-position:  400px 0; }
}
.skel {
  border-radius: 6px;
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 400px 100%;
  animation: shimmer 1.4s infinite linear;
}
.skel-row td { border-bottom: 1px solid #f8fafc; }
.skel-avatar { width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0; }
.skel-name   { width: 120px; height: 13px; }
.skel-badge  { width: 58px; height: 20px; border-radius: 100px; }
.skel-act    { width: 30px; height: 30px; border-radius: 8px; }

/* ─── Modal ─────────────────────────────────────── */
.cs-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15,23,42,0.45);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 9000;
}

.cs-modal {
  background: #fff;
  border-radius: 18px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.15);
  overflow: hidden;
}

.cs-modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.cs-modal-icon-wrap {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(0,123,255,0.12), rgba(99,102,241,0.12));
  color: #007bff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.cs-modal-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #0f172a;
  flex: 1;
  margin: 0;
}

.cs-close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  border-radius: 8px;
  color: #94a3b8;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  flex-shrink: 0;
}
.cs-close-btn:hover { background: #f1f5f9; color: #0f172a; }

.cs-modal-form {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cs-form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.875rem;
}

.cs-form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.cs-form-group label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #334155;
}

.cs-form-group input {
  padding: 0.6rem 0.875rem;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.9rem;
  color: #0f172a;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
  font-family: inherit;
  background: #f8fafc;
}
.cs-form-group input:focus {
  border-color: #007bff;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(0,123,255,0.08);
}
.cs-form-group input::placeholder { color: #94a3b8; }

.cs-modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding-top: 0.25rem;
}

/* ─── Spinner ───────────────────────────────────── */
.cs-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ─── Modal transition ──────────────────────────── */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition:
    opacity 0.22s cubic-bezier(0.4, 0, 0.2, 1),
    background-color 0.22s cubic-bezier(0.4, 0, 0.2, 1),
    backdrop-filter 0.22s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: opacity, background-color, backdrop-filter;
}

.modal-fade-enter-active .cs-modal,
.modal-fade-leave-active .cs-modal {
  transition:
    transform 0.22s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.22s cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 0.22s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform, opacity, box-shadow;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  background: rgba(15, 23, 42, 0);
  backdrop-filter: blur(0px);
}

.modal-fade-enter-from .cs-modal,
.modal-fade-leave-to .cs-modal {
  opacity: 0;
  transform: translateY(10px) scale(0.98);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

@media (prefers-reduced-motion: reduce) {
  .modal-fade-enter-active,
  .modal-fade-leave-active,
  .modal-fade-enter-active .cs-modal,
  .modal-fade-leave-active .cs-modal {
    transition: none;
  }
}

/* ─── Responsive ────────────────────────────────── */
@media (max-width: 768px) {
  .cs-hero { padding: 1.25rem; }
  .cs-title { font-size: 1.3rem; }
}
@media (max-width: 640px) {
  .cs-table th,
  .cs-table td { padding: 0.7rem 0.85rem; }
  .cs-form-row { grid-template-columns: 1fr; }
  .cs-modal-footer { flex-direction: column-reverse; }
  .cs-modal-footer .cs-btn-ghost,
  .cs-modal-footer .cs-btn-primary { width: 100%; justify-content: center; }
}
</style>
