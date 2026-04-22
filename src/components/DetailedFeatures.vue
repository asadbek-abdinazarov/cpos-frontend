<script setup>
import { useI18n } from 'vue-i18n'
import analyticsImg from '@/assets/images/real-time-business-analize.png'
import inventoryImg from '@/assets/images/smart-warehouse.png'
import paymentsImg  from '@/assets/images/payment-integration.png'
import { Check } from 'lucide-vue-next'

const { t } = useI18n()

const rows = [
  {
    key: 'analytics',
    img: analyticsImg,
    alt: 'Real-time Analytics',
    iconBg: 'rgba(0,123,255,0.1)',
    iconColor: '#007BFF',
    checkColor: '#007BFF',
    reverse: false,
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`
  },
  {
    key: 'inventory',
    img: inventoryImg,
    alt: 'Smart Inventory',
    iconBg: 'rgba(16,185,129,0.1)',
    iconColor: '#10B981',
    checkColor: '#10B981',
    reverse: true,
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`
  },
  {
    key: 'payments',
    img: paymentsImg,
    alt: 'Payment Integration',
    iconBg: 'rgba(99,102,241,0.1)',
    iconColor: '#6366F1',
    checkColor: '#6366F1',
    reverse: false,
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>`
  }
]
</script>

<template>
  <section class="detailed-features" id="features">
    <div class="section-container">
      <div class="section-head" data-aos="fade-up">
        <span class="section-tag">Batafsil</span>
        <h2 class="section-title">{{ t('detailed_features.title') }}</h2>
        <p class="section-sub">{{ t('detailed_features.subtitle') }}</p>
      </div>

      <div class="rows-wrapper">
        <div
          v-for="(row, i) in rows"
          :key="row.key"
          :class="['feature-row', { reverse: row.reverse }]"
          data-aos="fade-up"
          :data-aos-delay="i * 60"
        >
          <!-- Image side -->
          <div class="img-side">
            <div class="img-frame">
              <img :src="row.img" :alt="row.alt" class="feature-img" loading="lazy" />
            </div>
          </div>

          <!-- Content side -->
          <div class="content-side">
            <div class="feature-icon" :style="{ background: row.iconBg, color: row.iconColor }" v-html="row.icon"></div>
            <h3 class="feature-title">{{ t(`detailed_features.${row.key}.title`) }}</h3>
            <p class="feature-desc">{{ t(`detailed_features.${row.key}.desc`) }}</p>
            <ul class="feature-list">
              <li v-for="n in 3" :key="n">
                <span class="check-icon" :style="{ background: `${row.checkColor}18`, color: row.checkColor }">
                  <Check :size="12" :stroke-width="3" />
                </span>
                {{ t(`detailed_features.${row.key}.list[${n - 1}]`) }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.detailed-features {
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
  max-width: 700px;
  margin: 0 auto 5rem;
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

.section-sub {
  font-size: 1.1rem;
  color: #64748B;
  line-height: 1.7;
}

/* Rows */
.rows-wrapper {
  display: flex;
  flex-direction: column;
  gap: 7rem;
}

.feature-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5rem;
  align-items: center;
}

.feature-row.reverse {
  direction: rtl;
}

.feature-row.reverse > * {
  direction: ltr;
}

/* Image */
.img-side {
  width: 100%;
}

.img-frame {
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 20px;
  padding: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 320px;
  overflow: hidden;
  transition: box-shadow 0.3s ease;
}

.img-frame:hover {
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.07);
}

.feature-img {
  width: 100%;
  max-height: 280px;
  object-fit: contain;
  transition: transform 0.4s ease;
}

.img-frame:hover .feature-img {
  transform: scale(1.03);
}

/* Content */
.content-side {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.feature-icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.feature-title {
  font-size: clamp(1.6rem, 2.5vw, 2rem);
  font-weight: 800;
  color: #0F172A;
  margin: 0;
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.feature-desc {
  font-size: 1rem;
  color: #64748B;
  line-height: 1.7;
}

.feature-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  margin-top: 0.5rem;
}

.feature-list li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.95rem;
  color: #374151;
  font-weight: 500;
}

.check-icon {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

@media (max-width: 960px) {
  .feature-row,
  .feature-row.reverse {
    grid-template-columns: 1fr;
    direction: ltr;
    gap: 2.5rem;
  }

  .rows-wrapper { gap: 5rem; }
}

@media (max-width: 540px) {
  .detailed-features { padding: 5rem 0; }
  .rows-wrapper { gap: 4rem; }
  .img-frame { min-height: 220px; padding: 1.5rem; }
}
</style>
