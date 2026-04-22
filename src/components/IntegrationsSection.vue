<template>
  <section class="integrations-section">
    <div class="section-container">
      <div class="section-head" data-aos="fade-up">
        <span class="section-tag">Integratsiyalar</span>
        <h2 class="section-title">{{ t('integrations.title') }}</h2>
        <p class="section-sub">{{ t('integrations.subtitle') }}</p>
      </div>

      <div class="integrations-grid" data-aos="fade-up" data-aos-delay="100">
        <div
          class="integration-card"
          v-for="item in integrations"
          :key="item.name"
        >
          <div class="integration-logo">
            <span class="logo-text">{{ item.name }}</span>
          </div>
          <span class="integration-cat" :class="catClass(item.category)">{{ item.category }}</span>
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
  { name: 'Payme',       category: t('integrations.categories.payments') },
  { name: 'Click',       category: t('integrations.categories.payments') },
  { name: 'Uzum',        category: t('integrations.categories.payments') },
  { name: 'Soliq',       category: t('integrations.categories.state') },
  { name: 'E-imzo',      category: t('integrations.categories.state') },
  { name: '1C',          category: t('integrations.categories.accounting') },
  { name: 'Didox',       category: t('integrations.categories.accounting') },
  { name: 'Uzum Tezkor', category: t('integrations.categories.delivery') }
])

const catClass = (cat) => {
  if (cat === t('integrations.categories.payments'))   return 'cat-payments'
  if (cat === t('integrations.categories.state'))      return 'cat-state'
  if (cat === t('integrations.categories.accounting')) return 'cat-accounting'
  if (cat === t('integrations.categories.delivery'))   return 'cat-delivery'
  return ''
}
</script>

<style scoped>
.integrations-section {
  padding: 7rem 0;
  background: #fff;
}

.section-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.section-head {
  text-align: center;
  margin-bottom: 4rem;
}

.section-tag {
  display: inline-block;
  background: rgba(99, 102, 241, 0.08);
  border: 1px solid rgba(99, 102, 241, 0.15);
  color: #6366F1;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 5px 14px;
  border-radius: 100px;
  margin-bottom: 1.25rem;
}

.section-title {
  font-size: clamp(2rem, 3.5vw, 2.75rem);
  font-weight: 800;
  color: #0F172A;
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
}

.section-sub {
  font-size: 1.1rem;
  color: #64748B;
  max-width: 560px;
  margin: 0 auto;
  line-height: 1.7;
}

.integrations-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
  max-width: 960px;
  margin: 0 auto;
}

.integration-card {
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 16px;
  padding: 1.75rem 1.25rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.25s ease;
}

.integration-card:hover {
  background: #fff;
  border-color: #CBD5E1;
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.07);
}

.integration-logo {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background: #fff;
  border: 1px solid #E2E8F0;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.logo-text {
  font-size: 0.75rem;
  font-weight: 800;
  color: #1E293B;
  letter-spacing: -0.01em;
}

.integration-cat {
  font-size: 0.72rem;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 100px;
}

.cat-payments   { background: rgba(0,  123, 255, 0.08); color: #007BFF; }
.cat-state      { background: rgba(16, 185, 129, 0.08); color: #10B981; }
.cat-accounting { background: rgba(99, 102, 241, 0.08); color: #6366F1; }
.cat-delivery   { background: rgba(245,158, 11, 0.08);  color: #D97706; }

@media (max-width: 768px) {
  .integrations-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 400px) {
  .integrations-section { padding: 5rem 0; }
  .integrations-grid { grid-template-columns: repeat(2, 1fr); gap: 0.75rem; }
}
</style>
