import { ref, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { DollarSign, BarChart2, Sigma, Percent } from 'lucide-vue-next'
import {
  getStatistics,
  getSalesTrend,
  getSalesByCategory,
  getTopProductsTrend,
} from '@/services/api'

const DEFAULT_CATEGORY_COLORS = ['#3b82f6', '#a855f7', '#10b981', '#f59e0b', '#ef4444', '#6b7280']
const DEFAULT_LINE_COLORS = ['#3b82f6', '#a855f7', '#10b981', '#f59e0b', '#ef4444']

export function useAnalyticsCharts() {
  const { t } = useI18n()

  const dateRange = ref(null)
  const statsLoading = ref(true)
  const salesTrendLoading = ref(true)
  const categorySalesLoading = ref(true)
  const topProductsLoading = ref(true)
  const totalCategoryRevenue = ref(0)

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

  const initDateRange = () => {
    const end = new Date()
    const start = new Date(new Date().setDate(end.getDate() - 6))
    start.setHours(0, 0, 0, 0)
    end.setHours(23, 59, 59, 999)
    dateRange.value = [start, end]
  }

  const categorySales = ref([
    { name: 'Electronics', percentage: 45, color: '#3b82f6' },
    { name: 'Fashion', percentage: 25, color: '#a855f7' },
    { name: 'Home & Garden', percentage: 20, color: '#10b981' },
    { name: 'Others', percentage: 10, color: '#9ca3af' },
  ])

  const lineChartData = ref({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Wireless Headphones',
        data: [65, 59, 80, 81, 56, 120],
        fill: true,
        backgroundColor: '#3b82f61A',
        borderColor: '#3b82f6',
        borderWidth: 3,
        tension: 0.4,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#3b82f6',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Smart Watch Series 7',
        data: [28, 48, 40, 19, 86, 85],
        fill: true,
        backgroundColor: '#a855f71A',
        borderColor: '#a855f7',
        borderWidth: 3,
        tension: 0.4,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#a855f7',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Ergonomic Chair',
        data: [15, 25, 30, 45, 35, 45],
        fill: true,
        backgroundColor: '#10b9811A',
        borderColor: '#10b981',
        borderWidth: 3,
        tension: 0.4,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#10b981',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  })

  const lineChartOptions = computed(() => ({
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
            size: 13,
            weight: '500',
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        padding: 12,
        cornerRadius: 8,
        titleFont: { family: 'Inter, sans-serif', size: 13, weight: '600' },
        bodyFont: { family: 'Inter, sans-serif', size: 12 },
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
          color: '#e2e8f0',
          drawBorder: false,
          borderDash: [5, 5],
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
  }))

  const barChartData = ref({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Sales',
        data: [120, 190, 150, 250, 220, 300, 280],
        backgroundColor: '#3b82f6',
        hoverBackgroundColor: '#2563eb',
        borderRadius: 8,
        borderSkipped: false,
        barThickness: 'flex',
        maxBarThickness: 40,
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
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        padding: 12,
        cornerRadius: 8,
        titleFont: { family: 'Inter, sans-serif', size: 13, weight: '600' },
        bodyFont: { family: 'Inter, sans-serif', size: 12 },
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || ''
            if (label) {
              label += ': '
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y + ' orders'
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
          color: '#e2e8f0',
          drawBorder: false,
          borderDash: [5, 5],
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
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
        hoverOffset: 8,
        borderWidth: 3,
        borderColor: '#ffffff',
        cutout: '80%',
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

  function syncDonutFromCategorySales() {
    donutChartData.value.labels = categorySales.value.map((c) => c.name)
    donutChartData.value.datasets[0].data = categorySales.value.map((c) => c.percentage)
    donutChartData.value.datasets[0].backgroundColor = categorySales.value.map((c) => c.color)
  }

  syncDonutFromCategorySales()

  const applyStatsResult = (res) => {
    if (res.status !== 'fulfilled' || !res.value?.data?.success) return
    const d = res.value.data.data
    metrics.value[0].value = fmt(d.totalRevenue) + ' UZS'
    metrics.value[1].value = fmt(d.totalCost) + ' UZS'
    metrics.value[2].value = fmt(d.totalSum) + ' UZS'
    metrics.value[3].value = (d.conversionRate ?? 0).toFixed(2) + '%'
  }

  const applyTrendResult = (res) => {
    if (res.status !== 'fulfilled' || !res.value?.data?.success || !res.value.data.data) return
    const data = res.value.data.data
    barChartData.value.labels = data.labels || []
    barChartData.value.datasets[0].data = data.salesCount || []
  }

  const applyCategoryResult = (res) => {
    if (res.status !== 'fulfilled' || !res.value?.data?.success || !res.value.data.data) return
    const data = res.value.data.data
    totalCategoryRevenue.value = data.totalRevenue || 0
    const categories = data.categories || []
    categorySales.value = categories.map((cat, index) => ({
      name: cat.name,
      percentage: cat.percentage,
      color: DEFAULT_CATEGORY_COLORS[index % DEFAULT_CATEGORY_COLORS.length],
    }))
    syncDonutFromCategorySales()
  }

  const applyTopProductsResult = (res) => {
    if (res.status !== 'fulfilled' || !res.value?.data?.success || !res.value.data.data) return
    const data = res.value.data.data
    lineChartData.value.labels = data.labels || []
    lineChartData.value.datasets = (data.datasets || []).map((ds, index) => {
      const color = DEFAULT_LINE_COLORS[index % DEFAULT_LINE_COLORS.length]
      return {
        label: ds.label,
        data: ds.data,
        fill: true,
        backgroundColor: color + '1A',
        borderColor: color,
        borderWidth: 3,
        tension: 0.4,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: color,
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      }
    })
  }

  const fetchStatistics = async () => {
    statsLoading.value = true
    salesTrendLoading.value = true
    categorySalesLoading.value = true
    topProductsLoading.value = true

    const params = getApiParams()

    const settled = await Promise.allSettled([
      getStatistics(params),
      getSalesTrend(params),
      getSalesByCategory(params),
      getTopProductsTrend({ ...params, limit: 5 }),
    ])

    const [statsRes, trendRes, catRes, topRes] = settled

    applyStatsResult(statsRes)
    statsLoading.value = false
    if (statsRes.status === 'rejected') console.error('Failed to load main statistics', statsRes.reason)

    applyTrendResult(trendRes)
    salesTrendLoading.value = false
    if (trendRes.status === 'rejected') console.error('Failed to load sales trend', trendRes.reason)

    applyCategoryResult(catRes)
    categorySalesLoading.value = false
    if (catRes.status === 'rejected') console.error('Failed to load category sales', catRes.reason)

    applyTopProductsResult(topRes)
    topProductsLoading.value = false
    if (topRes.status === 'rejected') console.error('Failed to load top products trend', topRes.reason)
  }

  watch(dateRange, () => {
    fetchStatistics()
  })

  onMounted(() => {
    initDateRange()
  })

  return {
    dateRange,
    statsLoading,
    salesTrendLoading,
    categorySalesLoading,
    topProductsLoading,
    totalCategoryRevenue,
    metrics,
    fmt,
    lineChartData,
    lineChartOptions,
    barChartData,
    barChartOptions,
    donutChartData,
    donutChartOptions,
    categorySales,
    fetchStatistics,
  }
}
