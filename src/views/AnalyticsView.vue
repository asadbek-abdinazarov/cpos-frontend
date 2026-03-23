<script setup>
import '@/plugins/chart.js'
import { Download } from 'lucide-vue-next'
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
  topProductsLoading,
  totalCategoryRevenue,
  fmt,
  barChartData,
  barChartOptions,
  donutChartData,
  donutChartOptions,
  categorySales,
  lineChartData,
  lineChartOptions,
} = useAnalyticsCharts()
</script>

<template>
  <div class="analytics-page">
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
        <button type="button" class="btn btn-outline">
          <Download class="icon-sm" />
          {{ $t('dashboard.analytics.download_report') }}
        </button>
      </div>
    </div>

    <AnalyticsMetrics :metrics="metrics" :stats-loading="statsLoading" />

    <AnalyticsCharts
      :fmt="fmt"
      :sales-trend-loading="salesTrendLoading"
      :category-sales-loading="categorySalesLoading"
      :top-products-loading="topProductsLoading"
      :total-category-revenue="totalCategoryRevenue"
      :bar-chart-data="barChartData"
      :bar-chart-options="barChartOptions"
      :donut-chart-data="donutChartData"
      :donut-chart-options="donutChartOptions"
      :category-sales="categorySales"
      :line-chart-data="lineChartData"
      :line-chart-options="lineChartOptions"
    />
  </div>
</template>

<style scoped>
.analytics-page {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

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

.icon-sm {
  width: 18px;
  height: 18px;
}

.date-picker-wrapper {
  width: 320px;
  --dp-font-family: inherit;
  --dp-border-radius: 8px;
  --dp-border-color: #e2e8f0;
  --dp-border-color-hover: #cbd5e1;
  --dp-background-color: white;
  --dp-text-color: #475569;
  --dp-icon-color: #64748b;
  --dp-primary-color: #3b82f6;
  --dp-primary-disabled-color: #93c5fd;
  --dp-primary-text-color: #fff;
  --dp-secondary-color: #f1f5f9;
}

.date-picker-wrapper :deep(.dp__input) {
  padding: 0.6rem 1rem 0.6rem 2.2rem;
  font-weight: 500;
  font-size: 0.9rem;
  box-shadow: none;
}

.date-picker-wrapper :deep(.dp__input_icon) {
  left: 10px;
  padding: 0;
  height: 16px;
  width: 16px;
}

@media (max-width: 640px) {
  .analytics-page {
    gap: 1.25rem;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .page-title {
    font-size: 1.4rem;
  }

  .actions {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }

  .date-picker-wrapper {
    width: 100%;
    max-width: 100%;
  }

  .btn-outline {
    width: 100%;
    justify-content: center;
  }
}
</style>
