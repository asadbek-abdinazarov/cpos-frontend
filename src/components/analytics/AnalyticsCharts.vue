<script setup>
import { Bar, Doughnut } from 'vue-chartjs'
import { MoreVertical, TrendingUp, TrendingDown, Minus, CreditCard, Banknote, Smartphone, Clock, Package } from 'lucide-vue-next'

defineProps({
  fmt: { type: Function, required: true },
  // mavjud
  salesTrendLoading: Boolean,
  categorySalesLoading: Boolean,
  totalCategoryRevenue: [Number, String],
  barChartData: Object,
  barChartOptions: Object,
  donutChartData: Object,
  donutChartOptions: Object,
  categorySales: Array,
  // YANGI
  hourlyLoading: Boolean,
  paymentLoading: Boolean,
  topProductsLoading: Boolean,
  peakHour: { type: Number, default: null },
  hourlyChartData: Object,
  hourlyChartOptions: Object,
  paymentMethods: { type: Array, default: () => [] },
  topProducts: { type: Array, default: () => [] },
})
</script>

<template>
  <!-- ─── Row 1: Sales trend + Category ──────────── -->
  <div class="charts-row">
    <div class="card revenue-chart">
      <div class="card-header">
        <h3>{{ $t('dashboard.analytics.sales_trend') }}</h3>
        <button type="button" class="btn-icon" aria-label="More">
          <MoreVertical class="icon-sm" />
        </button>
      </div>
      <div class="chart-container">
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
          <div class="skel" style="width: 180px; height: 180px; border-radius: 50%; margin: 0 auto 1.5rem auto"></div>
          <div class="skel" style="width: 100%; height: 40px; border-radius: 8px"></div>
        </template>
        <template v-else>
          <div class="donut-chart-placeholder">
            <div class="donut-ring">
              <span class="donut-text">
                {{ $t('dashboard.analytics.total') }}<br />
                <strong>{{ fmt(totalCategoryRevenue) || 0 }}<br />UZS</strong>
              </span>
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

  <!-- ─── Row 2: Hourly + Payment Methods ────────── -->
  <div class="charts-row">
    <!-- Peak hours -->
    <div class="card hourly-card">
      <div class="card-header">
        <div class="header-with-icon">
          <div class="header-icon blue">
            <Clock :size="15" />
          </div>
          <h3>Eng faol soatlar</h3>
        </div>
        <span v-if="peakHour !== null" class="peak-badge">
          Cho'qqi: {{ String(peakHour).padStart(2, '0') }}:00
        </span>
      </div>
      <div class="chart-container" style="height: 200px">
        <template v-if="hourlyLoading">
          <div class="skel" style="width: 100%; height: 100%; border-radius: 8px"></div>
        </template>
        <Bar v-else :data="hourlyChartData" :options="hourlyChartOptions" />
      </div>
    </div>

    <!-- Payment methods -->
    <div class="card payments-card">
      <div class="card-header">
        <div class="header-with-icon">
          <div class="header-icon indigo">
            <CreditCard :size="15" />
          </div>
          <h3>To'lov usullari</h3>
        </div>
      </div>
      <div class="payments-body">
        <!-- Loading skeleton -->
        <template v-if="paymentLoading">
          <div v-for="n in 3" :key="n" class="payment-item">
            <div class="payment-top">
              <div class="skel" style="width:120px;height:14px;border-radius:6px"></div>
              <div class="skel" style="width:40px;height:14px;border-radius:6px"></div>
            </div>
            <div class="skel" style="width:100%;height:7px;border-radius:100px;margin:4px 0"></div>
            <div class="skel" style="width:80px;height:11px;border-radius:5px"></div>
          </div>
        </template>

        <!-- Data -->
        <template v-else>
          <div v-for="method in paymentMethods" :key="method.name" class="payment-item">
            <div class="payment-top">
              <div class="payment-label">
                <div class="payment-icon-wrap" :style="{ background: method.color + '18' }">
                  <component :is="method.icon" :size="14" :color="method.color" />
                </div>
                <span class="payment-name">{{ method.name }}</span>
              </div>
              <div class="payment-right">
                <span class="payment-pct" :style="{ color: method.color }">{{ method.percentage }}%</span>
              </div>
            </div>
            <div class="progress-track">
              <div
                class="progress-fill"
                :style="{ width: method.percentage + '%', background: method.color }"
              ></div>
            </div>
            <span class="payment-amount">{{ fmt(method.amount) }} UZS</span>
          </div>
        </template>
      </div>
    </div>
  </div>

  <!-- ─── Row 3: Top Products ─────────────────────── -->
  <div class="card top-products-card">
    <div class="card-header">
      <div class="header-with-icon">
        <div class="header-icon green">
          <Package :size="15" />
        </div>
        <h3>Top 5 mahsulotlar</h3>
      </div>
    </div>
    <div class="products-table">
      <div class="table-head">
        <span>#</span>
        <span>Mahsulot</span>
        <span class="col-center">Sotuvlar</span>
        <span class="col-right">Daromad</span>
        <span class="col-center">Trend</span>
      </div>
      <template v-if="topProductsLoading">
        <div v-for="n in 5" :key="n" class="table-row">
          <div class="skel" style="width:20px;height:14px;border-radius:4px"></div>
          <div class="product-info">
            <div class="skel" style="width:34px;height:34px;border-radius:9px"></div>
            <div style="display:flex;flex-direction:column;gap:4px">
              <div class="skel" style="width:100px;height:13px;border-radius:4px"></div>
              <div class="skel" style="width:60px;height:10px;border-radius:4px"></div>
            </div>
          </div>
          <div class="skel col-center" style="width:50px;height:13px;border-radius:4px;margin:0 auto"></div>
          <div class="skel col-right" style="width:90px;height:13px;border-radius:4px;margin-left:auto"></div>
          <div class="skel col-center" style="width:26px;height:26px;border-radius:7px;margin:0 auto"></div>
        </div>
      </template>
      <template v-else>
        <div v-for="p in topProducts" :key="p.rank" class="table-row">
          <span class="rank-num">{{ p.rank }}</span>
          <div class="product-info">
            <div class="product-avatar">{{ p.name[0] }}</div>
            <div>
              <div class="product-name">{{ p.name }}</div>
              <div class="product-cat">{{ p.category }}</div>
            </div>
          </div>
          <span class="col-center sales-count">{{ p.sales }} ta</span>
          <span class="col-right revenue-val">{{ fmt(p.revenue) }} UZS</span>
          <span class="col-center">
            <span class="trend-badge" :class="p.trend">
              <TrendingUp v-if="p.trend === 'up'" :size="12" />
              <TrendingDown v-else-if="p.trend === 'down'" :size="12" />
              <Minus v-else :size="12" />
            </span>
          </span>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
/* ─── Row layout ─────────────────────────────────── */
.charts-row {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.25rem;
}

/* ─── Base card ──────────────────────────────────── */
.card {
  background: white;
  border-radius: 16px;
  border: 1px solid #f1f5f9;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.card-header {
  padding: 1.1rem 1.4rem;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
}

.card-header h3 {
  font-size: 0.95rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.header-with-icon {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.header-icon {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-icon.blue { background: rgba(0, 123, 255, 0.1); color: #007bff; }
.header-icon.indigo { background: rgba(99, 102, 241, 0.1); color: #6366f1; }
.header-icon.green { background: rgba(16, 185, 129, 0.1); color: #10b981; }

.btn-icon {
  background: transparent;
  border: none;
  cursor: pointer;
  color: #94a3b8;
  padding: 4px;
  border-radius: 6px;
  transition: all 0.15s;
}

.btn-icon:hover {
  background: #f1f5f9;
  color: #0f172a;
}

.icon-sm { width: 18px; height: 18px; }

/* ─── Charts ─────────────────────────────────────── */
.chart-container {
  padding: 1.25rem 1.4rem;
  height: 260px;
  display: flex;
  align-items: flex-end;
}

.chart-body {
  padding: 1.4rem;
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
  margin-bottom: 1.25rem;
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
  font-size: 0.78rem;
  color: #64748b;
  line-height: 1.4;
}

.donut-text strong {
  display: block;
  font-size: 1.1rem;
  font-weight: 800;
  color: #0f172a;
  margin-top: 4px;
}

.legend {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.82rem;
  color: #475569;
}

.indicator {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  flex-shrink: 0;
}

.legend-value {
  margin-left: auto;
  font-weight: 700;
  color: #0f172a;
}

/* ─── Hourly chart ───────────────────────────────── */
.peak-badge {
  font-size: 0.72rem;
  font-weight: 600;
  color: #007bff;
  background: rgba(0, 123, 255, 0.08);
  border: 1px solid rgba(0, 123, 255, 0.18);
  padding: 3px 10px;
  border-radius: 100px;
}

/* ─── Payment methods ────────────────────────────── */
.payments-body {
  padding: 1.2rem 1.4rem;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.payment-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.payment-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.payment-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.payment-icon-wrap {
  width: 26px;
  height: 26px;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.payment-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: #1e293b;
}

.payment-pct {
  font-size: 0.88rem;
  font-weight: 700;
}

.progress-track {
  height: 7px;
  background: #f1f5f9;
  border-radius: 100px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 100px;
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.payment-amount {
  font-size: 0.75rem;
  color: #94a3b8;
  font-weight: 500;
}

/* ─── Top Products ───────────────────────────────── */
.top-products-card {
  width: 100%;
}

.period-label {
  font-size: 0.75rem;
  color: #94a3b8;
  font-weight: 500;
}

.products-table {
  display: flex;
  flex-direction: column;
}

.table-head {
  display: grid;
  grid-template-columns: 36px 1fr 100px 160px 70px;
  padding: 0.6rem 1.4rem;
  background: #f8fafc;
  border-bottom: 1px solid #f1f5f9;
  font-size: 0.72rem;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.table-row {
  display: grid;
  grid-template-columns: 36px 1fr 100px 160px 70px;
  padding: 0.85rem 1.4rem;
  border-bottom: 1px solid #f8fafc;
  align-items: center;
  transition: background 0.15s;
}

.table-row:last-child {
  border-bottom: none;
}

.table-row:hover {
  background: #f8fafc;
}

.rank-num {
  font-size: 0.82rem;
  font-weight: 700;
  color: #94a3b8;
}

.product-info {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.product-avatar {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  background: linear-gradient(135deg, #e0effe, #c7d7fd);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 700;
  color: #3b82f6;
  flex-shrink: 0;
}

.product-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
}

.product-cat {
  font-size: 0.72rem;
  color: #94a3b8;
  margin-top: 1px;
}

.col-center { text-align: center; }
.col-right { text-align: right; }

.sales-count {
  font-size: 0.875rem;
  font-weight: 600;
  color: #475569;
}

.revenue-val {
  font-size: 0.82rem;
  font-weight: 600;
  color: #1e293b;
}

.trend-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 7px;
}

.trend-badge.up { background: rgba(16, 185, 129, 0.1); color: #10b981; }
.trend-badge.down { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
.trend-badge.neutral { background: rgba(148, 163, 184, 0.1); color: #94a3b8; }

/* ─── Skeleton ───────────────────────────────────── */
@keyframes shimmer {
  0% { background-position: -300px 0; }
  100% { background-position: 300px 0; }
}

.skel {
  border-radius: 6px;
  background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
  background-size: 300px 100%;
  animation: shimmer 1.4s infinite linear;
}

/* Touch-action */
.chart-container :deep(canvas),
.donut-chart-placeholder :deep(canvas) {
  touch-action: pan-y;
}

/* ─── Responsive ─────────────────────────────────── */
@media (max-width: 1024px) {
  .charts-row {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .table-head,
  .table-row {
    grid-template-columns: 30px 1fr 80px 120px 50px;
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

@media (max-width: 560px) {
  .table-head { display: none; }

  .table-row {
    grid-template-columns: 26px 1fr auto;
    gap: 0.5rem;
  }

  .sales-count,
  .col-center:last-child {
    display: none;
  }

  .revenue-val {
    font-size: 0.78rem;
  }

  .chart-container {
    padding: 1rem;
  }
}
</style>
