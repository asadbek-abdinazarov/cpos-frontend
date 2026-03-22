<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import {
  Search,
  Filter,
  Monitor,
  Hash,
  ShieldCheck,
  ShieldAlert,
  Clock,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
} from 'lucide-vue-next'
import { getScales, getScaleHistories } from '@/services/api'
// Notification composable imported but not used yet
// const { showNotification } = useNotification()

const scales = ref([])
const loading = ref(false)

const fetchScales = async () => {
  loading.value = true
  try {
    const res = await getScales()
    if (res.data && res.data.success) {
      scales.value = res.data.data
    }
  } catch (error) {
    console.error('Failed to load scales:', error)
  } finally {
    loading.value = false
  }
}

// View State
const currentView = ref('list') // 'list' or 'history'

// Scale History Pagination and State
const selectedScale = ref(null)
const scaleHistories = ref([])
const historiesLoading = ref(false)
const historyPage = ref(1)
const historyItemsPerPage = ref(10)
const historyTotalElements = ref(0)
const historyTotalPages = ref(1)

const historySearchQuery = ref('')

const onHistorySearchSubmit = () => {
  historyPage.value = 1
  fetchScaleHistoryPage()
}

watch(historySearchQuery, (newVal) => {
  if (newVal === '') {
    historyPage.value = 1
    fetchScaleHistoryPage()
  }
})

const fetchScaleHistoryPage = async () => {
  if (!selectedScale.value) return

  historiesLoading.value = true
  try {
    const params = {
      page: historyPage.value - 1,
      size: historyItemsPerPage.value,
      sort: 'id,desc', // Assuming ID sort, adjust if backend expects 'createdAt' instead
    }

    if (historySearchQuery.value) {
      params.value = historySearchQuery.value
    }

    const res = await getScaleHistories(selectedScale.value.id, params)
    if (res.data && res.data.success) {
      scaleHistories.value = res.data.data.content
      historyTotalElements.value = res.data.data.page.totalElements
      historyTotalPages.value =
        res.data.data.page.totalPages === 0 ? 1 : res.data.data.page.totalPages
    }
  } catch (error) {
    console.error('Failed to fetch scale histories:', error)
  } finally {
    historiesLoading.value = false
  }
}

const openHistoryView = async (scale) => {
  selectedScale.value = scale
  historyPage.value = 1
  scaleHistories.value = []
  historySearchQuery.value = ''
  currentView.value = 'history'
  await fetchScaleHistoryPage()
}

const closeHistoryView = () => {
  currentView.value = 'list'
  selectedScale.value = null
  scaleHistories.value = []
  historyPage.value = 1
  historyTotalElements.value = 0
  historyTotalPages.value = 1
}

const prevHistoryPage = () => {
  if (historyPage.value > 1) {
    historyPage.value--
    fetchScaleHistoryPage()
  }
}

const nextHistoryPage = () => {
  if (historyPage.value < historyTotalPages.value) {
    historyPage.value++
    fetchScaleHistoryPage()
  }
}

onMounted(() => {
  fetchScales()
})

const searchQuery = ref('')
const performSearch = () => {
  // Triggered when form is submitted
  // (In list view we show all filtered Scales on client side)
}

watch(searchQuery, (newVal) => {
  if (newVal === '') {
    // Reset search
  }
})

const filteredScales = computed(() => {
  if (!searchQuery.value) return scales.value
  return scales.value.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (s.serialNumber && s.serialNumber.toLowerCase().includes(searchQuery.value.toLowerCase())),
  )
})
</script>

<template>
  <div class="scales-page">
    <!-- Header -->
    <div class="page-header">
      <div v-if="currentView === 'list'">
        <h1 class="page-title">{{ $t('dashboard.scales.title') }}</h1>
        <p class="text-subtitle">{{ $t('dashboard.scales.subtitle') }}</p>
      </div>
      <div v-else class="flex flex-col gap-2">
        <button
          class="btn btn-secondary back-btn mb-2"
          @click="closeHistoryView"
          style="width: fit-content; padding: 0.4rem 0.8rem"
        >
          <ArrowLeft class="icon-sm" />
          {{ $t('dashboard.scales.back_to_scales') }}
        </button>
        <h1 class="page-title">{{ selectedScale?.name }} {{ $t('dashboard.scales.histories') }}</h1>
        <p class="text-subtitle">
          {{ $t('dashboard.scales.scale_sn') }}
          <span class="mono-text">{{ selectedScale?.serialNumber || 'N/A' }}</span>
        </p>
      </div>
    </div>

    <div v-if="currentView === 'list'">
      <!-- Toolbar -->
      <div class="toolbar-card">
        <form @submit.prevent="performSearch" class="search-form">
          <div class="search-box">
            <Search class="search-icon" />
            <input
              type="text"
              v-model="searchQuery"
              :placeholder="$t('dashboard.scales.search_placeholder')"
              class="search-input"
            />
          </div>
          <button type="submit" class="btn btn-primary search-btn">
            {{ $t('dashboard.scales.search_btn') }}
          </button>
        </form>

        <div class="filters">
          <button class="btn btn-icon-only filter-btn-mobile">
            <Filter class="icon-sm" />
          </button>
        </div>
      </div>

      <!-- Scales Grid -->
      <div v-if="loading" class="scales-grid">
        <div v-for="n in 6" :key="n" class="scale-card card skeleton-card">
          <div class="card-header">
            <div class="scale-title">
              <div class="skel skel-icon"></div>
              <div class="skel skel-title"></div>
            </div>
            <div class="skel skel-badge"></div>
          </div>
          <div class="card-body">
            <div class="detail-row">
              <div class="skel skel-label"></div>
              <div class="skel skel-value"></div>
            </div>
            <div class="detail-row">
              <div class="skel skel-label"></div>
              <div class="skel skel-value"></div>
            </div>
            <div class="detail-row">
              <div class="skel skel-label"></div>
              <div class="skel skel-value-wide"></div>
            </div>
          </div>
          <div class="card-footer"><div class="skel skel-btn"></div></div>
        </div>
      </div>
      <div v-else class="scales-grid">
        <div
          v-for="scale in filteredScales"
          :key="scale.id"
          class="scale-card card"
          @click="openHistoryView(scale)"
        >
          <div class="card-header">
            <div class="scale-title">
              <Monitor class="icon-md text-primary" />
              <h3>{{ scale.name }}</h3>
            </div>
            <span class="status-badge" :class="scale.isActive ? 'badge-success' : 'badge-danger'">
              <ShieldCheck v-if="scale.isActive" class="icon-xs" />
              <ShieldAlert v-else class="icon-xs" />
              {{ scale.isActive ? 'Active' : 'Offline' }}
            </span>
          </div>

          <div class="card-body">
            <div class="detail-row">
              <span class="label"><Hash class="icon-xs text-subtle" /> ID</span>
              <span class="value">#{{ scale.id }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Model</span>
              <span class="value">{{ scale.model }}</span>
            </div>
            <div class="detail-row">
              <span class="label">S/N</span>
              <span class="value mono-text" v-if="scale.serialNumber">{{
                scale.serialNumber
              }}</span>
              <span class="value" v-else>—</span>
            </div>
          </div>

          <div class="card-footer">
            <button class="btn-action" @click.stop="">Test Connection</button>
          </div>
        </div>

        <div v-if="filteredScales.length === 0" class="empty-state card">
          No scales found matching your criteria.
        </div>
      </div>
    </div>

    <div v-else-if="currentView === 'history'" class="history-view">
      <!-- Toolbar for History -->
      <div class="toolbar-card" style="margin-bottom: 1.5rem">
        <form @submit.prevent="onHistorySearchSubmit" class="search-form">
          <div class="search-box">
            <Search class="search-icon" />
            <input
              type="text"
              v-model="historySearchQuery"
              :placeholder="$t('dashboard.scales.history_search')"
              class="search-input"
            />
          </div>
          <button type="submit" class="btn btn-primary search-btn">
            {{ $t('dashboard.scales.search_btn') }}
          </button>
        </form>
      </div>

      <!-- History View -->
      <div class="card table-card">
        <div v-if="historiesLoading" class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Product</th>
                <th>Category</th>
                <th class="text-right">Unit</th>
                <th class="text-right">Weight</th>
                <th class="text-right">Price</th>
                <th class="text-right">Total</th>
                <th class="text-right">Date</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="n in historyItemsPerPage" :key="n" class="skel-row">
                <td><div class="skel skel-text-sm"></div></td>
                <td><div class="skel skel-text-lg"></div></td>
                <td><div class="skel skel-text-sm"></div></td>
                <td class="text-right"><div class="skel skel-text-sm ml-auto"></div></td>
                <td class="text-right"><div class="skel skel-text-sm ml-auto"></div></td>
                <td class="text-right"><div class="skel skel-text-md ml-auto"></div></td>
                <td class="text-right"><div class="skel skel-text-md ml-auto"></div></td>
                <td class="text-right"><div class="skel skel-text-sm ml-auto"></div></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else-if="scaleHistories.length === 0" class="empty-state p-8">
          <Clock class="icon-md text-subtle mb-2" style="margin: 0 auto; display: block" />
          No history found for this scale.
        </div>

        <div v-else class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Product</th>
                <th>Category</th>
                <th class="text-right">Unit</th>
                <th class="text-right">Weight</th>
                <th class="text-right">Price</th>
                <th class="text-right">Total</th>
                <th class="text-right">Date</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="hf in scaleHistories" :key="hf.id">
                <td>{{ hf.id }}</td>
                <td>
                  <div class="product-info">
                    <span class="product-name font-medium">{{ hf.productName }}</span>
                  </div>
                </td>
                <td>{{ hf.productCategory || '—' }}</td>
                <td class="text-right">{{ hf.productUnit || '—' }}</td>
                <td class="text-right">{{ hf.weight }}</td>
                <td class="text-right">{{ (hf.price || 0).toLocaleString('uz-UZ') }} UZS</td>
                <td class="text-right highlight font-medium">
                  {{ (hf.total || 0).toLocaleString('uz-UZ') }} UZS
                </td>
                <td class="text-right">
                  {{ hf.createdAt ? new Date(hf.createdAt).toLocaleDateString('uz-UZ') : '—' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="pagination-footer" v-if="!historiesLoading && scaleHistories.length > 0">
          <span class="pagination-info">
            Showing {{ (historyPage - 1) * historyItemsPerPage + 1 }} to
            {{ Math.min(historyPage * historyItemsPerPage, historyTotalElements) }} of
            {{ historyTotalElements }} entries
          </span>
          <div class="pagination-controls">
            <button class="page-btn" @click="prevHistoryPage" :disabled="historyPage === 1">
              <ChevronLeft class="icon-xs" />
            </button>
            <span class="current-page">Page {{ historyPage }}</span>
            <button
              class="page-btn"
              @click="nextHistoryPage"
              :disabled="historyPage === historyTotalPages"
            >
              <ChevronRight class="icon-xs" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scales-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding-bottom: 2rem;
}

/* Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.page-title {
  font-size: 1.7rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.25rem 0;
}

.text-subtitle {
  color: #64748b;
  font-size: 0.95rem;
  margin: 0;
}

/* Header Actions */
.header-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.btn-primary {
  background-color: #2563eb;
  color: white;
  box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);
}

.btn-secondary {
  background-color: white;
  border: 1px solid #e2e8f0;
  color: #475569;
}

.btn-secondary:hover {
  background-color: #f8fafc;
  color: #0f172a;
}

.icon-sm {
  width: 18px;
  height: 18px;
}

.icon-md {
  width: 24px;
  height: 24px;
}

.icon-xs {
  width: 14px;
  height: 14px;
}

.text-primary {
  color: #2563eb;
}

.text-subtle {
  color: #94a3b8;
}

/* Toolbar */
.toolbar-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  padding: 1rem 1.25rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  gap: 1rem;
  flex-wrap: wrap;
}

.search-form {
  display: flex;
  flex: 1;
  gap: 0.5rem;
  align-items: center;
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 200px;
}

.search-btn {
  padding: 0.6rem 1.2rem;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  width: 18px;
  height: 18px;
}

.search-input {
  width: 100%;
  padding: 0.6rem 1rem 0.6rem 2.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
  outline: none;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
  box-sizing: border-box;
}

.search-input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.filters {
  display: flex;
  gap: 0.75rem;
}

.btn-icon-only {
  padding: 0.6rem;
  background-color: white;
  border: 1px solid #e2e8f0;
  color: #475569;
}

.btn-icon-only:hover {
  background-color: #f8fafc;
  color: #0f172a;
}

/* Scales Grid */
.scales-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.card {
  background: white;
  border-radius: 12px;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.05),
    0 2px 4px -2px rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -4px rgba(0, 0, 0, 0.1);
  border-color: #cbd5e1;
}

.scale-card {
  cursor: pointer;
}

.card-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.scale-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.scale-title h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.2;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.6rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
}

.badge-success {
  background-color: #dcfce7;
  color: #166534;
}

.badge-danger {
  background-color: #fee2e2;
  color: #991b1b;
}

.card-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  flex: 1;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.95rem;
}

.detail-row .label {
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.detail-row .value {
  color: #0f172a;
  font-weight: 500;
  text-align: right;
}

.mono-text {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.85rem;
  background-color: #f8fafc;
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
  border: 1px solid #e2e8f0;
}

.highlight-ip {
  color: #2563eb !important;
  font-weight: 600 !important;
}

.date-text {
  font-size: 0.85rem;
}

.mt-2 {
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px dashed #e2e8f0;
}

.card-footer {
  padding: 1rem 1.5rem;
  background-color: #f8fafc;
  border-top: 1px solid #f1f5f9;
  display: flex;
  gap: 0.75rem;
}

.btn-action {
  flex: 1;
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  background: white;
  color: #475569;
  font-weight: 500;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-action:hover {
  background-color: #f1f5f9;
  color: #0f172a;
  border-color: #cbd5e1;
}

.empty-state {
  grid-column: 1 / -1;
  padding: 3rem;
  text-align: center;
  color: #64748b;
  font-size: 1.1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
}

.history-view {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Pagination */
.pagination-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  background: white;
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
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  background: white;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s;
}

.page-btn:hover:not(:disabled) {
  background-color: #f1f5f9;
  border-color: #cbd5e1;
  color: #0f172a;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.current-page {
  font-size: 0.85rem;
  font-weight: 500;
  color: #1e293b;
  min-width: 4.5rem;
  text-align: center;
}

/* Modal specific (Removed as history is now full page) */

.data-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.data-table th,
.data-table td {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #f1f5f9;
  text-align: left;
}

.data-table th {
  background-color: #f8fafc;
  color: #64748b;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  position: sticky;
  top: 0;
  z-index: 10;
}

.data-table td {
  color: #1e293b;
  font-size: 0.95rem;
  vertical-align: middle;
}

.data-table tbody tr:hover {
  background-color: #f8fafc;
}

.text-right {
  text-align: right !important;
}

.font-medium {
  font-weight: 500;
}

.highlight {
  color: #2563eb;
}

.product-info {
  display: flex;
  flex-direction: column;
}

.product-unit {
  font-size: 0.8rem;
}

.p-8 {
  padding: 2rem;
}

.mb-2 {
  margin-bottom: 0.5rem;
}

.spinner {
  border: 3px solid #e2e8f0;
  border-top: 3px solid #2563eb;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@media (max-width: 640px) {
  .scales-grid {
    grid-template-columns: 1fr;
  }
}

/* ── Skeleton loaders ── */
@keyframes shimmer {
  0% {
    background-position: -400px 0;
  }
  100% {
    background-position: 400px 0;
  }
}

.skel {
  border-radius: 6px;
  background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
  background-size: 400px 100%;
  animation: shimmer 1.4s infinite linear;
}

.skel-icon {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  flex-shrink: 0;
}
.skel-title {
  width: 120px;
  height: 16px;
}
.skel-badge {
  width: 60px;
  height: 22px;
  border-radius: 9999px;
}
.skel-label {
  width: 60px;
  height: 13px;
}
.skel-value {
  width: 50px;
  height: 13px;
}
.skel-value-wide {
  width: 110px;
  height: 13px;
  border-radius: 4px;
}
.skel-btn {
  width: 100%;
  height: 32px;
  border-radius: 6px;
}

/* Table row skeletons */
.skel-row td {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #f1f5f9;
}
.skel-text-sm {
  height: 12px;
  width: 70px;
  border-radius: 4px;
}
.skel-text-md {
  height: 12px;
  width: 90px;
  border-radius: 4px;
}
.skel-text-lg {
  height: 14px;
  width: 130px;
  border-radius: 4px;
}
.ml-auto {
  margin-left: auto;
}

.skeleton-card {
  pointer-events: none;
}
</style>
