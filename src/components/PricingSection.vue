<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Check } from 'lucide-vue-next'

const { t } = useI18n()

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
    priceUnit: '', // No /mo for custom
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
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">{{ t('pricing.title') }}</h2>
        
        <div class="billing-toggle">
          <span :class="{ 'active': !isAnnual }" @click="isAnnual = false">{{ t('pricing.monthly') }}</span>
          <div class="toggle-switch" @click="toggleBilling" :class="{ 'on': isAnnual }">
            <div class="toggle-track"></div>
            <div class="toggle-thumb"></div>
          </div>
          <span :class="{ 'active': isAnnual }" @click="isAnnual = true">
            {{ t('pricing.annual') }} <span class="discount-badge">({{ t('pricing.save') }})</span>
          </span>
        </div>
      </div>

      <div class="pricing-grid">
        <div 
          v-for="(plan, index) in plans" 
          :key="index" 
          :class="['pricing-card', { 'featured': plan.isPopular }]"
        >
          <div v-if="plan.isPopular" class="popular-badge">{{ t('pricing.popular') }}</div>
          
          <div class="card-content">
            <h3 class="plan-name">{{ plan.name }}</h3>
            <p class="plan-desc">{{ plan.desc }}</p>
            
            <div class="plan-price">
              <span class="amount">{{ plan.price }}</span>
              <span v-if="plan.price !== 'Custom'" class="unit"> UZS/mo</span>
            </div>
            
            <ul class="plan-features">
              <li v-for="(feature, fIndex) in plan.features" :key="fIndex">
                <Check class="check-icon" />
                {{ feature }}
              </li>
            </ul>
          </div>

          <div class="card-footer">
            <button :class="['btn-action', plan.variant === 'primary' ? 'btn-primary' : 'btn-default']">
              {{ plan.buttonText }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.pricing-section {
  padding: 6rem 0;
  background-color: #F8FAFC; /* Light background as per image/context */
  font-family: 'Poppins', sans-serif;
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
  font-weight: 700;
  color: #0F172A;
  margin-bottom: 2rem;
}

/* Billing Toggle */
.billing-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  font-weight: 500;
  color: #64748B;
  cursor: pointer;
  user-select: none;
}

.billing-toggle span.active {
  color: #0F172A;
  font-weight: 600;
}

.toggle-switch {
  position: relative;
  width: 50px;
  height: 28px;
  background-color: #E2E8F0;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.toggle-switch.on {
  background-color: #007BFF;
}

.toggle-thumb {
  position: absolute;
  top: 4px;
  left: 4px;
  width: 20px;
  height: 20px;
  background-color: white;
  border-radius: 50%;
  transition: transform 0.3s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.toggle-switch.on .toggle-thumb {
  transform: translateX(22px);
}

.discount-badge {
  color: #10B981; /* Green */
  font-size: 0.9rem;
  margin-left: 0.25rem;
}

/* Pricing Grid */
.pricing-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  align-items: center; /* Align cards vertically center if needed, or stretch */
  max-width: 1100px;
  margin: 0 auto;
}

.pricing-card {
  background: white;
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  position: relative;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid transparent;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.pricing-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Featured Card Styling */
.pricing-card.featured {
  background-color: #0056D2; /* Specific Dark Blue from image */
  color: white;
  transform: scale(1.05);
  box-shadow: 0 25px 50px -12px rgba(0, 86, 210, 0.25);
  z-index: 10;
  border: none;
}

.pricing-card.featured:hover {
  transform: scale(1.05) translateY(-5px);
}

.popular-badge {
  position: absolute;
  top: 0;
  right: 2rem;
  background-color: #14B8A6; /* Teal/Cyan */
  color: white;
  padding: 0.25rem 0.75rem;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Card Content */
.card-content {
  flex: 1;
}

.plan-name {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: inherit;
}

.plan-desc {
  font-size: 0.95rem;
  color: #64748B;
  margin-bottom: 2rem;
  min-height: 3rem; /* Align prices */
}

.pricing-card.featured .plan-desc {
  color: #BFDBFE; /* Light Blue text */
}

.plan-price {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 2rem;
  color: inherit;
  display: flex;
  align-items: baseline;
}

.unit {
  font-size: 1rem;
  font-weight: 500;
  color: #64748B;
  margin-left: 0.25rem;
}

.pricing-card.featured .unit {
  color: #DBEAFE;
}

.plan-features {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.plan-features li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.95rem;
  color: #475569;
}

.pricing-card.featured .plan-features li {
  color: #E2E8F0;
}

.check-icon {
  color: #10B981; /* Green check */
  font-weight: bold;
}

.pricing-card.featured .check-icon {
  color: #34D399; /* Lighter green check on blue */
}

/* Footer & Buttons */
.card-footer {
  margin-top: 3rem;
}

.btn-action {
  width: 100%;
  padding: 1rem;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  border: none;
}

.btn-default {
  background-color: #F1F5F9;
  color: #0F172A;
}

.btn-default:hover {
  background-color: #E2E8F0;
}

.btn-primary {
  background-color: white;
  color: #0056D2; /* Text color matches card bg */
}

.btn-primary:hover {
  background-color: #F8FAFC;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

/* Responsive */
@media (max-width: 900px) {
  .pricing-section {
    padding: 4rem 0;
  }

  .pricing-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .pricing-card.featured {
     transform: scale(1);
     grid-column: span 2; /* Make featured take full width or adjust */
  }
  
  .pricing-card.featured:hover {
     transform: translateY(-5px);
  }
}

@media (max-width: 650px) {
  .pricing-grid {
    grid-template-columns: 1fr;
  }
  
  .pricing-card.featured {
     grid-column: span 1;
  }
  
  .section-title {
    font-size: 2rem;
  }
}
</style>
