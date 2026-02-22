<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { Package, BarChart3, Heart, Zap } from 'lucide-vue-next'

const { t } = useI18n()

const features = computed(() => [
  {
    title: t('features.list.inventory.title'),
    description: t('features.list.inventory.desc'),
    icon: 'Package'
  },
  {
    title: t('features.list.analytics.title'),
    description: t('features.list.analytics.desc'),
    icon: 'BarChart3'
  },
  {
    title: t('features.list.crm.title'),
    description: t('features.list.crm.desc'),
    icon: 'Heart'
  },
  {
    title: t('features.list.offline.title'),
    description: t('features.list.offline.desc'),
    icon: 'Zap'
  }
])
</script>

<template>
  <section id="features-grid" class="features">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">{{ t('features.title') }} <span class="highlight">{{ t('features.title_highlight') }}</span></h2>
        <p class="section-subtitle">{{ t('features.subtitle') }}</p>
      </div>
      
      <div class="features-grid">
        <div v-for="(feature, index) in features" :key="index" class="feature-card">
          <div class="feature-icon">
             <component :is="feature.icon === 'Package' ? Package : feature.icon === 'BarChart3' ? BarChart3 : feature.icon === 'Heart' ? Heart : Zap" class="icon-lg" />
          </div>
          <h3 class="feature-title">{{ feature.title }}</h3>
          <p class="feature-desc">{{ feature.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.features {
  padding: 6rem 0;
  background-color: var(--color-surface);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.section-title {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.highlight {
  color: var(--color-primary);
}

.section-subtitle {
  color: var(--color-text-light);
  font-size: 1.1rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: var(--color-white);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-md);
  border-color: rgba(0, 123, 255, 0.1);
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  background-color: rgba(0, 123, 255, 0.05);
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}

.feature-title {
  font-size: 1.25rem;
  margin-bottom: 0.75rem;
  color: var(--color-text-main);
}

.feature-desc {
  color: var(--color-text-light);
  line-height: 1.6;
}

@media (max-width: 768px) {
  .section-title {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .features {
    padding: 4rem 0;
  }
  
  .section-title {
    font-size: 1.75rem;
  }
}
</style>
