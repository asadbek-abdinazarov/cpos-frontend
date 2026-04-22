<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Package, BarChart3, Heart, Zap } from 'lucide-vue-next'

const { t } = useI18n()

const features = computed(() => [
  {
    title: t('features.list.inventory.title'),
    description: t('features.list.inventory.desc'),
    icon: 'Package',
    color: '#007BFF',
    bg: 'rgba(0, 123, 255, 0.08)',
    num: '01'
  },
  {
    title: t('features.list.analytics.title'),
    description: t('features.list.analytics.desc'),
    icon: 'BarChart3',
    color: '#6366F1',
    bg: 'rgba(99, 102, 241, 0.08)',
    num: '02'
  },
  {
    title: t('features.list.crm.title'),
    description: t('features.list.crm.desc'),
    icon: 'Heart',
    color: '#EC4899',
    bg: 'rgba(236, 72, 153, 0.08)',
    num: '03'
  },
  {
    title: t('features.list.offline.title'),
    description: t('features.list.offline.desc'),
    icon: 'Zap',
    color: '#10B981',
    bg: 'rgba(16, 185, 129, 0.08)',
    num: '04'
  }
])

const iconMap = { Package, BarChart3, Heart, Zap }
</script>

<template>
  <section id="features-grid" class="features-section">
    <div class="section-container">
      <div class="section-head" data-aos="fade-up">
        <span class="section-tag">Imkoniyatlar</span>
        <h2 class="section-title">
          {{ t('features.title') }}
          <span class="title-gradient">{{ t('features.title_highlight') }}</span>
        </h2>
        <p class="section-sub">{{ t('features.subtitle') }}</p>
      </div>

      <div class="features-grid">
        <div
          v-for="(feature, i) in features"
          :key="i"
          class="feature-card"
          data-aos="fade-up"
          :data-aos-delay="i * 80"
        >
          <div class="card-num">{{ feature.num }}</div>
          <div class="feature-icon-wrap" :style="{ background: feature.bg, color: feature.color }">
            <component :is="iconMap[feature.icon]" :size="22" :stroke-width="2" />
          </div>
          <h3 class="feature-title">{{ feature.title }}</h3>
          <p class="feature-desc">{{ feature.description }}</p>
          <div class="card-arrow" :style="{ color: feature.color }">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.features-section {
  padding: 7rem 0;
  background: #F8FAFC;
  position: relative;
}

.section-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Section header */
.section-head {
  text-align: center;
  margin-bottom: 4rem;
}

.section-tag {
  display: inline-block;
  background: rgba(0, 123, 255, 0.08);
  border: 1px solid rgba(0, 123, 255, 0.15);
  color: #007BFF;
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

.title-gradient {
  background: linear-gradient(135deg, #007BFF, #6366F1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.section-sub {
  font-size: 1.1rem;
  color: #64748B;
  max-width: 560px;
  margin: 0 auto;
  line-height: 1.7;
}

/* Grid */
.features-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.feature-card {
  background: #fff;
  border: 1px solid #E2E8F0;
  border-radius: 20px;
  padding: 2rem 1.75rem;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: all 0.3s ease;
  overflow: hidden;
}

.feature-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 20px;
  opacity: 0;
  background: linear-gradient(135deg, rgba(0, 123, 255, 0.03), transparent);
  transition: opacity 0.3s;
}

.feature-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
  border-color: rgba(0, 123, 255, 0.15);
}

.feature-card:hover::before {
  opacity: 1;
}

.card-num {
  font-size: 0.72rem;
  font-weight: 700;
  color: #CBD5E1;
  letter-spacing: 0.05em;
  position: absolute;
  top: 1.5rem;
  right: 1.75rem;
}

.feature-icon-wrap {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.feature-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #0F172A;
  margin: 0;
  line-height: 1.3;
}

.feature-desc {
  font-size: 0.9rem;
  color: #64748B;
  line-height: 1.65;
  flex: 1;
}

.card-arrow {
  display: flex;
  align-items: center;
  opacity: 0;
  transform: translateX(-4px);
  transition: all 0.25s ease;
}

.feature-card:hover .card-arrow {
  opacity: 1;
  transform: translateX(0);
}

@media (max-width: 1024px) {
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 540px) {
  .features-section { padding: 5rem 0; }
  .features-grid { grid-template-columns: 1fr; }
}
</style>
