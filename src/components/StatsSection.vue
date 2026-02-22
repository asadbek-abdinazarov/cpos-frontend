<template>
  <section class="stats-section">
    <div class="container">
      <div class="stats-grid">
        <div class="stat-item" v-for="(stat, index) in stats" :key="index">
          <h3 class="stat-number">{{ stat.number }}</h3>
          <p class="stat-label">{{ stat.label }}</p>
        </div>
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
  padding: 4rem 0;
  background-color: #0F172A;
  color: white;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.stats-grid {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 2rem;
  text-align: center;
}

.stat-number {
  font-size: 3.5rem;
  font-weight: 700;
  color: #007BFF;
  margin-bottom: 0.5rem;
  font-family: 'Poppins', sans-serif;
}

.stat-label {
  font-size: 1.2rem;
  color: #CBD5E1;
  font-weight: 500;
}

@media (max-width: 768px) {
  .stat-number {
    font-size: 2.5rem;
  }
}
</style>
