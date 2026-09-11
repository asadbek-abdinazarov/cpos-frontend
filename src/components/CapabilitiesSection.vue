<script setup>
import { useI18n } from 'vue-i18n'
import { PackagePlus, ScanLine, Boxes, FileSpreadsheet } from 'lucide-vue-next'

const { t, tm } = useI18n()

const icons = [PackagePlus, ScanLine, Boxes, FileSpreadsheet]
</script>

<template>
  <section class="capabilities" id="workflow">
    <div class="section-container">
      <div class="section-head" data-aos="fade-up">
        <span class="section-tag">{{ t('capabilities.tag') }}</span>
        <h2 class="section-title">{{ t('capabilities.title') }}</h2>
        <p class="section-sub">{{ t('capabilities.subtitle') }}</p>
      </div>

      <ol class="steps">
        <li
          v-for="(step, i) in tm('capabilities.steps')"
          :key="i"
          class="step"
          data-aos="fade-up"
          :data-aos-delay="i * 70"
        >
          <div class="step-marker">
            <span class="step-icon">
              <component :is="icons[i]" :size="20" :stroke-width="2" />
            </span>
            <span class="step-num">{{ String(i + 1).padStart(2, '0') }}</span>
          </div>
          <div class="step-body">
            <h3 class="step-title">{{ step.title }}</h3>
            <p class="step-desc">{{ step.desc }}</p>
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.capabilities {
  padding: clamp(4rem, 9vw, 7rem) 0;
  background: #f8fafc;
}

.section-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--page-gutter, 2rem);
}

.section-head {
  text-align: center;
  max-width: 640px;
  margin: 0 auto clamp(2.5rem, 6vw, 4rem);
}

.section-tag {
  display: inline-block;
  background: rgba(99, 102, 241, 0.08);
  border: 1px solid rgba(99, 102, 241, 0.15);
  color: #6366f1;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 5px 14px;
  border-radius: 100px;
  margin-bottom: 1.25rem;
}

.section-title {
  font-size: clamp(1.75rem, 4.5vw, 2.75rem);
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
  text-wrap: balance;
}

.section-sub {
  font-size: clamp(0.95rem, 2.2vw, 1.1rem);
  color: #64748b;
  line-height: 1.7;
  text-wrap: pretty;
}

/* ─── Qadamlar ───────────────────────────────── */
.steps {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1.25rem;
  counter-reset: step;
}

.step {
  position: relative;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  padding: 1.5rem 1.35rem;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    border-color 0.25s ease;
}

@media (hover: hover) {
  .step:hover {
    transform: translateY(-4px);
    border-color: rgba(99, 102, 241, 0.25);
    box-shadow: 0 16px 36px rgba(15, 23, 42, 0.07);
  }
}

/* Qadamlarni bog'lovchi chiziq */
.step:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 2.55rem;
  right: -1.25rem;
  width: 1.25rem;
  height: 1px;
  background: linear-gradient(90deg, rgba(99, 102, 241, 0.35), rgba(99, 102, 241, 0.1));
}

.step-marker {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.step-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(99, 102, 241, 0.1);
  color: #6366f1;
  flex-shrink: 0;
}

.step-num {
  font-size: 0.72rem;
  font-weight: 800;
  color: #cbd5e1;
  letter-spacing: 0.06em;
  font-variant-numeric: tabular-nums;
}

.step-body {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.step-title {
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  line-height: 1.35;
}

.step-desc {
  font-size: 0.88rem;
  color: #64748b;
  line-height: 1.65;
  margin: 0;
  text-wrap: pretty;
}

/* ─── Responsive ─────────────────────────────── */
@media (max-width: 1024px) {
  .steps {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  /* Ikki ustunda faqat 1→2 va 3→4 orasida chiziq mantiqiy */
  .step:nth-child(2n)::after {
    display: none;
  }
}

@media (max-width: 600px) {
  .steps {
    grid-template-columns: 1fr;
    gap: 0.85rem;
  }

  .step {
    flex-direction: row;
    align-items: flex-start;
    gap: 1rem;
    padding: 1.15rem 1.1rem;
  }

  .step::after {
    display: none;
  }

  .step-marker {
    flex-direction: column;
    align-items: center;
    gap: 0.35rem;
  }

  .step-icon {
    width: 40px;
    height: 40px;
  }

  .step-title {
    font-size: 0.98rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .step {
    transition: none;
  }
}
</style>
