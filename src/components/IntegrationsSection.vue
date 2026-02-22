<template>
  <section class="integrations-section">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">{{ t('integrations.title') }}</h2>
        <p class="section-subtitle">{{ t('integrations.subtitle') }}</p>
      </div>

      <div class="integrations-grid">
        <div class="integration-item" v-for="item in integrations" :key="item.name">
          <div class="logo-box">
             <!-- Placeholder for logos. In a real project, use <img> tags -->
            <span class="logo-text">{{ item.name }}</span>
          </div>
          <p class="integration-category">{{ item.category }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const integrations = computed(() => [
  { name: 'Payme', category: t('integrations.categories.payments') },
  { name: 'Click', category: t('integrations.categories.payments') },
  { name: 'Uzum', category: t('integrations.categories.payments') },
  { name: 'Soliq', category: t('integrations.categories.state') },
  { name: 'E-imzo', category: t('integrations.categories.state') },
  { name: '1C', category: t('integrations.categories.accounting') },
  { name: 'Didox', category: t('integrations.categories.accounting') },
  { name: 'Uzum Tezkor', category: t('integrations.categories.delivery') }
])
</script>

<style scoped>
.integrations-section {
  padding: 6rem 0;
  background-color: #F8FAFC;
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #0F172A;
  margin-bottom: 1rem;
}

.section-subtitle {
  font-size: 1.1rem;
  color: #64748B;
  max-width: 600px;
  margin: 0 auto;
}

.integrations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 2rem;
  max-width: 1000px;
  margin: 0 auto;
}

.integration-item {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 160px;
}

.integration-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.logo-box {
  margin-bottom: 1rem;
  font-weight: 700;
  font-size: 1.5rem;
  color: #334155;
}

.integration-category {
  font-size: 0.875rem;
  color: #94A3B8;
  font-weight: 500;
}
</style>
