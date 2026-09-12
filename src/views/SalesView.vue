<script setup>
import { ref, watch, onMounted } from 'vue'
import { getSalesHistories } from '@/services/api'
import { useDelayedLoading } from '@/composables/useDelayedLoading'
import BasePagination from '@/components/dashboard/BasePagination.vue'
import {
  Search,
  ShoppingBag,
  CreditCard,
  Banknote,
  Calendar,
  ChevronDown,
  ChevronUp,
  User,
} from 'lucide-vue-next'

const sales = ref([])
const { loading, showSkeleton, startLoading, stopLoading } = useDelayedLoading()
const currentPage = ref(1)
const itemsPerPage = ref(10)
const totalElements = ref(0)
const totalPages = ref(1)
const searchQuery = ref('')
const expandedRows = ref([])

const onSearchSubmit = () => {
  currentPage.value = 1
  fetchSales()
}

watch(searchQuery, (val) => {
  if (val === '') { currentPage.value = 1; fetchSales() }
})

const fetchSales = async () => {
  startLoading()
  try {
    const params = {
      page: currentPage.value - 1,
      size: itemsPerPage.value,
      sort: 'status',
    }
    if (searchQuery.value) params.value = searchQuery.value

    const res = await getSalesHistories(params)
    if (res.data?.success) {
      sales.value = res.data.data.content
      totalPages.value = res.data.data.page.totalPages === 0 ? 1 : res.data.data.page.totalPages
      totalElements.value = res.data.data.page.totalElements
      expandedRows.value = []
    }
  } catch (error) {
    console.error('Failed to load sales:', error)
  } finally {
    stopLoading()
  }
}

const prevPage = () => {
  if (currentPage.value > 1) { currentPage.value--; fetchSales() }
}
const nextPage = () => {
  if (currentPage.value < totalPages.value) { currentPage.value++; fetchSales() }
}
const goToPage = (page) => {
  currentPage.value = page
  fetchSales()
}

const toggleRow = (uuid) => {
  const i = expandedRows.value.indexOf(uuid)
  if (i > -1) expandedRows.value.splice(i, 1)
  else expandedRows.value.push(uuid)
}
const isExpanded = (uuid) => expandedRows.value.includes(uuid)

const formatDate = (str) => {
  if (!str) return '—'
  return new Date(str).toLocaleString('uz-UZ')
}
const formatCurrency = (amount) =>
  (amount || 0).toLocaleString('uz-UZ') + ' UZS'

const pad = (n, len) => String(n).padStart(len, '0')

/** "12 000 so'm" — uzilmas probel bilan (desktop Money.format bilan bir xil). */
const fmtMoney = (v) =>
  new Intl.NumberFormat('ru-RU').format(Number(v) || 0).replace(/ /g, ' ') + " so'm"

/** To'liq: dd.MM.yyyy, HH:mm */
const fmtDateTime = (str) => {
  if (!str) return '—'
  const d = new Date(str)
  return `${pad(d.getDate(), 2)}.${pad(d.getMonth() + 1, 2)}.${d.getFullYear()}, ` +
         `${pad(d.getHours(), 2)}:${pad(d.getMinutes(), 2)}`
}

/**
 * Chek raqami: backend bermagani uchun sana + tartib raqamdan yasaladi
 * (yyyyMMdd-NNNN). Tartib sahifadagi mutlaq o'ringa bog'langan, shuning
 * uchun sahifalar almashganda ham takrorlanmaydi. Faqat ko'rsatish uchun.
 */
const receiptNo = (sale, index) => {
  if (sale.receiptNo) return sale.receiptNo
  const d = new Date(sale.createdAt)
  if (isNaN(d)) return '—'
  const day = `${d.getFullYear()}${pad(d.getMonth() + 1, 2)}${pad(d.getDate(), 2)}`
  const seq = (currentPage.value - 1) * itemsPerPage.value + index + 1
  return `${day}-${pad(seq, 4)}`
}

const lineGross = (item) => (Number(item.price) || 0) * (Number(item.quantity) || 0)

/** Qator chegirmasi: price×qty − total (backend qator chegirmasini alohida bermaydi). */
const lineDiscount = (item) => Math.max(0, lineGross(item) - (Number(item.total) || 0))

const subtotal = (sale) =>
  (sale.items || []).reduce((s, it) => s + lineGross(it), 0)

const itemsDiscount = (sale) =>
  (sale.items || []).reduce((s, it) => s + lineDiscount(it), 0)

const isMixed = (sale) => (sale.cashAmount ?? 0) > 0 && (sale.cardAmount ?? 0) > 0

onMounted(fetchSales)
</script>

<template>
  <div class="sl-page">

    <!-- ─── Hero ───────────────────────────────────── -->
    <div class="sl-hero">
      <div class="sl-hero-grid"></div>
      <div class="sl-orb sl-orb-1"></div>
      <div class="sl-orb sl-orb-2"></div>
      <div class="sl-hero-body">
        <div class="sl-hero-left">
          <div class="sl-badge">
            <ShoppingBag :size="11" />
            {{ $t('dashboard.sales.title') }}
          </div>
          <h1 class="sl-title">{{ $t('dashboard.sales.title') }}</h1>
          <p class="sl-subtitle">{{ $t('dashboard.sales.subtitle') }}</p>
        </div>
      </div>
    </div>

    <!-- ─── Toolbar ─────────────────────────────────── -->
    <div class="sl-toolbar">
      <form @submit.prevent="onSearchSubmit" class="sl-search-wrap">
        <div class="sl-search-box">
          <Search class="sl-search-ico" :size="16" />
          <input
            type="text"
            v-model="searchQuery"
            :placeholder="$t('dashboard.sales.search_placeholder')"
            class="sl-search-input"
          />
        </div>
        <button type="submit" class="sl-search-btn">
          {{ $t('dashboard.sales.search_btn') }}
        </button>
      </form>
    </div>

    <!-- ─── Table card ──────────────────────────────── -->
    <div class="sl-card">
      <div class="sl-table-wrap">
        <table class="sl-table">
          <thead>
            <tr>
              <th class="th-toggle"></th>
              <th>{{ $t('dashboard.table.transaction_id') }}</th>
              <th>{{ $t('dashboard.table.cashier') }}</th>
              <th>{{ $t('dashboard.table.status') }}</th>
              <th>{{ $t('dashboard.table.payment_type') }}</th>
              <th class="th-right">{{ $t('dashboard.table.total_amount') }}</th>
              <th class="th-right">{{ $t('dashboard.table.date') }}</th>
            </tr>
          </thead>
          <tbody>

            <!-- Skeleton -->
            <template v-if="showSkeleton">
              <tr v-for="n in itemsPerPage" :key="n" class="skel-row">
                <td><div class="skel skel-toggle"></div></td>
                <td><div class="skel" style="width:110px;height:13px"></div></td>
                <td><div class="skel" style="width:120px;height:13px"></div></td>
                <td><div class="skel skel-badge"></div></td>
                <td><div class="skel" style="width:80px;height:13px"></div></td>
                <td><div class="skel" style="width:110px;height:13px;margin-left:auto"></div></td>
                <td><div class="skel" style="width:100px;height:13px;margin-left:auto"></div></td>
              </tr>
            </template>

            <!-- Empty -->
            <template v-else-if="sales.length === 0">
              <tr>
                <td colspan="7" class="sl-empty">
                  <div class="sl-empty-inner">
                    <div class="sl-empty-icon"><ShoppingBag :size="28" /></div>
                    <p>{{ $t('dashboard.sales.empty') }}</p>
                  </div>
                </td>
              </tr>
            </template>

            <!-- Rows -->
            <template v-else v-for="(sale, saleIndex) in sales" :key="sale.uuid">
              <tr
                class="sl-row"
                :class="{ 'sl-row--open': isExpanded(sale.uuid) }"
                @click="toggleRow(sale.uuid)"
              >
                <td class="td-toggle">
                  <div class="sl-chevron-wrap">
                    <ChevronUp v-if="isExpanded(sale.uuid)" :size="14" class="sl-chevron-active" />
                    <ChevronDown v-else :size="14" class="sl-chevron" />
                  </div>
                </td>
                <td>
                  <span class="sl-receipt">{{ receiptNo(sale, saleIndex) }}</span>
                </td>
                <td>
                  <div class="sl-cashier">
                    <User :size="13" class="sl-row-ico" />
                    <span>{{ sale.cashierName || '—' }}</span>
                  </div>
                </td>
                <td>
                  <span
                    class="sl-status"
                    :class="sale.status === 'COMPLETED' ? 'sl-status-ok' : 'sl-status-err'"
                  >
                    {{ sale.status === 'COMPLETED'
                      ? $t('dashboard.sales.status.completed')
                      : sale.status === 'CANCELLED'
                        ? $t('dashboard.sales.status.cancelled')
                        : sale.status }}
                  </span>
                </td>
                <td>
                  <div class="sl-payment">
                    <Banknote v-if="sale.paymentType === 'CASH'" :size="14" class="sl-ico-cash" />
                    <CreditCard v-else :size="14" class="sl-ico-card" />
                    <span>{{ sale.paymentType === 'CASH' ? $t('dashboard.sales.payment.cash') : $t('dashboard.sales.payment.card') }}</span>
                  </div>
                </td>
                <td class="td-right sl-amount">{{ formatCurrency(sale.totalAmount) }}</td>
                <td class="td-right sl-date">
                  <div class="sl-date-cell">
                    <Calendar :size="12" class="sl-row-ico" />
                    {{ formatDate(sale.createdAt) }}
                  </div>
                </td>
              </tr>

              <!-- Expanded row -->
              <tr v-if="isExpanded(sale.uuid)" class="sl-expanded-row">
                <td colspan="7" class="sl-expanded-cell">
                  <div class="sl-rc">

                    <!-- Mahsulotlar jadvali -->
                    <div class="sl-rc-items">
                      <div class="sl-rc-ihead">
                        <span class="sl-rc-c-name">{{ $t('dashboard.sales.item_name') }}</span>
                        <span class="sl-rc-c-qty">{{ $t('dashboard.sales.item_qty') }}</span>
                        <span class="sl-rc-c-price">{{ $t('dashboard.sales.item_price') }}</span>
                        <span class="sl-rc-c-disc">{{ $t('dashboard.sales.item_discount') }}</span>
                        <span class="sl-rc-c-total">{{ $t('dashboard.sales.item_total') }}</span>
                      </div>
                      <div v-for="item in sale.items" :key="item.uuid" class="sl-rc-irow">
                        <span class="sl-rc-c-name sl-rc-iname">
                          {{ item.name }}
                          <span v-if="item.unit" class="sl-rc-unit">{{ item.unit }}</span>
                        </span>
                        <span class="sl-rc-c-qty mono">{{ item.quantity }}</span>
                        <span class="sl-rc-c-price mono">{{ fmtMoney(item.price) }}</span>
                        <span class="sl-rc-c-disc mono">
                          {{ lineDiscount(item) > 0 ? fmtMoney(lineDiscount(item)) : '—' }}
                        </span>
                        <span class="sl-rc-c-total mono sl-rc-itotal">{{ fmtMoney(item.total) }}</span>
                      </div>
                    </div>

                    <div class="sl-rc-sep"></div>

                    <!-- Summalar -->
                    <div class="sl-rc-trow">
                      <span class="sl-rc-tlabel">{{ $t('dashboard.sales.subtotal') }}</span>
                      <span class="sl-rc-tvalue mono">{{ fmtMoney(subtotal(sale)) }}</span>
                    </div>
                    <div v-if="itemsDiscount(sale) > 0" class="sl-rc-trow">
                      <span class="sl-rc-tlabel">{{ $t('dashboard.sales.line_discounts') }}</span>
                      <span class="sl-rc-tvalue mono">−{{ fmtMoney(itemsDiscount(sale)) }}</span>
                    </div>
                    <div v-if="sale.discountAmount > 0" class="sl-rc-trow">
                      <span class="sl-rc-tlabel">{{ $t('dashboard.sales.sale_discount') }}</span>
                      <span class="sl-rc-tvalue mono">−{{ fmtMoney(sale.discountAmount) }}</span>
                    </div>
                    <div class="sl-rc-trow">
                      <span class="sl-rc-tlabel-strong">{{ $t('dashboard.sales.grand_total') }}</span>
                      <span class="sl-rc-tvalue-strong mono">{{ fmtMoney(sale.totalAmount) }}</span>
                    </div>

                    <!-- Aralash to'lov -->
                    <template v-if="isMixed(sale)">
                      <div class="sl-rc-sep"></div>
                      <div class="sl-rc-mrow">
                        <span class="sl-rc-mlabel">{{ $t('dashboard.sales.cash_part') }}</span>
                        <span class="sl-rc-mvalue mono">{{ fmtMoney(sale.cashAmount) }}</span>
                      </div>
                      <div class="sl-rc-mrow">
                        <span class="sl-rc-mlabel">{{ $t('dashboard.sales.card_part') }}</span>
                        <span class="sl-rc-mvalue mono">{{ fmtMoney(sale.cardAmount) }}</span>
                      </div>
                    </template>

                    <!-- To'langan / qaytim -->
                    <template v-if="sale.paidAmount > 0 || sale.changeAmount > 0">
                      <div class="sl-rc-sep"></div>
                      <div v-if="sale.paidAmount > 0" class="sl-rc-mrow">
                        <span class="sl-rc-mlabel">{{ $t('dashboard.sales.paid') }}</span>
                        <span class="sl-rc-mvalue mono">{{ fmtMoney(sale.paidAmount) }}</span>
                      </div>
                      <div v-if="sale.changeAmount > 0" class="sl-rc-mrow">
                        <span class="sl-rc-mlabel">{{ $t('dashboard.sales.change') }}</span>
                        <span class="sl-rc-mvalue mono">{{ fmtMoney(sale.changeAmount) }}</span>
                      </div>
                    </template>

                    <div class="sl-rc-sep"></div>

                    <!-- Meta -->
                    <div class="sl-rc-mrow">
                      <span class="sl-rc-mlabel">{{ $t('dashboard.table.cashier') }}</span>
                      <span class="sl-rc-mvalue">{{ sale.cashierName || '—' }}</span>
                    </div>
                    <div class="sl-rc-mrow">
                      <span class="sl-rc-mlabel">{{ $t('dashboard.sales.datetime') }}</span>
                      <span class="sl-rc-mvalue mono">{{ fmtDateTime(sale.createdAt) }}</span>
                    </div>
                    <div class="sl-rc-mrow">
                      <span class="sl-rc-mlabel">{{ $t('dashboard.sales.txn_id') }}</span>
                      <span class="sl-rc-mvalue sl-rc-uuid">{{ sale.uuid }}</span>
                    </div>

                  </div>
                </td>
              </tr>
            </template>

          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <BasePagination
        v-if="!loading && sales.length > 0"
        :current-page="currentPage"
        :total-pages="totalPages"
        :total-elements="totalElements"
        :items-per-page="itemsPerPage"
        @page-change="goToPage"
      />
    </div>

  </div>
</template>

<style scoped>
.sl-page {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* ─── Hero ─────────────────────────────────────── */
.sl-hero {
  position: relative;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  padding: 1.75rem 2rem;
  overflow: hidden;
}

.sl-hero-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(0,123,255,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,123,255,0.03) 1px, transparent 1px);
  background-size: 28px 28px;
  pointer-events: none;
}

.sl-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(70px);
  pointer-events: none;
}
.sl-orb-1 {
  width: 320px; height: 320px;
  background: radial-gradient(circle, rgba(0,123,255,0.09) 0%, transparent 70%);
  top: -100px; right: -60px;
}
.sl-orb-2 {
  width: 220px; height: 220px;
  background: radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%);
  bottom: -80px; left: -40px;
}

.sl-hero-body {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.25rem;
  flex-wrap: wrap;
}

.sl-badge {
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

.sl-title {
  margin: 0 0 0.3rem;
  font-size: 1.6rem;
  font-weight: 800;
  background: linear-gradient(135deg, #0f172a 0%, #007bff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;
}

.sl-subtitle {
  margin: 0;
  font-size: 0.875rem;
  color: #64748b;
}

/* ─── Toolbar ──────────────────────────────────── */
.sl-toolbar {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 0.9rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.sl-search-wrap {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex: 1;
}

.sl-search-box {
  position: relative;
  flex: 1;
}

.sl-search-ico {
  position: absolute;
  left: 11px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  pointer-events: none;
}

.sl-search-input {
  width: 100%;
  padding: 0.6rem 1rem 0.6rem 2.25rem;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.875rem;
  color: #0f172a;
  background: #f8fafc;
  outline: none;
  transition: all 0.2s;
  font-family: inherit;
  box-sizing: border-box;
}
.sl-search-input::placeholder { color: #94a3b8; }
.sl-search-input:focus {
  border-color: #007bff;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(0,123,255,0.08);
}

.sl-search-btn {
  padding: 0.6rem 1.1rem;
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.2s;
  font-family: inherit;
}
.sl-search-btn:hover { background: #0069d9; }

/* ─── Table card ───────────────────────────────── */
.sl-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  overflow: hidden;
}

.sl-table-wrap {
  overflow-x: auto;
  overscroll-behavior-x: contain;
}

.sl-table {
  width: 100%;
  border-collapse: collapse;
}

.sl-table th {
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

.sl-table td {
  padding: 0.9rem 1.25rem;
  border-bottom: 1px solid #f8fafc;
  font-size: 0.875rem;
  color: #334155;
  vertical-align: middle;
}

.th-toggle { width: 44px; }
.th-right  { text-align: right; }
.td-toggle { width: 44px; text-align: center; }
.td-right  { text-align: right; }

/* ─── Main row ─────────────────────────────────── */
.sl-row {
  cursor: pointer;
  transition: background 0.12s;
}
.sl-row:hover td { background: #f8fafc; }
.sl-row--open td { background: rgba(0,123,255,0.04); border-bottom-color: transparent; }

.sl-chevron-wrap {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  background: #f1f5f9;
  transition: background 0.15s;
}
.sl-row:hover .sl-chevron-wrap { background: #e2e8f0; }
.sl-row--open .sl-chevron-wrap { background: rgba(0,123,255,0.1); }

.sl-chevron      { color: #94a3b8; }
.sl-chevron-active { color: #007bff; }

.sl-receipt {
  display: inline-block;
  padding: 0.2rem 0.5rem;
  background: #f1f5f9;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: #0f172a;
  white-space: nowrap;
}

.sl-cashier {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-weight: 500;
  color: #0f172a;
}

.sl-row-ico { color: #94a3b8; flex-shrink: 0; }

.sl-status {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.7rem;
  border-radius: 100px;
  font-size: 0.72rem;
  font-weight: 700;
  white-space: nowrap;
}
.sl-status-ok {
  background: rgba(16,185,129,0.1);
  color: #059669;
  border: 1px solid rgba(16,185,129,0.2);
}
.sl-status-err {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.sl-payment {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.875rem;
}
.sl-ico-cash { color: #059669; }
.sl-ico-card { color: #007bff; }

.sl-amount {
  font-weight: 700;
  color: #0f172a;
  font-size: 0.9rem;
}

.sl-date {
  color: #64748b;
  font-size: 0.8rem;
}
.sl-date-cell {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.35rem;
}

/* ─── Expanded row ─────────────────────────────── */
.sl-expanded-row { background: #f8fafc; }

.sl-expanded-cell {
  padding: 0 !important;
  border-bottom: 1px solid #e2e8f0 !important;
}

.sl-expanded {
  padding: 1.25rem 1.5rem;
  border-left: 3px solid #007bff;
}

/* ─── Empty ─────────────────────────────────────── */
.sl-empty { text-align: center; padding: 3rem; }
.sl-empty-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
  color: #94a3b8;
}
.sl-empty-icon {
  width: 56px; height: 56px;
  border-radius: 14px;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #cbd5e1;
}
.sl-empty p { font-size: 0.875rem; margin: 0; }

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
.skel-toggle { width: 24px; height: 24px; border-radius: 6px; }
.skel-badge  { width: 80px; height: 20px; border-radius: 100px; }

/* ─── Chek tafsiloti (receipt card) ─────────────── */
.mono { font-variant-numeric: tabular-nums; }

.sl-rc {
  padding: 0 0.75rem 0.75rem;
}

/* Mahsulotlar jadvali — grid: nomi o'sadi, qolganlari qat'iy */
.sl-rc-ihead,
.sl-rc-irow {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 70px 110px 90px 120px;
  gap: 0.75rem;
  align-items: baseline;
  padding: 4px 0;
}

.sl-rc-ihead {
  font-size: 11.5px;
  font-weight: 700;
  color: #94a3b8;
}

.sl-rc-irow {
  font-size: 13px;
  color: #334155;
}

.sl-rc-c-qty,
.sl-rc-c-price,
.sl-rc-c-disc,
.sl-rc-c-total { text-align: right; }

.sl-rc-c-name { min-width: 0; overflow-wrap: anywhere; }

.sl-rc-iname {
  font-weight: 600;
  color: #0f172a;
}

.sl-rc-unit {
  font-size: 0.72rem;
  font-weight: 500;
  color: #94a3b8;
  margin-left: 4px;
}

.sl-rc-itotal {
  font-weight: 700;
  color: #0f172a;
}

/* Ajratuvchi */
.sl-rc-sep {
  height: 1px;
  background: #e2e8f0;
  margin: 0.5rem 0;
}

/* Summalar */
.sl-rc-trow,
.sl-rc-mrow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 3px 0;
}

.sl-rc-tlabel { font-size: 13px; color: #64748b; }
.sl-rc-tvalue { font-size: 13px; color: #334155; }

.sl-rc-tlabel-strong { font-size: 14.5px; font-weight: 700; color: #0f172a; }
.sl-rc-tvalue-strong { font-size: 14.5px; font-weight: 800; color: #007bff; }

/* Meta qatorlari */
.sl-rc-mlabel { font-size: 12px; color: #94a3b8; }
.sl-rc-mvalue { font-size: 12px; color: #64748b; text-align: right; }

.sl-rc-uuid {
  font-family: ui-monospace, monospace;
  font-size: 11.5px;
  overflow-wrap: anywhere;
}

/* ─── Responsive ────────────────────────────────── */
@media (max-width: 768px) {
  .sl-hero     { padding: 1.25rem; }
  .sl-title    { font-size: 1.3rem; }
  .sl-toolbar  { flex-direction: column; align-items: stretch; }
  .sl-search-wrap { flex-direction: column; }
  .sl-search-btn  { width: 100%; justify-content: center; text-align: center; }
  .sl-table th,
  .sl-table td  { padding: 0.7rem 0.85rem; }

  /* Jadval ustunlari torayadi: Chegirma ustuni yashiriladi */
  .sl-rc-ihead,
  .sl-rc-irow {
    grid-template-columns: minmax(0, 1fr) 48px 84px;
    gap: 0.5rem;
    font-size: 12.5px;
  }
  .sl-rc-c-price,
  .sl-rc-c-disc { display: none; }

  .sl-rc-mrow { align-items: flex-start; }
  .sl-rc-mvalue { max-width: 60%; }
}
</style>
