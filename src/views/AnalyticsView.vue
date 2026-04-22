<script setup>
import '@/plugins/chart.js'
import { Download, RefreshCw, TrendingUp } from 'lucide-vue-next'
import { VueDatePicker } from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import AnalyticsMetrics from '@/components/analytics/AnalyticsMetrics.vue'
import AnalyticsCharts from '@/components/analytics/AnalyticsCharts.vue'
import { useAnalyticsCharts } from '@/composables/useAnalyticsCharts.js'

const {
  dateRange,
  metrics,
  statsLoading,
  salesTrendLoading,
  categorySalesLoading,
  totalCategoryRevenue,
  fmt,
  barChartData,
  barChartOptions,
  donutChartData,
  donutChartOptions,
  categorySales,
  fetchStatistics,
} = useAnalyticsCharts()
</script>

<template>
  <div class="analytics-page">
    <!-- ─── Hero Header ─────────────────────────── -->
    <div class="analytics-hero">
      <div class="bg-grid"></div>
      <div class="bg-blob blob-1"></div>
      <div class="bg-blob blob-2"></div>
      <div class="bg-blob blob-3"></div>

      <div class="hero-inner">
        <div class="hero-text">
          <div class="badge-pill">
            <span class="badge-dot"></span>
            {{ $t('dashboard.analytics.title') }} · Real-vaqt
          </div>
          <h1 class="hero-title">
            Biznes
            <span class="title-highlight">Analitikasi</span>
          </h1>
          <p class="hero-subtitle">{{ $t('dashboard.analytics.overview') }}</p>
        </div>

        <div class="hero-actions">
          <div class="date-picker-wrapper">
            <VueDatePicker
              v-model="dateRange"
              range
              :enable-time-picker="true"
              format="dd.MM.yyyy HH:mm"
              placeholder="Sana oralig'ini tanlang"
              teleport="body"
            />
          </div>
          <button type="button" class="btn btn-icon-only" @click="fetchStatistics" title="Yangilash">
            <RefreshCw class="icon-sm" />
          </button>
          <button type="button" class="btn btn-outline">
            <Download class="icon-sm" />
            <span class="btn-label">{{ $t('dashboard.analytics.download_report') }}</span>
          </button>
        </div>
      </div>

      <!-- Floating indicator -->
      <div class="float-live">
        <TrendingUp :size="13" color="#10b981" />
        <span>Jonli ma'lumot</span>
        <span class="live-dot"></span>
      </div>
    </div>

    <AnalyticsMetrics :metrics="metrics" :stats-loading="statsLoading" />

    <AnalyticsCharts
      :fmt="fmt"
      :sales-trend-loading="salesTrendLoading"
      :category-sales-loading="categorySalesLoading"
      :total-category-revenue="totalCategoryRevenue"
      :bar-chart-data="barChartData"
      :bar-chart-options="barChartOptions"
      :donut-chart-data="donutChartData"
      :donut-chart-options="donutChartOptions"
      :category-sales="categorySales"
    />
  </div>
</template>

<style scoped>
.analytics-page {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

/* ─── Hero ──────────────────────────────────────── */
.analytics-hero {
  position: relative;
  background: #fff;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  padding: 2rem 2rem 1.75rem;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.04);
}

.bg-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(0, 123, 255, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 123, 255, 0.04) 1px, transparent 1px);
  background-size: 32px 32px;
  pointer-events: none;
  z-index: 0;
}

.bg-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  pointer-events: none;
  z-index: 0;
}

.blob-1 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(0, 123, 255, 0.09) 0%, transparent 70%);
  top: -120px;
  right: -60px;
}

.blob-2 {
  width: 280px;
  height: 280px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.07) 0%, transparent 70%);
  bottom: -80px;
  left: -40px;
}

.blob-3 {
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(16, 185, 129, 0.06) 0%, transparent 70%);
  top: 30%;
  left: 38%;
}

.hero-inner {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.hero-text {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.badge-pill {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: rgba(0, 123, 255, 0.08);
  border: 1px solid rgba(0, 123, 255, 0.18);
  color: #007bff;
  font-size: 0.78rem;
  font-weight: 600;
  padding: 5px 12px;
  border-radius: 100px;
  width: fit-content;
  letter-spacing: 0.01em;
}

.badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #007bff;
  animation: blink 1.8s ease-in-out infinite;
  flex-shrink: 0;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.hero-title {
  font-size: clamp(1.6rem, 3vw, 2.2rem);
  font-weight: 800;
  color: #0f172a;
  line-height: 1.15;
  letter-spacing: -0.02em;
  margin: 0;
}

.title-highlight {
  background: linear-gradient(135deg, #007bff 0%, #6366f1 60%, #06b6d4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 0.9rem;
  color: #64748b;
  margin: 0;
  line-height: 1.5;
}

/* Actions */
.hero-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.date-picker-wrapper {
  width: 340px;
  --dp-font-family: inherit;
  --dp-border-radius: 10px;
  --dp-border-color: #e2e8f0;
  --dp-border-color-hover: #007bff;
  --dp-background-color: white;
  --dp-text-color: #475569;
  --dp-icon-color: #64748b;
  --dp-primary-color: #007bff;
  --dp-primary-disabled-color: #93c5fd;
  --dp-primary-text-color: #fff;
  --dp-secondary-color: #f1f5f9;
}

.date-picker-wrapper :deep(.dp__input) {
  padding: 0.6rem 1rem 0.6rem 2.2rem;
  font-weight: 500;
  font-size: 0.875rem;
  box-shadow: none;
}

.date-picker-wrapper :deep(.dp__input_icon) {
  left: 10px;
  padding: 0;
  height: 16px;
  width: 16px;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.btn-outline {
  background: white;
  border: 1.5px solid #e2e8f0;
  color: #475569;
}

.btn-outline:hover {
  border-color: #007bff;
  color: #007bff;
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.12);
}

.btn-icon-only {
  background: white;
  border: 1.5px solid #e2e8f0;
  color: #64748b;
  padding: 0.6rem;
  border-radius: 10px;
}

.btn-icon-only:hover {
  border-color: #007bff;
  color: #007bff;
}

.icon-sm {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

/* Floating live badge */
.float-live {
  position: absolute;
  bottom: 14px;
  right: 20px;
  z-index: 3;
  display: flex;
  align-items: center;
  gap: 5px;
  background: rgba(16, 185, 129, 0.08);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 100px;
  padding: 4px 10px;
  font-size: 0.72rem;
  font-weight: 600;
  color: #059669;
}

.live-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #10b981;
  animation: blink 1.4s ease-in-out infinite;
}

/* ─── Responsive ────────────────────────────────── */
@media (max-width: 860px) {
  .analytics-hero {
    padding: 1.5rem;
  }

  .hero-inner {
    flex-direction: column;
    align-items: flex-start;
  }

  .hero-actions {
    width: 100%;
  }

  .date-picker-wrapper {
    width: 100%;
    flex: 1;
    min-width: 0;
  }

  .float-live {
    display: none;
  }
}

@media (max-width: 520px) {
  .hero-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .btn-label {
    display: none;
  }

  .btn-outline {
    justify-content: center;
  }

  .btn-icon-only {
    display: none;
  }
}
</style>
