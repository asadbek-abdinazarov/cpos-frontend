<script setup>
import { Bar, Doughnut } from 'vue-chartjs'
import { MoreVertical } from 'lucide-vue-next'

defineProps({
  fmt: {
    type: Function,
    required: true,
  },
  salesTrendLoading: Boolean,
  categorySalesLoading: Boolean,
  totalCategoryRevenue: [Number, String],
  barChartData: Object,
  barChartOptions: Object,
  donutChartData: Object,
  donutChartOptions: Object,
  categorySales: Array,
})
</script>


<template>
  <div class="dashboard-content">
    <div class="card revenue-chart">
      <div class="card-header">
        <h3>{{ $t('dashboard.analytics.sales_trend') }}</h3>
        <button type="button" class="btn-icon" aria-label="More">
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

</template>

<style scoped>
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

.chart-container {
  padding: 1.5rem;
  height: 300px;
  display: flex;
  align-items: flex-end;
}

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
  pointer-events: none;
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

.icon-sm {
  width: 18px;
  height: 18px;
}

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

/*
  Chart.js canvas default touch-action ba’zi brauzerlarda vertikal sahifa skrolini ushlab qoladi.
  pan-y: asosan sahifa bilan birga vertikal surilishni davom ettiradi.
*/
.chart-container :deep(canvas),
.donut-chart-placeholder :deep(canvas) {
  touch-action: pan-y;
}

@media (max-width: 1024px) {
  .dashboard-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .chart-container {
    padding: 1rem !important;
  }

  .chart-body {
    padding: 1rem;
  }
}
</style>
