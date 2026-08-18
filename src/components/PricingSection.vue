<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { goToHomeSection } from '@/composables/useHomeSectionNav'
import { Check } from 'lucide-vue-next'
import { getSubscriptionPlans } from '@/services/api'

const { t, locale } = useI18n()
const router = useRouter()

const goContact = () => goToHomeSection(router, 'contact')

const plansLoading = ref(false)
const plansError = ref(false)
const rawPlans = ref([])

function formatMoneyUZS(value) {
  if (typeof value !== 'number') return ''
  return new Intl.NumberFormat(locale.value || 'uz-UZ').format(value)
}

function formatLimit(limitValue) {
  if (limitValue === -1) return t('pricing.unlimited')
  if (limitValue == null) return null
  return String(limitValue)
}

function formatFeature(feature) {
  const label = t(`pricing.features.${feature.featureCode}`)
  const limit = formatLimit(feature.limitValue)
  if (limit == null) return label
  return t('pricing.features_with_limit', { feature: label, limit })
}

const publicPlans = computed(() => {
  return (rawPlans.value || [])
    .filter((p) => p && p.isActive && p.isPublic)
    .slice()
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
})

const featuredPlanId = computed(() => {
  const prof = publicPlans.value.find((p) => p.planType === 'PROFESSIONAL')
  if (prof) return prof.id
  const mid = publicPlans.value[Math.floor(publicPlans.value.length / 2)]
  return mid?.id ?? null
})

const plans = computed(() => {
  return publicPlans.value.map((p) => {
    const isFree = (p.monthlyPrice ?? 0) === 0
    const priceNumber = p.monthlyPrice ?? 0

    const priceText = isFree ? t('pricing.free') : formatMoneyUZS(priceNumber)
    const unitText = isFree ? '' : t('pricing.per_month')

    const enabledFeatures = (p.features || [])
      .filter((f) => f && f.enabled)
      .map((f) => formatFeature(f))

    const isFeatured = featuredPlanId.value != null && p.id === featuredPlanId.value

    return {
      id: p.id,
      name: p.displayName || p.name,
      desc: p.description || '',
      trialDays: p.trialDays ?? 0,
      priceText,
      unitText,
      features: enabledFeatures,
      buttonText: p.planType === 'ENTERPRISE' ? t('pricing.cta_contact') : t('pricing.cta_start'),
      isPopular: isFeatured,
      variant: isFeatured ? 'primary' : 'default',
    }
  })
})

async function loadPlans() {
  plansLoading.value = true
  plansError.value = false
  try {
    const res = await getSubscriptionPlans()
    if (res?.data?.success && Array.isArray(res.data.data)) {
      rawPlans.value = res.data.data
    } else {
      rawPlans.value = []
      plansError.value = true
    }
  } catch {
    rawPlans.value = []
    plansError.value = true
  } finally {
    plansLoading.value = false
  }
}

onMounted(loadPlans)
</script>

<template>
  <section id="pricing" class="ps">
    <div class="ps__noise" aria-hidden="true"></div>

    <div class="ps__container">
      <header class="ps__head" data-aos="fade-up">
        <div class="ps__eyebrow">
          <span class="ps__eyebrow-line"></span>
          <span class="ps__eyebrow-text">Narxlar</span>
          <span class="ps__eyebrow-line"></span>
        </div>
        <h2 class="ps__title">{{ t('pricing.title') }}</h2>
      </header>

      <div class="ps__grid" data-aos="fade-up" data-aos-delay="120">
        <div v-if="plansLoading" class="ps__state">
          <span class="ps__spinner"></span>
          {{ t('pricing.loading') }}
        </div>
        <div v-else-if="plansError" class="ps__state ps__state--err">
          {{ t('pricing.load_error') }}
        </div>

        <template v-else>
          <article
            v-for="(plan, i) in plans"
            :key="plan.id ?? i"
            :class="['ps__card', { 'ps__card--hot': plan.isPopular }]"
            :data-tier="String(i + 1).padStart(2, '0')"
          >
            <div v-if="plan.isPopular" class="ps__ribbon">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path
                  d="M6 1l1.3 2.6 2.9.4-2.1 2 .5 2.9L6 7.6 3.4 8.9l.5-2.9-2.1-2 2.9-.4z"
                  fill="currentColor"
                />
              </svg>
              {{ t('pricing.popular') }}
            </div>
            <div v-else class="ps__ribbon-ph" aria-hidden="true"></div>

            <div class="ps__card-body">
              <div class="ps__card-top">
                <h3 class="ps__plan-name">{{ plan.name }}</h3>
                <p class="ps__plan-desc">{{ plan.desc }}</p>
              </div>

              <div class="ps__price-row">
                <span class="ps__price-amt">{{ plan.priceText }}</span>
                <span v-if="plan.unitText" class="ps__price-unit">{{ plan.unitText }}</span>
              </div>

              <div v-if="plan.trialDays > 0" class="ps__trial">
                {{ t('pricing.trial_days', { days: plan.trialDays }) }}
              </div>

              <div class="ps__sep"></div>

              <ul class="ps__feats">
                <li v-for="(feat, fi) in plan.features" :key="fi" class="ps__feat">
                  <span class="ps__check">
                    <Check :size="10" :stroke-width="3.5" />
                  </span>
                  <span>{{ feat }}</span>
                </li>
              </ul>
            </div>

            <div class="ps__card-foot">
              <a
                href="/"
                :class="['ps__cta', plan.isPopular ? 'ps__cta--hot' : 'ps__cta--plain']"
                @click.prevent="goContact"
              >
                <span>{{ plan.buttonText }}</span>
                <svg
                  class="ps__cta-arrow"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3 8h10M9 4l4 4-4 4"
                    stroke="currentColor"
                    stroke-width="1.75"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </a>
            </div>
          </article>
        </template>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ── Section shell ── */
.ps {
  position: relative;
  padding: 7rem 0;
  background: #f0f4ff;
  overflow: hidden;
  font-family: 'Poppins', system-ui, sans-serif;
}

/* Subtle ambient glow */
.ps__noise {
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(ellipse 70% 50% at 10% 15%, rgba(0, 123, 255, 0.07) 0%, transparent 55%),
    radial-gradient(ellipse 60% 40% at 90% 85%, rgba(99, 102, 241, 0.06) 0%, transparent 55%);
  pointer-events: none;
}

.ps__container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
}

/* ── Header ── */
.ps__head {
  text-align: center;
  margin-bottom: 4rem;
}

.ps__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 1.25rem;
}

.ps__eyebrow-line {
  display: block;
  width: 32px;
  height: 1.5px;
  background: linear-gradient(90deg, transparent, #007bff);
  border-radius: 2px;
}

.ps__eyebrow-line:last-child {
  background: linear-gradient(90deg, #007bff, transparent);
}

.ps__eyebrow-text {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #007bff;
}

.ps__title {
  font-size: clamp(2rem, 3.5vw, 2.75rem);
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.025em;
  line-height: 1.15;
  margin-bottom: 2.25rem;
}

/* ── Grid ── */
.ps__grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: stretch;
  gap: 1.25rem;
}


.ps__state {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  background: #fff;
  border: 1px solid #dde2ee;
  border-radius: 20px;
  padding: 2.5rem;
  color: #64748b;
  font-weight: 500;
  font-size: 0.9rem;
}

.ps__state--err {
  color: #ef4444;
}

.ps__spinner {
  display: inline-block;
  width: 18px;
  height: 18px;
  border: 2px solid #e2e8f0;
  border-top-color: #007bff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ── Card base ── */
.ps__card {
  position: relative;
  background: #fff;
  border: 1px solid #dde2ee;
  border-radius: 22px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex: 1 1 280px;
  max-width: 320px;
  transition:
    transform 0.28s ease,
    box-shadow 0.28s ease;
  z-index: 0;
}

/* decorative tier number */
.ps__card::before {
  content: attr(data-tier);
  position: absolute;
  top: 0.6rem;
  right: 1rem;
  font-family: 'Poppins', sans-serif;
  font-size: 5.5rem;
  font-weight: 900;
  color: rgba(0, 0, 0, 0.04);
  line-height: 1;
  pointer-events: none;
  user-select: none;
  z-index: 0;
}

.ps__card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 48px rgba(11, 22, 41, 0.1);
}

/* ── Featured card ── */
.ps__card--hot {
  background: #0b1629;
  border-width: 1.5px;
  animation: hotBorderPulse 3.5s ease infinite;
}

.ps__card--hot::before {
  color: rgba(255, 255, 255, 0.04);
}

@keyframes hotBorderPulse {
  0%,
  100% {
    border-color: rgba(0, 123, 255, 0.55);
    box-shadow:
      0 20px 50px rgba(11, 22, 41, 0.35),
      0 0 28px rgba(0, 123, 255, 0.1);
  }
  50% {
    border-color: rgba(99, 102, 241, 0.55);
    box-shadow:
      0 20px 50px rgba(11, 22, 41, 0.35),
      0 0 36px rgba(99, 102, 241, 0.13);
  }
}

.ps__card--hot:hover {
  transform: translateY(-5px);
  box-shadow:
    0 30px 60px rgba(11, 22, 41, 0.42),
    0 0 48px rgba(0, 123, 255, 0.16);
}

/* ── Ribbon ── */
.ps__ribbon {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  background: linear-gradient(90deg, #007bff, #6366f1);
  color: #fff;
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 7px 0;
  position: relative;
  z-index: 1;
}

/* Invisible spacer — same height as ribbon — keeps card content aligned */
.ps__ribbon-ph {
  height: 30px; /* 7px padding × 2 + ~16px line-height */
  visibility: hidden;
  pointer-events: none;
}

/* ── Card body ── */
.ps__card-body {
  flex: 1;
  padding: 1.75rem 1.75rem 0;
  position: relative;
  z-index: 1;
}

.ps__card-top {
  margin-bottom: 1.5rem;
}

.ps__plan-name {
  font-size: 1.2rem;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.02em;
  margin-bottom: 0.35rem;
  min-height: 1.8rem;
}

.ps__card--hot .ps__plan-name {
  color: #f0f6ff;
}

.ps__plan-desc {
  font-size: 0.8rem;
  color: #94a3b8;
  line-height: 1.5;
  min-height: 2.8rem;
}

.ps__card--hot .ps__plan-desc {
  color: #5a7a9a;
}

/* ── Price ── */
.ps__price-row {
  display: flex;
  align-items: baseline;
  gap: 5px;
  margin-bottom: 1.25rem;
  min-height: 3.2rem;
}

.ps__price-amt {
  font-size: 2rem;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.04em;
  line-height: 1;
}

.ps__card--hot .ps__price-amt {
  color: #fff;
}

.ps__price-unit {
  font-size: 0.75rem;
  font-weight: 500;
  color: #94a3b8;
  padding-bottom: 3px;
}

/* ── Trial badge ── */
.ps__trial {
  display: inline-flex;
  align-items: center;
  background: rgba(0, 123, 255, 0.08);
  border: 1px solid rgba(0, 123, 255, 0.18);
  color: #007bff;
  font-size: 0.72rem;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 100px;
  margin-bottom: 1.25rem;
  letter-spacing: 0.01em;
}

/* ── Separator ── */
.ps__sep {
  height: 1px;
  background: #f1f4fa;
  margin: 0 0 1.25rem;
}

.ps__card--hot .ps__sep {
  background: rgba(255, 255, 255, 0.06);
}

/* ── Features ── */
.ps__feats {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  padding-bottom: 1.5rem;
}

.ps__feat {
  display: flex;
  align-items: flex-start;
  gap: 9px;
  font-size: 0.83rem;
  color: #475569;
  line-height: 1.45;
}

.ps__card--hot .ps__feat {
  color: #8ba4c2;
}

.ps__check {
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: rgba(0, 123, 255, 0.09);
  color: #007bff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1px;
}

.ps__card--hot .ps__check {
  background: rgba(99, 102, 241, 0.18);
  color: #818cf8;
}

/* ── Footer / CTA ── */
.ps__card-foot {
  padding: 0 1.75rem 1.75rem;
  position: relative;
  z-index: 1;
}

.ps__cta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 0.8rem 1.25rem;
  border-radius: 12px;
  font-family: 'Poppins', sans-serif;
  font-size: 0.88rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.22s ease;
  cursor: pointer;
}

.ps__cta-arrow {
  transition: transform 0.22s ease;
  flex-shrink: 0;
}

.ps__cta:hover .ps__cta-arrow {
  transform: translateX(3px);
}

.ps__cta--plain {
  background: #eef2ff;
  color: #1e3a8a;
}

.ps__cta--plain:hover {
  background: #e0e7ff;
  transform: translateY(-1px);
}

.ps__cta--hot {
  background: linear-gradient(135deg, #007bff 0%, #6366f1 100%);
  color: #fff;
  box-shadow: 0 6px 20px rgba(0, 123, 255, 0.35);
}

.ps__cta--hot:hover {
  box-shadow: 0 10px 28px rgba(0, 123, 255, 0.48);
  transform: translateY(-2px);
}

/* ── Responsive ── */
@media (max-width: 640px) {
  .ps {
    padding: 5rem 0;
  }
  .ps__head {
    margin-bottom: 3rem;
  }
  .ps__card {
    flex-basis: 100%;
    max-width: 380px;
  }
  .ps__card::before {
    font-size: 4rem;
  }
  .ps__title {
    margin-bottom: 1.75rem;
  }
}

@media (max-width: 420px) {
  .ps__container {
    padding: 0 1.25rem;
  }
  .ps {
    padding: 4rem 0;
  }
  .ps__head {
    margin-bottom: 2.5rem;
  }
  .ps__card-body {
    padding: 1.5rem 1.5rem 0;
  }
  .ps__card-foot {
    padding: 0 1.5rem 1.5rem;
  }
}
</style>
