<script setup>
import { ref, watch, onMounted } from 'vue'
import { getSalesHistories } from '@/services/api'
import {
  Search,
  ShoppingBag,
  CreditCard,
  Banknote,
  Calendar,
  ChevronDown,
  ChevronUp,
  User,
  ChevronLeft,
  ChevronRight,
  Package
} from 'lucide-vue-next'

const sales = ref([])
const loading = ref(false)

// Pagination & Search
const currentPage = ref(1)
const itemsPerPage = ref(10)
const totalElements = ref(0)
const totalPages = ref(1)
const searchQuery = ref('')

const onSearchSubmit = () => {
  currentPage.value = 1
  fetchSales()
}

watch(searchQuery, (newVal) => {
  if (newVal === '') {
    currentPage.value = 1
    fetchSales()
  }
})

const fetchSales = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value - 1,
      size: itemsPerPage.value,
      sort: ['status'] // requested default sort behavior
    }

    if (searchQuery.value) {
      params.value = searchQuery.value
    }

    const res = await getSalesHistories(params)
    if (res.data && res.data.success) {
      sales.value = res.data.data.content
      totalPages.value = res.data.data.page.totalPages === 0 ? 1 : res.data.data.page.totalPages
      totalElements.value = res.data.data.page.totalElements
      // Reset expansions when new data comes in
      expandedRows.value = []
    }
  } catch (error) {
    console.error('Failed to load sales:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchSales()
})

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    fetchSales()
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    fetchSales()
  }
}

// Expand/Collapse Logic
const expandedRows = ref([])

const toggleRow = (uuid) => {
  const index = expandedRows.value.indexOf(uuid)
  if (index > -1) {
    expandedRows.value.splice(index, 1)
  } else {
    expandedRows.value.push(uuid)
  }
}

const isExpanded = (uuid) => {
  return expandedRows.value.includes(uuid)
}

// Helpers
const formatDate = (dateString) => {
  if (!dateString) return '—'
  const d = new Date(dateString)
  return d.toLocaleString('uz-UZ') // Or your preferred format
}

const formatCurrency = (amount) => {
  return (amount || 0).toLocaleString('uz-UZ') + ' UZS'
}
</script>

<template>
  <div class="sales-page">
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Sales History</h1>
        <p class="text-subtitle">View and monitor all sale transactions</p>
      </div>
    </div>

    <!-- Toolbar -->
    <div class="toolbar-card">
      <form @submit.prevent="onSearchSubmit" class="search-form">
        <div class="search-box">
          <Search class="search-icon" />
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Search sales..." 
            class="search-input"
          />
        </div>
        <button type="submit" class="btn btn-primary search-btn">Search</button>
      </form>
    </div>

    <!-- Sales Table -->
    <div class="card table-card">
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th class="w-10"></th>
              <th>Transaction ID</th>
              <th>Cashier</th>
              <th>Status</th>
              <th>Payment Type</th>
              <th class="text-right">Total Amount</th>
              <th class="text-right">Date</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="loading">
              <tr v-for="n in itemsPerPage" :key="n" class="skel-row">
                <td><div class="skel skel-icon"></div></td>
                <td><div class="skel" style="width: 140px; height: 14px;"></div></td>
                <td><div class="skel" style="width: 120px; height: 14px;"></div></td>
                <td><div class="skel skel-badge"></div></td>
                <td><div class="skel" style="width: 80px; height: 14px;"></div></td>
                <td><div class="skel ml-auto" style="width: 100px; height: 16px;"></div></td>
                <td><div class="skel ml-auto" style="width: 100px; height: 14px;"></div></td>
              </tr>
            </template>
            
            <template v-else-if="sales.length === 0">
              <tr>
                <td colspan="7" class="empty-state">
                  <ShoppingBag class="icon-xl text-subtle mx-auto mb-2" style="display: block; margin: 0 auto; width: 48px; height: 48px;" />
                  No sales found matching your criteria.
                </td>
              </tr>
            </template>
            
            <template v-else v-for="sale in sales" :key="sale.uuid">
              <!-- Main Row -->
              <tr class="main-row" @click="toggleRow(sale.uuid)" :class="{ 'expanded': isExpanded(sale.uuid) }">
                <td class="w-10 text-center">
                  <div class="expand-icon-wrapper">
                    <ChevronUp v-if="isExpanded(sale.uuid)" class="icon-sm text-primary" />
                    <ChevronDown v-else class="icon-sm text-subtle" />
                  </div>
                </td>
                <td class="mono-text text-sm">
                  {{ sale.uuid.split('-')[0] }}...
                </td>
                <td>
                  <div class="cashier-info">
                    <User class="icon-xs text-subtle" />
                    <span class="font-medium">{{ sale.cashierName || '—' }}</span>
                  </div>
                </td>
                <td>
                  <span class="status-badge" :class="sale.status === 'COMPLETED' ? 'badge-success' : 'badge-danger'">
                    {{ sale.status }}
                  </span>
                </td>
                <td>
                  <div class="payment-info">
                    <Banknote v-if="sale.paymentType === 'CASH'" class="icon-xs text-emerald" />
                    <CreditCard v-else class="icon-xs text-blue" />
                    {{ sale.paymentType }}
                  </div>
                </td>
                <td class="text-right font-medium highlight-amount">
                  {{ formatCurrency(sale.totalAmount) }}
                </td>
                <td class="text-right text-sm text-subtle">
                  <div class="date-info justify-end">
                    <Calendar class="icon-xs" />
                    {{ formatDate(sale.createdAt) }}
                  </div>
                </td>
              </tr>
              
              <!-- Expanded Sub-Row (Items list) -->
              <tr v-if="isExpanded(sale.uuid)" class="expanded-row">
                <td colspan="7" class="expanded-cell">
                  <div class="expanded-content p-4">
                    <div class="flex justify-between items-center mb-3">
                      <h4 class="text-sm font-semibold flex items-center gap-2 mb-2"><Package class="icon-sm" /> Sale Items</h4>
                      <div class="sale-summary text-sm flex gap-6" style="margin-left: 2rem; margin-bottom: 0.5rem;">
                        <span v-if="sale.discountAmount > 0" class="text-red-500 font-medium">Discount: {{ formatCurrency(sale.discountAmount) }}</span>
                        <span class="text-emerald-600 font-medium">Paid: {{ formatCurrency(sale.paidAmount) }}</span>
                        <span v-if="sale.changeAmount > 0" class="text-orange-500 font-medium">Change: {{ formatCurrency(sale.changeAmount) }}</span>
                      </div>
                    </div>
                    
                    <div class="items-table-wrapper rounded-lg border border-slate-200 overflow-hidden">
                      <table class="w-full text-sm text-left">
                        <thead class="bg-slate-50 text-slate-500 uppercase text-xs">
                          <tr>
                            <th class="px-4 py-2 font-medium">Product</th>
                            <th class="px-4 py-2 font-medium">Code</th>
                            <th class="px-4 py-2 text-right font-medium">Qty/Unit</th>
                            <th class="px-4 py-2 text-right font-medium">Price</th>
                            <th class="px-4 py-2 text-right font-medium">Total</th>
                          </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                          <tr v-for="item in sale.items" :key="item.uuid" class="bg-white hover:bg-slate-50">
                            <td class="px-4 py-2 font-medium text-slate-800">{{ item.name }}</td>
                            <td class="px-4 py-2 font-mono text-slate-500 text-xs">{{ item.code || '—' }}</td>
                            <td class="px-4 py-2 text-right text-slate-600">
                              {{ item.quantity }} <span class="text-xs text-slate-400">{{ item.unit }}</span>
                            </td>
                            <td class="px-4 py-2 text-right text-slate-600">{{ formatCurrency(item.price) }}</td>
                            <td class="px-4 py-2 text-right font-medium text-slate-800">{{ formatCurrency(item.total) }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="pagination-footer" v-if="sales.length > 0">
        <span class="pagination-info">
          Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to {{ Math.min(currentPage * itemsPerPage, totalElements) }} of {{ totalElements }} entries
        </span>
        <div class="pagination-controls">
          <button class="page-btn" @click="prevPage" :disabled="currentPage === 1">
            <ChevronLeft class="icon-xs" />
          </button>
          <span class="current-page">Page {{ currentPage }}</span>
          <button class="page-btn" @click="nextPage" :disabled="currentPage === totalPages">
            <ChevronRight class="icon-xs" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sales-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding-bottom: 2rem;
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
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
  color: #0F172A;
  margin: 0 0 0.25rem 0;
}

.text-subtitle {
  color: #64748B;
  font-size: 0.95rem;
  margin: 0;
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
  border: 1px solid #F1F5F9;
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

.btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-primary {
  background-color: #2563EB;
  color: white;
}

.btn-primary:hover {
  background-color: #1D4ED8;
}

.search-btn {
  padding: 0.6rem 1.2rem;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #94A3B8;
  width: 18px;
  height: 18px;
}

.search-input {
  width: 100%;
  padding: 0.6rem 1rem 0.6rem 2.5rem;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-sizing: border-box;
}

.search-input:focus {
  border-color: #2563EB;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

/* Table Card */
.card {
  background: white;
  border-radius: 12px;
  border: 1px solid #F1F5F9;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.table-responsive {
  overflow-x: auto;
  border-bottom: 1px solid #F1F5F9;
}

.data-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.data-table th, .data-table td {
  padding: 1rem 1.25rem;
  text-align: left;
  vertical-align: middle;
}

.data-table th {
  background-color: #F8FAFC;
  color: #64748B;
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
}

.data-table td {
  border-bottom: 1px solid #F1F5F9;
  color: #334155;
  font-size: 0.95rem;
}

.w-10 { width: 40px; }
.text-center { text-align: center; }
.text-right { text-align: right; }
.justify-end { justify-content: flex-end; }
.font-medium { font-weight: 500; }
.font-semibold { font-weight: 600; }
.text-sm { font-size: 0.875rem; }
.text-xs { font-size: 0.75rem; }

.text-subtle { color: #64748B; }
.text-primary { color: #2563EB; }
.text-emerald { color: #10B981; }
.text-blue { color: #3B82F6; }

.flex { display: flex; }
.items-center { align-items: center; }
.gap-2 { gap: 0.5rem; }
.gap-4 { gap: 1rem; }
.mb-3 { margin-bottom: 0.75rem; }
.p-4 { padding: 1.5rem; }
.mx-auto { margin-left: auto; margin-right: auto; }
.mb-2 { margin-bottom: 0.5rem; }
.bg-slate-50 { background-color: #F8FAFC; }

.main-row {
  cursor: pointer;
  transition: background-color 0.2s;
}

.main-row:hover {
  background-color: #F8FAFC;
}

.main-row.expanded {
  background-color: #EFF6FF;
}

.main-row.expanded td {
  border-bottom-color: transparent;
}

.expanded-row {
  background-color: #F8FAFC;
}

.expanded-cell {
  padding: 0 !important;
  border-bottom: 1px solid #E2E8F0 !important;
}

.expanded-content {
  border-left: 3px solid #2563EB;
  background-color: #FAFAF9;
  box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.02);
}

.expand-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  background-color: transparent;
  transition: background-color 0.2s;
}

.main-row:hover .expand-icon-wrapper {
  background-color: #FFFFFF;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

.mono-text {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  background-color: #F1F5F9;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  color: #475569;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.6rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.badge-success { background-color: #DCFCE7; color: #166534; }
.badge-danger { background-color: #FEE2E2; color: #991B1B; }

.cashier-info, .payment-info, .date-info {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.highlight-amount {
  color: #0F172A;
  font-size: 1rem;
}

.icon-sm { width: 18px; height: 18px; }
.icon-xs { width: 14px; height: 14px; }
.icon-xl { width: 48px; height: 48px; }

/* Sub Table within Expanded Row */
.items-table-wrapper {
  background-color: white;
}

.w-full { width: 100%; }
.text-left { text-align: left; }
.uppercase { text-transform: uppercase; }
.px-4 { padding-left: 1rem; padding-right: 1rem; }
.py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
.border { border: 1px solid #E2E8F0; }
.border-slate-200 { border-color: #E2E8F0; }
.rounded-lg { border-radius: 0.5rem; }
.overflow-hidden { overflow: hidden; }
.divide-y > * + * { border-top: 1px solid #F1F5F9; }
.text-slate-500 { color: #64748B; }
.text-slate-600 { color: #475569; }
.text-slate-800 { color: #1E293B; }
.text-slate-400 { color: #94A3B8; }
.text-emerald-600 { color: #059669; }
.text-red-500 { color: #EF4444; }
.text-orange-500 { color: #F97316; }
.font-mono { font-family: monospace; }
.hover\:bg-slate-50:hover { background-color: #F8FAFC; }
.bg-white { background-color: #FFFFFF; }


/* Pagination */
.pagination-footer {
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  background: white;
}

.pagination-info {
  font-size: 0.85rem;
  color: #64748B;
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
  border: 1px solid #E2E8F0;
  background: white;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s;
}

.page-btn:hover:not(:disabled) {
  background-color: #F1F5F9;
  border-color: #CBD5E1;
  color: #0F172A;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.current-page {
  font-size: 0.85rem;
  font-weight: 500;
  color: #1E293B;
  min-width: 4.5rem;
  text-align: center;
}

.empty-state {
  padding: 3rem;
  text-align: center;
  color: #64748B;
}

/* Skeletons */
@keyframes shimmer {
  0%   { background-position: -400px 0; }
  100% { background-position:  400px 0; }
}

.skel {
  border-radius: 4px;
  background: linear-gradient(90deg, #E2E8F0 25%, #F1F5F9 50%, #E2E8F0 75%);
  background-size: 400px 100%;
  animation: shimmer 1.4s infinite linear;
}

.skel-icon { width: 24px; height: 24px; border-radius: 4px; }
.skel-badge { width: 80px; height: 24px; border-radius: 9999px; }
.ml-auto { margin-left: auto; }
</style>
