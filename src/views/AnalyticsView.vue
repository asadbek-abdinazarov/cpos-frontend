<script setup>
import { ref, onMounted } from 'vue'
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  CreditCard,
  BarChart2,
  Sigma,
  Percent,
  Calendar,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical
} from 'lucide-vue-next'
import { getStatistics } from '@/services/api'

// Period Filter
const selectedPeriod = ref('Last 7 Days')
const periods = ['Today', 'Last 7 Days', 'Last 30 Days', 'This Month', 'Last Month', 'This Year', 'All Time']

// Loading state
const statsLoading = ref(true)

// 6 metric cards matching all API fields
const metrics = ref([
  { title: 'Total Revenue',     value: null, sub: null, icon: DollarSign,  iconColor: 'text-blue-600',    bg: 'bg-blue-100' },
  { title: 'Total Cost',        value: null, sub: null, icon: BarChart2,   iconColor: 'text-red-600',     bg: 'bg-red-100' },
  { title: 'Total Sum',         value: null, sub: null, icon: Sigma,       iconColor: 'text-indigo-600',  bg: 'bg-indigo-100' },
  { title: 'Conversion Rate',   value: null, sub: null, icon: Percent,     iconColor: 'text-emerald-600', bg: 'bg-emerald-100' },
])

const fmt = (n) => (n ?? 0).toLocaleString('uz-UZ')

const getDateRange = (period) => {
  const toDate = new Date()
  let fromDate = new Date()

  // Reset time for consistent start/end of day boundaries
  toDate.setHours(23, 59, 59, 999)
  fromDate.setHours(0, 0, 0, 0)

  switch (period) {
    case 'Today':
      break;
    case 'Last 7 Days':
      fromDate.setDate(toDate.getDate() - 6)
      break;
    case 'Last 30 Days':
      fromDate.setDate(toDate.getDate() - 29)
      break;
    case 'This Month':
      fromDate.setDate(1) // First day of current month
      break;
    case 'Last Month':
      fromDate.setMonth(toDate.getMonth() - 1)
      fromDate.setDate(1) // First day of last month
      
      toDate.setDate(0) // Last day of last month (0th day of current month)
      toDate.setHours(23, 59, 59, 999)
      break;
    case 'This Year':
      fromDate.setMonth(0, 1) // Jan 1st
      break;
    case 'All Time':
      return {} // Send no params for all time
  }

  return {
    fromDate: fromDate.toISOString(),
    toDate: toDate.toISOString()
  }
}

const fetchStatistics = async () => {
  statsLoading.value = true
  try {
    const params = getDateRange(selectedPeriod.value)
    
    const res = await getStatistics(params)
    if (res.data?.success) {
      const d = res.data.data
      metrics.value[0].value = fmt(d.totalRevenue) + ' UZS'
      metrics.value[1].value = fmt(d.totalCost) + ' UZS'
      metrics.value[2].value = fmt(d.totalSum) + ' UZS'
      metrics.value[3].value = (d.conversionRate ?? 0).toFixed(2) + '%'
    }
  } catch (e) {
    console.error('Failed to load statistics', e)
  } finally {
    statsLoading.value = false
  }
}

// Re-fetch when period changes
import { watch } from 'vue'
watch(selectedPeriod, () => {
  fetchStatistics()
})

onMounted(fetchStatistics)

// Top Products Data (static)
const topProducts = ref([
  { id: 1, name: 'Wireless Headphones',  category: 'Accessories', sales: 120, revenue: '$12,400', growth: '+15%' },
  { id: 2, name: 'Smart Watch Series 7', category: 'Electronics', sales: 85,  revenue: '$34,000', growth: '+8%' },
  { id: 3, name: 'Ergonomic Chair',      category: 'Furniture',   sales: 45,  revenue: '$11,250', growth: '+12%' },
  { id: 4, name: 'Mechanical Keyboard',  category: 'Electronics', sales: 30,  revenue: '$4,500',  growth: '-2%' },
])

// Category Sales Data (static)
const categorySales = ref([
  { name: 'Electronics',  percentage: 45, color: 'bg-blue-500' },
  { name: 'Fashion',      percentage: 25, color: 'bg-purple-500' },
  { name: 'Home & Garden',percentage: 20, color: 'bg-emerald-500' },
  { name: 'Others',       percentage: 10, color: 'bg-gray-400' },
])
</script>

<template>
  <div class="analytics-page">
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Analytics Dashboard</h1>
        <p class="text-subtitle">Overview of your store's performance</p>
      </div>
      <div class="actions">
        <div class="select-wrapper">
          <Calendar class="select-icon" />
          <select v-model="selectedPeriod" class="period-select">
            <option v-for="period in periods" :key="period">{{ period }}</option>
          </select>
        </div>
        <button class="btn btn-outline">
          <Download class="icon-sm" />
          Export
        </button>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="stats-grid">
      <div v-for="(stat, index) in metrics" :key="index" class="stat-card">
        <div class="stat-header">
          <span class="stat-title">{{ stat.title }}</span>
          <div class="stat-icon-wrapper" :class="stat.bg">
            <component :is="stat.icon" class="stat-icon" :class="stat.iconColor" />
          </div>
        </div>
        <div class="stat-content">
          <!-- Skeleton while loading -->
          <template v-if="statsLoading">
            <div class="skel skel-val"></div>
            <div class="skel skel-chg" style="margin-top:0.5rem"></div>
          </template>
          <div v-else class="stat-value">{{ stat.value ?? '—' }}</div>
        </div>
      </div>
    </div>

    <div class="dashboard-content">
      <!-- Revenue Trend Chart (Placeholder) -->
      <div class="card revenue-chart">
        <div class="card-header">
          <h3>Revenue Trend</h3>
          <button class="btn-icon">
            <MoreVertical class="icon-sm" />
          </button>
        </div>
        <div class="chart-container">
          <!-- Simplified CSS Bar Chart for visualization -->
           <div class="bar-chart">
             <div class="bar-group" v-for="i in 7" :key="i">
               <div class="bar" :style="{ height: `${Math.random() * 60 + 20}%` }"></div>
               <span class="bar-label">Day {{ i }}</span>
             </div>
           </div>
        </div>
      </div>

      <!-- Sales by Category -->
      <div class="card category-chart">
        <div class="card-header">
          <h3>Sales by Category</h3>
        </div>
        <div class="chart-body">
          <div class="donut-chart-placeholder">
            <div class="donut-ring">
              <span class="donut-text">Total<br><strong>$48.5k</strong></span>
            </div>
          </div>
          <div class="legend">
            <div v-for="cat in categorySales" :key="cat.name" class="legend-item">
              <div class="indicator" :class="cat.color"></div>
              <span class="legend-name">{{ cat.name }}</span>
              <span class="legend-value">{{ cat.percentage }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Top Products Table -->
    <div class="card top-products">
      <div class="card-header">
        <h3>Top Performing Products</h3>
        <button class="btn-link">View All</button>
      </div>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Category</th>
              <th>Sales</th>
              <th>Revenue</th>
              <th>Growth</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in topProducts" :key="product.id">
              <td>
                <div class="product-info">
                  <div class="product-thumb"></div>
                  <span class="product-name">{{ product.name }}</span>
                </div>
              </td>
              <td>{{ product.category }}</td>
              <td>{{ product.sales }}</td>
              <td>{{ product.revenue }}</td>
              <td>
                <span class="growth-badge" :class="product.growth.startsWith('+') ? 'positive' : 'negative'">
                  {{ product.growth }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.analytics-page {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 1rem;
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

.actions {
  display: flex;
  gap: 1rem;
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
}

.btn-outline {
  background: white;
  border: 1px solid #E2E8F0;
  color: #475569;
}

.btn-outline:hover {
  background: #F8FAFC;
  border-color: #CBD5E1;
}

.select-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.select-icon {
  position: absolute;
  left: 10px;
  width: 16px;
  height: 16px;
  color: #64748B;
  pointer-events: none;
}

.period-select {
  padding: 0.6rem 1rem 0.6rem 2.2rem;
  border-radius: 8px;
  border: 1px solid #E2E8F0;
  background: white;
  color: #475569;
  font-weight: 500;
  font-size: 0.9rem;
  cursor: pointer;
  outline: none;
  appearance: none; /* Remove default arrow in some browsers if needed, or keep standard */
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  border: 1px solid #F1F5F9;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.stat-title {
  color: #64748B;
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

.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: #0F172A;
  margin-bottom: 0.5rem;
}

.stat-change {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.85rem;
  font-weight: 600;
}

.stat-change.up { color: #10B981; }
.stat-change.down { color: #EF4444; }

.text-muted {
  color: #94A3B8;
  font-weight: 400;
  margin-left: 4px;
}

/* Dashboard Content (Charts) */
.dashboard-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
}

.card {
  background: white;
  border-radius: 16px;
  border: 1px solid #F1F5F9;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.card-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #F1F5F9;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  font-size: 1.1rem;
  font-weight: 700;
  color: #0F172A;
}

.btn-icon {
  background: transparent;
  border: none;
  cursor: pointer;
  color: #64748B;
  padding: 4px;
  border-radius: 4px;
}

.btn-icon:hover {
  background: #F1F5F9;
  color: #0F172A;
}

/* Revenue Chart (Bar Chart) */
.chart-container {
  padding: 1.5rem;
  height: 300px;
  display: flex;
  align-items: flex-end;
}

.bar-chart {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 10px;
}

.bar-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  justify-content: flex-end;
}

.bar {
  width: 60%;
  background-color: #3B82F6;
  border-radius: 6px 6px 0 0;
  transition: height 0.5s ease-out;
  opacity: 0.8;
}

.bar:hover {
  opacity: 1;
  transform: scaleY(1.02);
}

.bar-label {
  margin-top: 10px;
  font-size: 0.8rem;
  color: #64748B;
}

/* Category Chart (Donut) */
.chart-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.donut-chart-placeholder {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: conic-gradient(
    #3B82F6 0% 45%,
    #A855F7 45% 70%,
    #10B981 70% 90%,
    #9CA3AF 90% 100%
  );
  position: relative;
  margin-bottom: 1.5rem;
}

.donut-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120px;
  height: 120px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.donut-text {
  font-size: 0.85rem;
  color: #64748B;
}

.donut-text strong {
  display: block;
  font-size: 1.25rem;
  color: #0F172A;
  margin-top: 4px;
}

.legend {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #475569;
}

.indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.legend-value {
  margin-left: auto;
  font-weight: 600;
  color: #0F172A;
}

/* Top Products Table */
.btn-link {
  background: none;
  border: none;
  color: #2563EB;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.9rem;
}

.table-responsive {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th, .data-table td {
  padding: 1rem 1.5rem;
  text-align: left;
}

.data-table th {
  background-color: #F8FAFC;
  color: #64748B;
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.data-table td {
  border-bottom: 1px solid #F1F5F9;
  color: #334155;
  font-size: 0.9rem;
}

.product-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.product-thumb {
  width: 36px;
  height: 36px;
  background-color: #F1F5F9;
  border-radius: 6px;
}

.product-name {
  font-weight: 500;
  color: #0F172A;
}

.growth-badge {
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
}

.growth-badge.positive { background: #DCFCE7; color: #16A34A; }
.growth-badge.negative { background: #FEE2E2; color: #DC2626; }

/* Colors Utility */
.bg-blue-100 { background-color: #DBEAFE; }
.text-blue-600 { color: #2563EB; }
.bg-orange-100 { background-color: #FFEDD5; }
.text-orange-600 { color: #EA580C; }
.bg-purple-100 { background-color: #F3E8FF; }
.text-purple-600 { color: #9333EA; }
.bg-emerald-100 { background-color: #D1FAE5; }
.text-emerald-600 { color: #059669; }
.bg-blue-500 { background-color: #3B82F6; }
.bg-purple-500 { background-color: #A855F7; }
.bg-emerald-500 { background-color: #10B981; }
.bg-gray-400 { background-color: #9CA3AF; }
.bg-red-100 { background-color: #FEE2E2; }
.text-red-600 { color: #DC2626; }
.bg-indigo-100 { background-color: #E0E7FF; }
.text-indigo-600 { color: #4F46E5; }

/* Responsive */
@media (max-width: 1024px) {
  .dashboard-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .actions {
    width: 100%;
    justify-content: space-between;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
}

/* ── Skeleton ── */
@keyframes shimmer {
  0%   { background-position: -300px 0; }
  100% { background-position:  300px 0; }
}
.skel {
  border-radius: 6px;
  background: linear-gradient(90deg, #E2E8F0 25%, #F1F5F9 50%, #E2E8F0 75%);
  background-size: 300px 100%;
  animation: shimmer 1.4s infinite linear;
}
.skel-val { height: 36px; width: 70%; border-radius: 8px; }
.skel-chg { height: 14px; width: 50%; border-radius: 4px; }
</style>
