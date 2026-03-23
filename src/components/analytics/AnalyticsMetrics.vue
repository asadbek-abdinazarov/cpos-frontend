<script setup>
defineProps({
  metrics: {
    type: Array,
    required: true,
  },
  statsLoading: {
    type: Boolean,
    required: true,
  },
})
</script>

<template>
  <div class="stats-grid">
    <div v-for="(stat, index) in metrics" :key="index" class="stat-card">
      <div class="stat-header">
        <span class="stat-title">{{ $t(stat.title) }}</span>
        <div class="stat-icon-wrapper" :class="stat.bg">
          <component :is="stat.icon" class="stat-icon" :class="stat.iconColor" />
        </div>
      </div>
      <div class="stat-content">
        <template v-if="statsLoading">
          <div class="skel skel-val"></div>
          <div class="skel skel-chg" style="margin-top: 0.5rem"></div>
        </template>
        <div v-else class="stat-value">{{ stat.value ?? '—' }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
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

.bg-blue-100 {
  background-color: #dbeafe;
}
.text-blue-600 {
  color: #2563eb;
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
.bg-emerald-100 {
  background-color: #d1fae5;
}
.text-emerald-600 {
  color: #059669;
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

@media (max-width: 640px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
