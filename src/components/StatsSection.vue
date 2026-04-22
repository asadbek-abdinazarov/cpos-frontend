<template>
  <section class="stats-section">
    <div class="stats-container">
      <div class="stat-item" v-for="(stat, index) in stats" :key="index">
        <div class="stat-icon-wrap">
          <!-- Businesses icon -->
          <svg v-if="index === 0" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          <!-- Transactions icon -->
          <svg v-if="index === 1" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          <!-- Uptime icon -->
          <svg v-if="index === 2" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
        </div>
        <div class="stat-number">{{ stat.number }}</div>
        <div class="stat-label">{{ stat.label }}</div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const stats = computed(() => [
  { number: '1,000+', label: t('stats.active_businesses') },
  { number: '5M+', label: t('stats.transactions') },
  { number: '99.9%', label: t('stats.uptime') }
])
</script>

<style scoped>
.stats-section {
  background: #0F172A;
  padding: 0;
  position: relative;
  overflow: hidden;
}

.stats-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(0, 123, 255, 0.5), rgba(99, 102, 241, 0.5), transparent);
}

.stats-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

.stat-item {
  padding: 3.5rem 2rem;
  text-align: center;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  transition: background 0.3s ease;
}

.stat-item:not(:last-child)::after {
  content: '';
  position: absolute;
  right: 0;
  top: 25%;
  height: 50%;
  width: 1px;
  background: rgba(255, 255, 255, 0.08);
}

.stat-item:hover {
  background: rgba(255, 255, 255, 0.02);
}

.stat-icon-wrap {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(0, 123, 255, 0.12);
  border: 1px solid rgba(0, 123, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #60A5FA;
  margin-bottom: 0.25rem;
}

.stat-number {
  font-size: clamp(2.5rem, 4vw, 3.5rem);
  font-weight: 800;
  background: linear-gradient(135deg, #60A5FA 0%, #818CF8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  letter-spacing: -0.03em;
}

.stat-label {
  font-size: 1rem;
  color: #94A3B8;
  font-weight: 500;
  letter-spacing: 0.01em;
}

@media (max-width: 640px) {
  .stats-container {
    grid-template-columns: 1fr;
  }

  .stat-item:not(:last-child)::after {
    top: auto;
    bottom: 0;
    right: 25%;
    width: 50%;
    height: 1px;
  }

  .stat-item {
    padding: 2.5rem 1.5rem;
  }
}
</style>
