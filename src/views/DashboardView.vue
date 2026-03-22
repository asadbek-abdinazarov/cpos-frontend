<script setup>
import { ref, onMounted } from 'vue'
import { DollarSign, BarChart2, Sigma, Percent, ChevronRight } from 'lucide-vue-next'
import { getStatistics } from '@/services/api'

const statsLoading = ref(true)

const stats = ref([
  {
    title: 'Total Revenue',
    value: null,
    icon: DollarSign,
    iconColor: 'text-blue-600',
    bg: 'bg-blue-100',
  },
  {
    title: 'Total Cost',
    value: null,
    icon: BarChart2,
    iconColor: 'text-red-600',
    bg: 'bg-red-100',
  },
  {
    title: 'Total Sum',
    value: null,
    icon: Sigma,
    iconColor: 'text-indigo-600',
    bg: 'bg-indigo-100',
  },
  {
    title: 'Conversion Rate',
    value: null,
    icon: Percent,
    iconColor: 'text-emerald-600',
    bg: 'bg-emerald-100',
  },
])

const fmt = (n) => (n ?? 0).toLocaleString('uz-UZ')

const fetchStatistics = async () => {
  statsLoading.value = true
  try {
    const res = await getStatistics()
    if (res.data?.success) {
      const d = res.data.data
      stats.value[0].value = fmt(d.totalRevenue) + ' UZS'
      stats.value[1].value = fmt(d.totalCost) + ' UZS'
      stats.value[2].value = fmt(d.totalSum) + ' UZS'
      stats.value[3].value = (d.conversionRate ?? 0).toFixed(2) + '%'
    }
  } catch (e) {
    console.error('Failed to load statistics', e)
  } finally {
    statsLoading.value = false
  }
}

onMounted(fetchStatistics)

const recentTransactions = ref([
  {
    id: '#ORD-001',
    customer: 'Alex Thompson',
    amount: '$120.50',
    status: 'Completed',
    date: '2 mins ago',
  },
  {
    id: '#ORD-002',
    customer: 'Sarah Parker',
    amount: '$75.20',
    status: 'Processing',
    date: '5 mins ago',
  },
  {
    id: '#ORD-003',
    customer: 'Michael Chen',
    amount: '$350.00',
    status: 'Completed',
    date: '10 mins ago',
  },
  {
    id: '#ORD-004',
    customer: 'Jessica Evans',
    amount: '$42.90',
    status: 'Failed',
    date: '15 mins ago',
  },
  {
    id: '#ORD-005',
    customer: 'David Wilson',
    amount: '$210.30',
    status: 'Completed',
    date: '25 mins ago',
  },
])
</script>

<template>
  <div class="dashboard-home">
    <div class="page-header">
      <h1 class="page-title">Dashboard Overview</h1>
      <div class="actions">
        <button class="btn btn-secondary">Download Report</button>
        <button class="btn btn-primary">Add Product</button>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="stats-grid">
      <div v-for="(stat, index) in stats" :key="index" class="stat-card">
        <div class="stat-header">
          <span class="stat-title">{{ stat.title }}</span>
          <div class="stat-icon-wrapper" :class="stat.bg">
            <component :is="stat.icon" class="stat-icon" :class="stat.iconColor" />
          </div>
        </div>
        <template v-if="statsLoading">
          <div class="skel skel-val"></div>
        </template>
        <div v-else class="stat-value">{{ stat.value ?? '—' }}</div>
      </div>
    </div>

    <div class="dashboard-content">
      <!-- Recent Transactions -->
      <div class="card recent-transactions">
        <div class="card-header">
          <h3>Recent Transactions</h3>
          <a href="#" class="view-all">
            View All
            <ChevronRight class="icon-sm" />
          </a>
        </div>
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in recentTransactions" :key="order.id">
                <td>{{ order.id }}</td>
                <td>
                  <div class="customer-cell">
                    <div class="customer-avatar">{{ order.customer.charAt(0) }}</div>
                    {{ order.customer }}
                  </div>
                </td>
                <td class="font-medium">{{ order.amount }}</td>
                <td>
                  <span class="status-badge" :class="order.status.toLowerCase()">
                    {{ order.status }}
                  </span>
                </td>
                <td class="text-sm text-gray">{{ order.date }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Quick Chart Placeholder -->
      <div class="card sales-chart">
        <div class="card-header">
          <h3>Sales Overview</h3>
          <select class="period-select">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>This Year</option>
          </select>
        </div>
        <div class="chart-box">
          <!-- Placeholder SVG Chart -->
          <svg viewBox="0 0 500 200" class="chart-svg">
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#2563EB" stop-opacity="0.2" />
                <stop offset="100%" stop-color="#2563EB" stop-opacity="0" />
              </linearGradient>
            </defs>
            <polyline
              fill="none"
              stroke="#2563EB"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
              points="0,150 50,120 100,160 150,100 200,80 250,110 300,60 350,90 400,40 450,70 500,20"
            />
            <polygon
              fill="url(#chartGradient)"
              points="0,150 50,120 100,160 150,100 200,80 250,110 300,60 350,90 400,40 450,70 500,20 500,200 0,200"
            />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
}

.actions {
  display: flex;
  gap: 1rem;
}

.btn {
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  font-size: 0.9rem;
}

.btn-primary {
  background-color: #2563eb;
  color: white;
  box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);
}

.btn-primary:hover {
  background-color: #1d4ed8;
  box-shadow: 0 4px 12px -1px rgba(37, 99, 235, 0.3);
}

.btn-secondary {
  background-color: white;
  border: 1px solid #e2e8f0;
  color: #475569;
}

.btn-secondary:hover {
  background-color: #f8fafc;
  border-color: #cbd5e1;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.stat-title {
  color: #64748b;
  font-size: 0.85rem;
  font-weight: 600;
}

.stat-icon-wrapper {
  padding: 10px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon {
  width: 20px;
  height: 20px;
}

/* Background/Text Utility Classes (scoped) */
.bg-blue-100 {
  background-color: #dbeafe;
}
.text-blue-600 {
  color: #2563eb;
}
.bg-orange-100 {
  background-color: #ffedd5;
}
.text-orange-600 {
  color: #ea580c;
}
.bg-purple-100 {
  background-color: #f3e8ff;
}
.text-purple-600 {
  color: #9333ea;
}
.bg-emerald-100 {
  background-color: #d1fae5;
}
.text-emerald-600 {
  color: #059669;
}
.bg-red-100 {
  background-color: #fee2e2;
}
.text-red-600 {
  color: #dc2626;
}
.bg-indigo-100 {
  background-color: #e0e7ff;
}
.text-indigo-600 {
  color: #4f46e5;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.5rem;
  letter-spacing: -0.02em;
}

.stat-change {
  font-size: 0.85rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.trend-icon {
  width: 16px;
  height: 16px;
}

.stat-change.up {
  color: #10b981;
}
.stat-change.down {
  color: #ef4444;
}

.trend-text {
  color: #94a3b8;
  font-weight: 500;
}

/* Content Layout */
.dashboard-content {
  display: grid;
  grid-template-columns: 1.8fr 1.2fr;
  gap: 1.5rem;
}

.card {
  background: white;
  border-radius: 16px;
  border: 1px solid #f1f5f9;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.card-header {
  padding: 1.5rem;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  font-size: 1.1rem;
  font-weight: 700;
  color: #0f172a;
}

.view-all {
  color: #2563eb;
  font-size: 0.85rem;
  text-decoration: none;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 2px;
  transition: gap 0.2s;
}

.view-all:hover {
  gap: 4px;
}

.icon-sm {
  width: 16px;
  height: 16px;
}

/* Table */
.table-container {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 1rem 1.5rem;
  text-align: left;
}

.data-table th {
  background-color: #f8fafc;
  color: #64748b;
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.data-table td {
  border-bottom: 1px solid #f1f5f9;
  color: #334155;
  font-size: 0.9rem;
}

.data-table tr:hover td {
  background-color: #f8fafc;
}

.data-table tr:last-child td {
  border-bottom: none;
}

.customer-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 500;
  color: #0f172a;
}

.customer-avatar {
  width: 32px;
  height: 32px;
  background-color: #eff6ff;
  color: #2563eb;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.8rem;
}

.font-medium {
  font-weight: 600;
  color: #0f172a;
}

.text-gray {
  color: #64748b;
}

.status-badge {
  padding: 0.25rem 0.6rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
}

.status-badge.completed {
  background-color: #dcfce7;
  color: #16a34a;
}
.status-badge.processing {
  background-color: #dbeafe;
  color: #2563eb;
}
.status-badge.failed {
  background-color: #fee2e2;
  color: #dc2626;
}

/* Chart */
.chart-box {
  padding: 1.5rem;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-svg {
  width: 100%;
  height: auto;
  overflow: visible;
  filter: drop-shadow(0 4px 6px rgba(37, 99, 235, 0.1));
}

.period-select {
  padding: 0.4rem 0.8rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  color: #475569;
  font-size: 0.85rem;
  outline: none;
  background-color: white;
  cursor: pointer;
}

@media (max-width: 1024px) {
  .dashboard-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .page-title {
    font-size: 1.25rem;
  }

  .data-table th,
  .data-table td {
    padding: 0.75rem 1rem;
  }
}

/* ── Skeleton ── */
@keyframes shimmer {
  0% {
    background-position: -300px 0;
  }
  100% {
    background-position: 300px 0;
  }
}
.skel {
  border-radius: 6px;
  background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
  background-size: 300px 100%;
  animation: shimmer 1.4s infinite linear;
}
.skel-val {
  height: 32px;
  width: 65%;
  border-radius: 8px;
  margin-bottom: 0.5rem;
}
</style>
