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
      <div class="stat-top">
        <div class="stat-icon-wrapper" :class="stat.bg">
          <component :is="stat.icon" class="stat-icon" :class="stat.iconColor" />
        </div>
        <span class="stat-title">{{ $t(stat.title) }}</span>
      </div>
      <div class="stat-content">
        <template v-if="statsLoading">
          <div class="skel skel-val"></div>
          <div class="skel skel-chg"></div>
        </template>
        <template v-else>
          <div class="stat-value">{{ stat.value ?? '—' }}</div>
        </template>
      </div>
      <div class="stat-glow" :class="stat.bg"></div>
    </div>
  </div>
</template>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.25rem;
}

.stat-card {
  background: white;
  padding: 1.4rem 1.5rem;
  border-radius: 16px;
  border: 1px solid #f1f5f9;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
}

.stat-top {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.stat-icon-wrapper {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon {
  width: 20px;
  height: 20px;
}

.stat-title {
  color: #64748b;
  font-size: 0.82rem;
  font-weight: 600;
  line-height: 1.3;
}

.stat-value {
  font-size: 1.65rem;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.02em;
  line-height: 1;
}

/* Background glow decoration */
.stat-glow {
  position: absolute;
  right: -20px;
  bottom: -20px;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  opacity: 0.35;
  filter: blur(24px);
  pointer-events: none;
}

/* Color variants */
.bg-blue-100 { background-color: #dbeafe; }
.text-blue-600 { color: #2563eb; }
.bg-red-100 { background-color: #fee2e2; }
.text-red-600 { color: #dc2626; }
.bg-indigo-100 { background-color: #e0e7ff; }
.text-indigo-600 { color: #4f46e5; }
.bg-emerald-100 { background-color: #d1fae5; }
.text-emerald-600 { color: #059669; }

/* Skeleton */
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

.skel-val {
  height: 36px;
  width: 65%;
  border-radius: 8px;
}

.skel-chg {
  height: 14px;
  width: 45%;
  border-radius: 4px;
  margin-top: 0.4rem;
}

@media (max-width: 640px) {
  .stats-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 400px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
