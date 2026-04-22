<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { goToHomeSection } from '@/composables/useHomeSectionNav'
import { Check } from 'lucide-vue-next'

const { t } = useI18n()
const router = useRouter()

const goContact = () => goToHomeSection(router, 'contact')

const isAnnual = ref(true)

const toggleBilling = () => {
  isAnnual.value = !isAnnual.value
}

const plans = computed(() => [
  {
    name: t('pricing.plans.starter.name'),
    desc: t('pricing.plans.starter.desc'),
    price: isAnnual.value ? '150k' : '180k',
    features: [
      t('pricing.plans.starter.features[0]'),
      t('pricing.plans.starter.features[1]'),
      t('pricing.plans.starter.features[2]')
    ],
    buttonText: t('pricing.plans.starter.btn'),
    isPopular: false,
    variant: 'default'
  },
  {
    name: t('pricing.plans.growth.name'),
    desc: t('pricing.plans.growth.desc'),
    price: isAnnual.value ? '290k' : '350k',
    features: [
      t('pricing.plans.growth.features[0]'),
      t('pricing.plans.growth.features[1]'),
      t('pricing.plans.growth.features[2]'),
      t('pricing.plans.growth.features[3]')
    ],
    buttonText: t('pricing.plans.growth.btn'),
    isPopular: true,
    variant: 'primary'
  },
  {
    name: t('pricing.plans.enterprise.name'),
    desc: t('pricing.plans.enterprise.desc'),
    price: t('pricing.plans.enterprise.price'),
    priceUnit: '',
    features: [
      t('pricing.plans.enterprise.features[0]'),
      t('pricing.plans.enterprise.features[1]'),
      t('pricing.plans.enterprise.features[2]'),
      t('pricing.plans.enterprise.features[3]')
    ],
    buttonText: t('pricing.plans.enterprise.btn'),
    isPopular: false,
    variant: 'default'
  }
])
</script>

<template>
  <section id="pricing" class="pricing-section">
    <div class="section-container">
      <div class="section-head" data-aos="fade-up">
        <span class="section-tag">Narxlar</span>
        <h2 class="section-title">{{ t('pricing.title') }}</h2>

        <div class="billing-toggle">
          <span :class="['toggle-label', { active: !isAnnual }]" @click="isAnnual = false">{{ t('pricing.monthly') }}</span>
          <div class="toggle-switch" :class="{ on: isAnnual }" @click="toggleBilling">
            <div class="toggle-thumb"></div>
          </div>
          <span :class="['toggle-label', { active: isAnnual }]" @click="isAnnual = true">
            {{ t('pricing.annual') }}
            <span class="save-badge">{{ t('pricing.save') }}</span>
          </span>
        </div>
      </div>

      <div class="pricing-grid" data-aos="fade-up" data-aos-delay="100">
        <div
          v-for="(plan, index) in plans"
          :key="index"
          :class="['pricing-card', { featured: plan.isPopular }]"
        >
          <div v-if="plan.isPopular" class="popular-badge">{{ t('pricing.popular') }}</div>

          <div class="card-body">
            <h3 class="plan-name">{{ plan.name }}</h3>
            <p class="plan-desc">{{ plan.desc }}</p>

            <div class="plan-price">
              <span class="price-amount">{{ plan.price }}</span>
              <span v-if="plan.price !== 'Kelishilgan'" class="price-unit">UZS / oy</span>
            </div>

            <ul class="plan-features">
              <li v-for="(feat, fi) in plan.features" :key="fi">
                <span class="check-wrap">
                  <Check :size="13" :stroke-width="3" />
                </span>
                {{ feat }}
              </li>
            </ul>
          </div>

          <div class="card-foot">
            <a
              href="/"
              :class="['btn-plan', plan.variant === 'primary' ? 'btn-plan--primary' : 'btn-plan--default']"
              @click.prevent="goContact"
            >{{ plan.buttonText }}</a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.pricing-section {
  padding: 7rem 0;
  background: #F8FAFC;
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
  background: rgba(16, 185, 129, 0.08);
  border: 1px solid rgba(16, 185, 129, 0.15);
  color: #10B981;
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
  letter-spacing: -0.02em;
  margin-bottom: 2rem;
}

/* Billing toggle */
.billing-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  background: #fff;
  border: 1px solid #E2E8F0;
  border-radius: 100px;
  padding: 6px 16px;
  cursor: pointer;
  user-select: none;
}

.toggle-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #94A3B8;
  cursor: pointer;
  transition: color 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
}

.toggle-label.active {
  color: #0F172A;
  font-weight: 600;
}

.save-badge {
  font-size: 0.7rem;
  font-weight: 700;
  background: rgba(16, 185, 129, 0.1);
  color: #10B981;
  padding: 2px 7px;
  border-radius: 100px;
}

.toggle-switch {
  width: 40px;
  height: 22px;
  background: #E2E8F0;
  border-radius: 100px;
  position: relative;
  cursor: pointer;
  transition: background 0.3s;
  flex-shrink: 0;
}

.toggle-switch.on {
  background: #007BFF;
}

.toggle-thumb {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 16px;
  height: 16px;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;
}

.toggle-switch.on .toggle-thumb {
  transform: translateX(18px);
}

/* Grid */
.pricing-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  align-items: stretch;
  max-width: 1060px;
  margin: 0 auto;
}

.pricing-card {
  background: #fff;
  border: 1px solid #E2E8F0;
  border-radius: 24px;
  padding: 2.25rem;
  position: relative;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
}

.pricing-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.08);
}

.pricing-card.featured {
  background: linear-gradient(155deg, #0F172A 0%, #1E3A5F 100%);
  border-color: transparent;
  box-shadow: 0 24px 56px rgba(0, 86, 179, 0.22);
  transform: scale(1.04);
}

.pricing-card.featured:hover {
  transform: scale(1.04) translateY(-6px);
  box-shadow: 0 32px 64px rgba(0, 86, 179, 0.3);
}

.popular-badge {
  position: absolute;
  top: -1px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #007BFF, #6366F1);
  color: #fff;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 5px 16px;
  border-radius: 0 0 10px 10px;
}

.card-body {
  flex: 1;
}

.plan-name {
  font-size: 1.35rem;
  font-weight: 700;
  color: #0F172A;
  margin-bottom: 0.5rem;
}

.pricing-card.featured .plan-name { color: #fff; }

.plan-desc {
  font-size: 0.875rem;
  color: #64748B;
  margin-bottom: 2rem;
  min-height: 2.8rem;
  line-height: 1.5;
}

.pricing-card.featured .plan-desc { color: #94A3B8; }

.plan-price {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-bottom: 2rem;
}

.price-amount {
  font-size: 2.4rem;
  font-weight: 800;
  color: #0F172A;
  letter-spacing: -0.03em;
  line-height: 1;
}

.pricing-card.featured .price-amount { color: #fff; }

.price-unit {
  font-size: 0.85rem;
  color: #94A3B8;
  font-weight: 500;
}

.plan-features {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.plan-features li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.9rem;
  color: #475569;
}

.pricing-card.featured .plan-features li { color: #CBD5E1; }

.check-wrap {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(16, 185, 129, 0.1);
  color: #10B981;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.pricing-card.featured .check-wrap {
  background: rgba(96, 165, 250, 0.15);
  color: #60A5FA;
}

.card-foot {
  margin-top: 2.5rem;
}

.btn-plan {
  display: block;
  width: 100%;
  padding: 0.9rem;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.95rem;
  text-align: center;
  text-decoration: none;
  transition: all 0.25s ease;
  cursor: pointer;
}

.btn-plan--default {
  background: #F1F5F9;
  color: #0F172A;
}

.btn-plan--default:hover {
  background: #E2E8F0;
  transform: translateY(-1px);
}

.btn-plan--primary {
  background: linear-gradient(135deg, #007BFF, #6366F1);
  color: #fff;
  box-shadow: 0 4px 16px rgba(0, 123, 255, 0.35);
}

.btn-plan--primary:hover {
  box-shadow: 0 8px 24px rgba(0, 123, 255, 0.45);
  transform: translateY(-2px);
}

@media (max-width: 900px) {
  .pricing-grid {
    grid-template-columns: 1fr;
    max-width: 440px;
  }

  .pricing-card.featured {
    transform: none;
    order: -1;
  }

  .pricing-card.featured:hover { transform: translateY(-6px); }
}

@media (max-width: 520px) {
  .pricing-section { padding: 5rem 0; }
}
</style>
