<script setup>
import { ref } from 'vue'
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Activity, 
  TrendingUp, 
  TrendingDown,
  ChevronRight
} from 'lucide-vue-next'

const stats = ref([
  { 
    title: 'Total Revenue', 
    value: '$45,231.89', 
    change: '+20.1%', 
    trend: 'up',
    icon: DollarSign,
    iconColor: 'text-blue-600',
    bg: 'bg-blue-100'
  },
  { 
    title: 'Active Orders', 
    value: '1,234', 
    change: '+15.2%', 
    trend: 'up',
    icon: ShoppingBag,
    iconColor: 'text-orange-600',
    bg: 'bg-orange-100'
  },
  { 
    title: 'Total Customers', 
    value: '3,456', 
    change: '+5.4%', 
    trend: 'up',
    icon: Users,
    iconColor: 'text-purple-600',
    bg: 'bg-purple-100'
  },
  { 
    title: 'Avg. Order Value', 
    value: '$36.80', 
    change: '-2.1%', 
    trend: 'down',
    icon: Activity,
    iconColor: 'text-emerald-600',
    bg: 'bg-emerald-100'
  },
])

const recentTransactions = ref([
  { id: '#ORD-001', customer: 'Alex Thompson', amount: '$120.50', status: 'Completed', date: '2 mins ago' },
  { id: '#ORD-002', customer: 'Sarah Parker', amount: '$75.20', status: 'Processing', date: '5 mins ago' },
  { id: '#ORD-003', customer: 'Michael Chen', amount: '$350.00', status: 'Completed', date: '10 mins ago' },
  { id: '#ORD-004', customer: 'Jessica Evans', amount: '$42.90', status: 'Failed', date: '15 mins ago' },
  { id: '#ORD-005', customer: 'David Wilson', amount: '$210.30', status: 'Completed', date: '25 mins ago' },
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
        <div class="stat-value">{{ stat.value }}</div>
        <div class="stat-change" :class="stat.trend">
          <component :is="stat.trend === 'up' ? TrendingUp : TrendingDown" class="trend-icon" />
          {{ stat.change }} <span class="trend-text">from last month</span>
        </div>
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
                <stop offset="0%" stop-color="#2563EB" stop-opacity="0.2"/>
                <stop offset="100%" stop-color="#2563EB" stop-opacity="0"/>
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
  color: #0F172A;
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
  background-color: #2563EB;
  color: white;
  box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);
}

.btn-primary:hover {
  background-color: #1D4ED8;
  box-shadow: 0 4px 12px -1px rgba(37, 99, 235, 0.3);
}

.btn-secondary {
  background-color: white;
  border: 1px solid #E2E8F0;
  color: #475569;
}

.btn-secondary:hover {
  background-color: #F8FAFC;
  border-color: #CBD5E1;
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
  border: 1px solid #F1F5F9;
  transition: transform 0.2s, box-shadow 0.2s;
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

/* Background/Text Utility Classes (scoped) */
.bg-blue-100 { background-color: #DBEAFE; }
.text-blue-600 { color: #2563EB; }
.bg-orange-100 { background-color: #FFEDD5; }
.text-orange-600 { color: #EA580C; }
.bg-purple-100 { background-color: #F3E8FF; }
.text-purple-600 { color: #9333EA; }
.bg-emerald-100 { background-color: #D1FAE5; }
.text-emerald-600 { color: #059669; }

.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: #0F172A;
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

.stat-change.up { color: #10B981; }
.stat-change.down { color: #EF4444; }

.trend-text {
  color: #94A3B8;
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
  border: 1px solid #F1F5F9;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.card-header {
  padding: 1.5rem;
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

.view-all {
  color: #2563EB;
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

.data-table tr:hover td {
  background-color: #F8FAFC;
}

.data-table tr:last-child td {
  border-bottom: none;
}

.customer-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 500;
  color: #0F172A;
}

.customer-avatar {
  width: 32px;
  height: 32px;
  background-color: #EFF6FF;
  color: #2563EB;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.8rem;
}

.font-medium {
  font-weight: 600;
  color: #0F172A;
}

.text-gray {
  color: #64748B;
}

.status-badge {
  padding: 0.25rem 0.6rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
}

.status-badge.completed { background-color: #DCFCE7; color: #16A34A; }
.status-badge.processing { background-color: #DBEAFE; color: #2563EB; }
.status-badge.failed { background-color: #FEE2E2; color: #DC2626; }

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
  border: 1px solid #E2E8F0;
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
  
  .data-table th, .data-table td {
    padding: 0.75rem 1rem;
  }
}
</style>
