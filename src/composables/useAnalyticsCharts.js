import { ref, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  DollarSign,
  BarChart2,
  Sigma,
  Percent,
  Banknote,
  CreditCard,
  Smartphone,
} from 'lucide-vue-next'
import {
  getStatistics,
  getSalesTrend,
  getSalesByCategory,
  getHourlySales,
  getPaymentMethods,
  getTopProducts,
  exportStatistics,
} from '@/services/api'
import { getApiLocaleTag } from '@/utils/localeApi'

const DEFAULT_CATEGORY_COLORS = ['#3b82f6', '#a855f7', '#10b981', '#f59e0b', '#ef4444', '#6b7280']

const PAYMENT_META = {
  CASH: { icon: Banknote, color: '#10b981' },
  CARD: { icon: CreditCard, color: '#3b82f6' },
  TRANSFER: { icon: Smartphone, color: '#8b5cf6' },
}

export function useAnalyticsCharts() {
  const { t } = useI18n()

  // ─── Date range ─────────────────────────────────
  const dateRange = ref(null)

  // ─── Loading states ──────────────────────────────
  const statsLoading = ref(true)
  const salesTrendLoading = ref(true)
  const categorySalesLoading = ref(true)
  const hourlyLoading = ref(true)
  const paymentLoading = ref(true)
  const topProductsLoading = ref(true)
  const downloadLoading = ref(false)

  // ─── Metrics ─────────────────────────────────────
  const totalCategoryRevenue = ref(0)

  const metrics = ref([
    {
      title: 'dashboard.analytics.total_revenue',
      value: null,
      icon: DollarSign,
      iconColor: 'text-blue-600',
      bg: 'bg-blue-100',
    },
    {
      title: 'dashboard.analytics.total_cost',
      value: null,
      icon: BarChart2,
      iconColor: 'text-red-600',
      bg: 'bg-red-100',
    },
    {
      title: 'dashboard.analytics.total_sum',
      value: null,
      icon: Sigma,
      iconColor: 'text-indigo-600',
      bg: 'bg-indigo-100',
    },
    {
      title: 'dashboard.analytics.conversion_rate',
      value: null,
      icon: Percent,
      iconColor: 'text-emerald-600',
      bg: 'bg-emerald-100',
    },
  ])

  // ─── Helpers ─────────────────────────────────────
  const fmt = (n) => (n ?? 0).toLocaleString('uz-UZ')

  const getApiParams = () => {
    if (
      dateRange.value &&
      dateRange.value.length === 2 &&
      dateRange.value[0] &&
      dateRange.value[1]
    ) {
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

  // ─── Category / Donut chart ───────────────────────
  const categorySales = ref([])

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
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0f172a',
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (ctx) => `${ctx.label}: ${ctx.parsed}%`,
        },
      },
    },
  })

  function syncDonutFromCategorySales() {
    donutChartData.value.labels = categorySales.value.map((c) => c.name)
    donutChartData.value.datasets[0].data = categorySales.value.map((c) => c.percentage)
    donutChartData.value.datasets[0].backgroundColor = categorySales.value.map((c) => c.color)
  }

  // ─── Sales trend (bar) chart ──────────────────────
  const barChartData = ref({
    labels: [],
    datasets: [
      {
        label: 'Sales',
        data: [],
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
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        padding: 12,
        cornerRadius: 8,
        titleFont: { family: 'Inter, sans-serif', size: 13, weight: '600' },
        bodyFont: { family: 'Inter, sans-serif', size: 12 },
        callbacks: {
          label: (ctx) => ` ${ctx.parsed.y} ${t('dashboard.analytics.orders')}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: '#e2e8f0', drawBorder: false, borderDash: [5, 5] },
        ticks: { color: '#64748b', font: { family: 'Inter, sans-serif', size: 11 } },
      },
      x: {
        grid: { display: false, drawBorder: false },
        ticks: { color: '#64748b', font: { family: 'Inter, sans-serif', size: 12 } },
      },
    },
  })

  // ─── Hourly chart ─────────────────────────────────
  const peakHour = ref(null)

  const hourlyChartData = ref({
    labels: [],
    datasets: [
      {
        label: t('dashboard.analytics.orders'),
        data: [],
        backgroundColor: [],
        borderRadius: 6,
        borderSkipped: false,
        barThickness: 'flex',
        maxBarThickness: 28,
      },
    ],
  })

  const hourlyChartOptions = ref({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        padding: 10,
        cornerRadius: 8,
        titleFont: { size: 12, weight: '600' },
        bodyFont: { size: 11 },
        callbacks: {
          title: (ctx) => `${ctx[0].label}:00`,
          label: (ctx) => ` ${ctx.parsed.y} ${t('dashboard.analytics.orders')}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: '#e2e8f0', borderDash: [4, 4] },
        ticks: { color: '#64748b', font: { size: 11 } },
      },
      x: {
        grid: { display: false },
        ticks: { color: '#64748b', font: { size: 11 } },
      },
    },
  })

  // ─── Payment methods ──────────────────────────────
  const paymentMethods = ref([])

  // ─── Top products ─────────────────────────────────
  const topProducts = ref([])

  // ─── Apply helpers ────────────────────────────────
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
    categorySales.value = (data.categories || []).map((cat, i) => ({
      name: cat.name,
      percentage: cat.percentage,
      color: DEFAULT_CATEGORY_COLORS[i % DEFAULT_CATEGORY_COLORS.length],
    }))
    syncDonutFromCategorySales()
  }

  const applyHourlyResult = (res) => {
    if (res.status !== 'fulfilled' || !res.value?.data?.success || !res.value.data.data) return
    const data = res.value.data.data
    const hours = data.hours || []

    peakHour.value = data.peakHour ?? null

    const maxCount = Math.max(...hours.map((h) => h.count), 1)

    hourlyChartData.value.labels = hours.map((h) => String(h.hour).padStart(2, '0'))
    hourlyChartData.value.datasets[0].data = hours.map((h) => h.count)
    hourlyChartData.value.datasets[0].backgroundColor = hours.map((h) => {
      const ratio = h.count / maxCount
      const alpha = 0.15 + ratio * 0.85
      return h.hour === data.peakHour ? '#007bff' : `rgba(0,123,255,${alpha.toFixed(2)})`
    })
  }

  const applyPaymentResult = (res) => {
    if (res.status !== 'fulfilled' || !res.value?.data?.success || !res.value.data.data) return
    const data = res.value.data.data
    paymentMethods.value = (data.methods || []).map((m) => {
      const meta = PAYMENT_META[m.type] || PAYMENT_META.CASH
      return {
        type: m.type,
        name: t(`dashboard.sales.payment.${m.type.toLowerCase()}`),
        icon: meta.icon,
        color: meta.color,
        percentage: m.percentage,
        amount: m.amount,
        count: m.count,
      }
    })
  }

  const applyTopProductsResult = (res) => {
    if (res.status !== 'fulfilled' || !res.value?.data?.success || !res.value.data.data) return
    const data = res.value.data.data
    topProducts.value = (data.products || []).map((p) => ({
      rank: p.rank,
      id: p.productId,
      name: p.productName,
      category: p.categoryName,
      sales: p.soldCount,
      revenue: p.revenue,
      trend: p.trendPercent > 0 ? 'up' : p.trendPercent < 0 ? 'down' : 'neutral',
      trendPct: p.trendPercent,
    }))
  }

  // ─── Main fetch ───────────────────────────────────
  const fetchStatistics = async () => {
    statsLoading.value = true
    salesTrendLoading.value = true
    categorySalesLoading.value = true
    hourlyLoading.value = true
    paymentLoading.value = true
    topProductsLoading.value = true

    const params = getApiParams()

    const settled = await Promise.allSettled([
      getStatistics(params),
      getSalesTrend(params),
      getSalesByCategory(params),
      getHourlySales(params),
      getPaymentMethods(params),
      getTopProducts({ ...params, limit: 5 }),
    ])

    const [statsRes, trendRes, catRes, hourlyRes, paymentRes, topRes] = settled

    applyStatsResult(statsRes)
    statsLoading.value = false
    applyTrendResult(trendRes)
    salesTrendLoading.value = false
    applyCategoryResult(catRes)
    categorySalesLoading.value = false
    applyHourlyResult(hourlyRes)
    hourlyLoading.value = false
    applyPaymentResult(paymentRes)
    paymentLoading.value = false
    applyTopProductsResult(topRes)
    topProductsLoading.value = false

    // individual chart failures are handled silently — charts show empty state
  }

  // ─── Export / Download ────────────────────────────
  const downloadReport = async (format = 'xlsx') => {
    if (downloadLoading.value) return
    downloadLoading.value = true
    try {
      const params = {
        ...getApiParams(),
        format,
        lang: getApiLocaleTag(),
      }
      const res = await exportStatistics(params)
      const blob = new Blob([res.data], {
        type:
          format === 'csv'
            ? 'text/csv;charset=utf-8;'
            : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      const p = getApiParams()
      const from = p.fromDate ? p.fromDate.slice(0, 10) : 'start'
      const to = p.toDate ? p.toDate.slice(0, 10) : 'end'
      link.href = url
      link.download = `hisobot_${from}_${to}.${format}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch {
      // error shown by global API interceptor
    } finally {
      downloadLoading.value = false
    }
  }

  // ─── Watcher ──────────────────────────────────────
  watch(dateRange, (val) => {
    const isComplete = Array.isArray(val) && val.length === 2 && val[0] && val[1]
    const isCleared = !val || (Array.isArray(val) && val.length === 0)
    if (isComplete || isCleared) fetchStatistics()
  })

  onMounted(() => {
    initDateRange()
  })

  return {
    dateRange,
    // loading
    statsLoading,
    salesTrendLoading,
    categorySalesLoading,
    hourlyLoading,
    paymentLoading,
    topProductsLoading,
    downloadLoading,
    // data
    totalCategoryRevenue,
    metrics,
    peakHour,
    paymentMethods,
    topProducts,
    // chart data/options
    barChartData,
    barChartOptions,
    donutChartData,
    donutChartOptions,
    categorySales,
    hourlyChartData,
    hourlyChartOptions,
    // helpers / actions
    fmt,
    fetchStatistics,
    downloadReport,
  }
}
