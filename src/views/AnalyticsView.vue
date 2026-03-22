<script setup>
import { ref, onMounted } from 'vue'
import { DollarSign, BarChart2, Sigma, Percent, Download, MoreVertical } from 'lucide-vue-next'
import {
  getStatistics,
  getSalesTrend,
  getSalesByCategory,
  getTopProductsTrend,
} from '@/services/api'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js'
import { Bar, Doughnut, Line } from 'vue-chartjs'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  PointElement,
  LineElement,
)
import { VueDatePicker } from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const dateRange = ref(null)

const initDateRange = () => {
  const end = new Date()
  const start = new Date(new Date().setDate(end.getDate() - 6))
  start.setHours(0, 0, 0, 0)
  end.setHours(23, 59, 59, 999)
  dateRange.value = [start, end]
}

// Loading state
const statsLoading = ref(true)
const salesTrendLoading = ref(true)
const categorySalesLoading = ref(true)
const topProductsLoading = ref(true)

// Central total revenue for the Doughnut chart
const totalCategoryRevenue = ref(0)

// 6 metric cards matching all API fields
const metrics = ref([
  {
    title: 'dashboard.analytics.total_revenue',
    value: null,
    sub: null,
    icon: DollarSign,
    iconColor: 'text-blue-600',
    bg: 'bg-blue-100',
  },
  {
    title: 'dashboard.analytics.total_cost',
    value: null,
    sub: null,
    icon: BarChart2,
    iconColor: 'text-red-600',
    bg: 'bg-red-100',
  },
  {
    title: 'dashboard.analytics.total_sum',
    value: null,
    sub: null,
    icon: Sigma,
    iconColor: 'text-indigo-600',
    bg: 'bg-indigo-100',
  },
  {
    title: 'dashboard.analytics.conversion_rate',
    value: null,
    sub: null,
    icon: Percent,
    iconColor: 'text-emerald-600',
    bg: 'bg-emerald-100',
  },
])

const fmt = (n) => (n ?? 0).toLocaleString('uz-UZ')

const getApiParams = () => {
  if (dateRange.value && dateRange.value.length === 2 && dateRange.value[0] && dateRange.value[1]) {
    return {
      fromDate: dateRange.value[0].toISOString(),
      toDate: dateRange.value[1].toISOString(),
    }
  }
  return {}
}

const fetchStatistics = async () => {
  statsLoading.value = true
  salesTrendLoading.value = true
  categorySalesLoading.value = true
  topProductsLoading.value = true

  const params = getApiParams()

  try {
    const resStats = await getStatistics(params)
    if (resStats.data?.success) {
      const d = resStats.data.data
      metrics.value[0].value = fmt(d.totalRevenue) + ' UZS'
      metrics.value[1].value = fmt(d.totalCost) + ' UZS'
      metrics.value[2].value = fmt(d.totalSum) + ' UZS'
      metrics.value[3].value = (d.conversionRate ?? 0).toFixed(2) + '%'
    }
  } catch (e) {
    console.error('Failed to load main statistics', e)
  } finally {
    statsLoading.value = false
  }

  // Fetch Sales Trend
  try {
    const resTrend = await getSalesTrend(params)
    if (resTrend.data?.success && resTrend.data.data) {
      const data = resTrend.data.data
      barChartData.value.labels = data.labels || []
      barChartData.value.datasets[0].data = data.salesCount || []
    }
  } catch (e) {
    console.error('Failed to load sales trend', e)
  } finally {
    salesTrendLoading.value = false
  }

  // Fetch Category Sales
  try {
    const resCat = await getSalesByCategory(params)
    if (resCat.data?.success && resCat.data.data) {
      const data = resCat.data.data
      totalCategoryRevenue.value = data.totalRevenue || 0

      const categories = data.categories || []

      // Update the reactive array preserving colors if possible, or assigning new ones
      const defaultColors = ['#3b82f6', '#a855f7', '#10b981', '#f59e0b', '#ef4444', '#6b7280']
      categorySales.value = categories.map((cat, index) => ({
        name: cat.name,
        percentage: cat.percentage,
        color: defaultColors[index % defaultColors.length],
      }))

      donutChartData.value.labels = categorySales.value.map((c) => c.name)
      donutChartData.value.datasets[0].data = categorySales.value.map((c) => c.percentage)
      donutChartData.value.datasets[0].backgroundColor = categorySales.value.map((c) => c.color)
    }
  } catch (e) {
    console.error('Failed to load category sales', e)
  } finally {
    categorySalesLoading.value = false
  }

  // Fetch Top Products Trend
  try {
    const resTop = await getTopProductsTrend({ ...params, limit: 5 })
    if (resTop.data?.success && resTop.data.data) {
      const data = resTop.data.data
      lineChartData.value.labels = data.labels || []

      const defaultColors = ['#3b82f6', '#a855f7', '#10b981', '#f59e0b', '#ef4444']
      lineChartData.value.datasets = (data.datasets || []).map((ds, index) => {
        const color = defaultColors[index % defaultColors.length]
        return {
          label: ds.label,
          data: ds.data,
          fill: false,
          borderColor: color,
          tension: 0.4,
          pointBackgroundColor: color,
        }
      })
    }
  } catch (e) {
    console.error('Failed to load top products trend', e)
  } finally {
    topProductsLoading.value = false
  }
}

// Re-fetch when date changes
import { watch } from 'vue'
watch(dateRange, () => {
  fetchStatistics()
})

onMounted(() => {
  initDateRange()
})

// Top Products Data (Line Chart over 6 months)
const lineChartData = ref({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Wireless Headphones',
      data: [65, 59, 80, 81, 56, 120],
      fill: false,
      borderColor: '#3b82f6',
      tension: 0.4,
      pointBackgroundColor: '#3b82f6',
    },
    {
      label: 'Smart Watch Series 7',
      data: [28, 48, 40, 19, 86, 85],
      fill: false,
      borderColor: '#a855f7',
      tension: 0.4,
      pointBackgroundColor: '#a855f7',
    },
    {
      label: 'Ergonomic Chair',
      data: [15, 25, 30, 45, 35, 45],
      fill: false,
      borderColor: '#10b981',
      tension: 0.4,
      pointBackgroundColor: '#10b981',
    },
  ],
})

const lineChartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  plugins: {
    legend: {
      position: 'top',
      labels: {
        usePointStyle: true,
        boxWidth: 8,
        font: {
          family: 'Inter, sans-serif',
          size: 12,
        },
      },
    },
    tooltip: {
      backgroundColor: '#0f172a',
      padding: 12,
      cornerRadius: 8,
      callbacks: {
        label: function (context) {
          let label = context.dataset.label || ''
          if (label) {
            label += ': '
          }
          if (context.parsed.y !== null) {
            label += context.parsed.y + ' ' + t('dashboard.analytics.sales')
          }
          return label
        },
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: '#f1f5f9',
        drawBorder: false,
      },
      ticks: {
        color: '#64748b',
        font: {
          family: 'Inter, sans-serif',
          size: 11,
        },
      },
      title: {
        display: true,
        text: 'Number of Sales',
        color: '#64748b',
        font: {
          family: 'Inter, sans-serif',
          size: 12,
        },
      },
    },
    x: {
      grid: {
        display: false,
        drawBorder: false,
      },
      ticks: {
        color: '#64748b',
        font: {
          family: 'Inter, sans-serif',
          size: 12,
        },
      },
    },
  },
})

// Category Sales Data (static)
const categorySales = ref([
  { name: 'Electronics', percentage: 45, color: '#3b82f6' },
  { name: 'Fashion', percentage: 25, color: '#a855f7' },
  { name: 'Home & Garden', percentage: 20, color: '#10b981' },
  { name: 'Others', percentage: 10, color: '#9ca3af' },
])

// Chart Config
const barChartData = ref({
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Sales',
      data: [120, 190, 150, 250, 220, 300, 280],
      backgroundColor: 'rgba(59, 130, 246, 0.8)',
      hoverBackgroundColor: 'rgba(59, 130, 246, 1)',
      borderRadius: 6,
      barThickness: 32,
    },
  ],
})

const barChartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: '#0f172a',
      padding: 12,
      cornerRadius: 8,
      callbacks: {
        label: function (context) {
          let label = context.dataset.label || ''
          if (label) {
            label += ': '
          }
          if (context.parsed.y !== null) {
            label += context.parsed.y + ' ' + t('dashboard.analytics.orders')
          }
          return label
        },
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: '#f1f5f9',
        drawBorder: false,
      },
      ticks: {
        color: '#64748b',
        font: {
          family: 'Inter, sans-serif',
          size: 11,
        },
      },
    },
    x: {
      grid: {
        display: false,
        drawBorder: false,
      },
      ticks: {
        color: '#64748b',
        font: {
          family: 'Inter, sans-serif',
          size: 12,
        },
      },
    },
  },
})

const donutChartData = ref({
  labels: categorySales.value.map((c) => c.name),
  datasets: [
    {
      data: categorySales.value.map((c) => c.percentage),
      backgroundColor: categorySales.value.map((c) => c.color),
      hoverOffset: 4,
      borderWidth: 0,
      cutout: '75%',
    },
  ],
})

const donutChartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: '#0f172a',
      padding: 12,
      cornerRadius: 8,
      callbacks: {
        label: function (context) {
          return `${context.label}: ${context.parsed}%`
        },
      },
    },
  },
})
</script>

<template>
  <div class="analytics-page">
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">{{ $t('dashboard.analytics.title') }}</h1>
        <p class="text-subtitle">{{ $t('dashboard.analytics.overview') }}</p>
      </div>
      <div class="actions">
        <div class="date-picker-wrapper">
          <VueDatePicker
            v-model="dateRange"
            range
            :enable-time-picker="true"
            format="dd.MM.yyyy HH:mm"
            placeholder="Select date and time"
          />
        </div>
        <button class="btn btn-outline">
          <Download class="icon-sm" />
          {{ $t('dashboard.analytics.download_report') }}
        </button>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="stats-grid">
      <div v-for="(stat, index) in metrics" :key="index" class="stat-card">
        <div class="stat-header">
          <span class="stat-title">{{ $t(stat.title) }}</span>
          <div class="stat-icon-wrapper" :class="stat.bg">
            <component :is="stat.icon" class="stat-icon" :class="stat.iconColor" />
          </div>
        </div>
        <div class="stat-content">
          <!-- Skeleton while loading -->
          <template v-if="statsLoading">
            <div class="skel skel-val"></div>
            <div class="skel skel-chg" style="margin-top: 0.5rem"></div>
          </template>
          <div v-else class="stat-value">{{ stat.value ?? '—' }}</div>
        </div>
      </div>
    </div>

    <div class="dashboard-content">
      <!-- Revenue Trend Chart (Placeholder) -->
      <div class="card revenue-chart">
        <div class="card-header">
          <h3>{{ $t('dashboard.analytics.sales_trend') }}</h3>
          <button class="btn-icon">
            <MoreVertical class="icon-sm" />
          </button>
        </div>
        <div class="chart-container" style="height: 300px; width: 100%">
          <template v-if="salesTrendLoading">
            <div class="skel" style="width: 100%; height: 100%; border-radius: 8px"></div>
          </template>
          <Bar v-else :data="barChartData" :options="barChartOptions" />
        </div>
      </div>

      <!-- Sales by Category -->
      <div class="card category-chart">
        <div class="card-header">
          <h3>{{ $t('dashboard.analytics.sales_by_category') }}</h3>
        </div>
        <div class="chart-body">
          <template v-if="categorySalesLoading">
            <div
              class="skel"
              style="width: 180px; height: 180px; border-radius: 50%; margin: 0 auto 1.5rem auto"
            ></div>
            <div class="skel" style="width: 100%; height: 40px; border-radius: 8px"></div>
          </template>
          <template v-else>
            <div class="donut-chart-placeholder" style="background: none">
              <div class="donut-ring" style="z-index: 1">
                <span class="donut-text"
                  >{{ $t('dashboard.analytics.total') }}<br /><strong
                    >{{ fmt(totalCategoryRevenue) || 0 }}<br />UZS</strong
                  ></span
                >
              </div>
              <div style="position: relative; z-index: 10; width: 100%; height: 100%">
                <Doughnut :data="donutChartData" :options="donutChartOptions" />
              </div>
            </div>
            <div class="legend">
              <div v-for="cat in categorySales" :key="cat.name" class="legend-item">
                <div class="indicator" :style="{ backgroundColor: cat.color }"></div>
                <span class="legend-name">{{ cat.name }}</span>
                <span class="legend-value">{{ cat.percentage }}%</span>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- Top Products Line Chart -->
    <div class="card top-products">
      <div class="card-header">
        <h3>{{ $t('dashboard.analytics.top_products') }}</h3>
        <button class="btn-link">{{ $t('dashboard.analytics.view_details') }}</button>
      </div>
      <div class="chart-container" style="height: 350px; width: 100%; padding-top: 5px">
        <template v-if="topProductsLoading">
          <div class="skel" style="width: 100%; height: 100%; border-radius: 8px"></div>
        </template>
        <Line v-else :data="lineChartData" :options="lineChartOptions" />
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
  color: #0f172a;
  margin-bottom: 0.25rem;
}

.text-subtitle {
  color: #64748b;
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
  border: 1px solid #e2e8f0;
  color: #475569;
}

.btn-outline:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}

/* VueDatePicker Custom Theme overrides */
.date-picker-wrapper {
  width: 320px;
  /* Override default VueDatePicker variables to match our app */
  --dp-font-family: inherit;
  --dp-border-radius: 8px;
  --dp-border-color: #e2e8f0;
  --dp-border-color-hover: #cbd5e1;
  --dp-background-color: white;
  --dp-text-color: #475569;
  --dp-icon-color: #64748b;
  --dp-primary-color: #3b82f6; /* Same as bg-blue-500 */
  --dp-primary-disabled-color: #93c5fd;
  --dp-primary-text-color: #fff;
  --dp-secondary-color: #f1f5f9;
}

.date-picker-wrapper :deep(.dp__input) {
  padding: 0.6rem 1rem 0.6rem 2.2rem;
  font-weight: 500;
  font-size: 0.9rem;
  box-shadow: none; /* Remove default box shadow if any */
}

.date-picker-wrapper :deep(.dp__input_icon) {
  left: 10px;
  padding: 0;
  height: 16px;
  width: 16px;
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
  border: 1px solid #f1f5f9;
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

.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.5rem;
}

.stat-change {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.85rem;
  font-weight: 600;
}

.stat-change.up {
  color: #10b981;
}
.stat-change.down {
  color: #ef4444;
}

.text-muted {
  color: #94a3b8;
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
  border: 1px solid #f1f5f9;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.card-header {
  padding: 1.25rem 1.5rem;
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

.btn-icon {
  background: transparent;
  border: none;
  cursor: pointer;
  color: #64748b;
  padding: 4px;
  border-radius: 4px;
}

.btn-icon:hover {
  background: #f1f5f9;
  color: #0f172a;
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
  background-color: #3b82f6;
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
  color: #64748b;
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
  position: relative;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.donut-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 110px;
  height: 110px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  pointer-events: none; /* Let clicks pass through to chart tooltips */
}

.donut-text {
  font-size: 0.85rem;
  color: #64748b;
}

.donut-text strong {
  display: block;
  font-size: 1.25rem;
  color: #0f172a;
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
  color: #0f172a;
}

/* Top Products Table */
.btn-link {
  background: none;
  border: none;
  color: #2563eb;
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

.product-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.product-thumb {
  width: 36px;
  height: 36px;
  background-color: #f1f5f9;
  border-radius: 6px;
}

.product-name {
  font-weight: 500;
  color: #0f172a;
}

.growth-badge {
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
}

.growth-badge.positive {
  background: #dcfce7;
  color: #16a34a;
}
.growth-badge.negative {
  background: #fee2e2;
  color: #dc2626;
}

/* Colors Utility */
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
.bg-blue-500 {
  background-color: #3b82f6;
}
.bg-purple-500 {
  background-color: #a855f7;
}
.bg-emerald-500 {
  background-color: #10b981;
}
.bg-gray-400 {
  background-color: #9ca3af;
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
  height: 36px;
  width: 70%;
  border-radius: 8px;
}
.skel-chg {
  height: 14px;
  width: 50%;
  border-radius: 4px;
}
</style>
