<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { ArrowLeft, Mail } from 'lucide-vue-next'
import NavBar from '@/components/NavBar.vue'
import Footer from '@/components/Footer.vue'
import { goToHomeSection } from '@/composables/useHomeSectionNav'
import { useSeo } from '@/composables/useSeo'

const props = defineProps({
  /** Qaysi hujjat ko'rsatiladi: locale'dagi ildiz kalit */
  docKey: {
    type: String,
    required: true,
    validator: (v) => ['privacy', 'terms'].includes(v),
  },
})

const { t, tm, locale } = useI18n()
const router = useRouter()

const sections = computed(() => tm(`${props.docKey}.sections`))

// Hujjat sanasi: oxirgi tahrir sanasi (qo'lda yangilanadi)
const UPDATED_AT = '2026-09-11'

const updatedLabel = computed(() =>
  new Intl.DateTimeFormat(locale.value === 'ru' ? 'ru-RU' : 'uz-UZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(UPDATED_AT)),
)

useSeo({
  path: `/${props.docKey}`,
  title: () => `${t(`${props.docKey}.title`)} — CPOS`,
  description: () => t(`${props.docKey}.subtitle`),
})

const goContact = () => goToHomeSection(router, 'contact')

const scrollTo = (i) => {
  const el = document.getElementById(`sec-${i}`)
  if (!el) return
  const nav = document.querySelector('nav')
  const top = el.getBoundingClientRect().top + window.scrollY - ((nav?.offsetHeight ?? 72) + 16)
  window.scrollTo({ top, behavior: 'smooth' })
}

</script>

<template>
  <div class="legal-page">
    <NavBar />

    <main class="legal-main">
      <div class="legal-container">
        <!-- Sarlavha -->
        <header class="legal-head">
          <button type="button" class="back-link" @click="router.push('/')">
            <ArrowLeft :size="16" :stroke-width="2.25" />
            {{ t('legal.back_home') }}
          </button>

          <h1 class="legal-title">{{ t(`${docKey}.title`) }}</h1>
          <p class="legal-sub">{{ t(`${docKey}.subtitle`) }}</p>

          <p class="legal-updated">
            <time :datetime="UPDATED_AT">{{ t('legal.updated') }}: {{ updatedLabel }}</time>
          </p>
        </header>

        <div class="legal-body">
          <!-- Bo'limlar ro'yxati -->
          <nav class="legal-toc" :aria-label="t('legal.toc')">
            <span class="toc-title">{{ t('legal.toc') }}</span>
            <ol class="toc-list">
              <li v-for="(s, i) in sections" :key="i">
                <button type="button" class="toc-link" @click="scrollTo(i)">
                  {{ s.title }}
                </button>
              </li>
            </ol>
          </nav>

          <!-- Hujjat matni -->
          <article class="legal-content">
            <section v-for="(s, i) in sections" :key="i" :id="`sec-${i}`" class="legal-section">
              <h2 class="section-title">
                <span class="section-num">{{ String(i + 1).padStart(2, '0') }}</span>
                {{ s.title }}
              </h2>
              <p class="section-body">{{ s.body }}</p>
              <ul v-if="s.items && s.items.length" class="section-list">
                <li v-for="(item, ii) in s.items" :key="ii">{{ item }}</li>
              </ul>
            </section>

            <!-- Aloqa bloki -->
            <aside class="legal-cta">
              <div class="cta-icon"><Mail :size="20" :stroke-width="2" /></div>
              <div class="cta-text">
                <strong>{{ t('legal.contact_cta') }}</strong>
                <span>{{ t('legal.contact_cta_sub') }}</span>
              </div>
              <button type="button" class="cta-btn" @click="goContact">
                {{ t('legal.contact_btn') }}
              </button>
            </aside>
          </article>
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>

<style scoped>
.legal-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #fff;
}

.legal-main {
  flex: 1;
  padding: clamp(6.5rem, 14vw, 9rem) 0 clamp(3rem, 8vw, 5rem);
}

.legal-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 var(--page-gutter, 2rem);
}

/* ─── Sarlavha ───────────────────────────────── */
.legal-head {
  max-width: 720px;
  margin-bottom: clamp(2rem, 5vw, 3.5rem);
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0.5rem 0.9rem 0.5rem 0.7rem;
  margin-bottom: 1.5rem;
  border: 1.5px solid #e2e8f0;
  border-radius: 100px;
  background: #fff;
  color: #475569;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.back-link:hover {
  border-color: #007bff;
  color: #007bff;
}

.legal-title {
  font-size: clamp(1.9rem, 5vw, 3rem);
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.02em;
  line-height: 1.15;
  margin: 0 0 1rem;
  text-wrap: balance;
}

.legal-sub {
  font-size: clamp(0.98rem, 2.2vw, 1.1rem);
  color: #64748b;
  line-height: 1.7;
  margin: 0 0 1.25rem;
  text-wrap: pretty;
}

.legal-updated {
  display: inline-block;
  font-size: 0.8rem;
  color: #64748b;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 100px;
  padding: 5px 14px;
  margin: 0;
}

/* ─── Tanа ───────────────────────────────────── */
.legal-body {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: clamp(2rem, 5vw, 4rem);
  align-items: start;
}

/* Bo'limlar ro'yxati */
.legal-toc {
  position: sticky;
  top: calc(72px + 1.5rem);
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 1.25rem;
  background: #f8fafc;
}

.toc-title {
  display: block;
  font-size: 0.72rem;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 0.85rem;
}

.toc-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  counter-reset: toc;
}

.toc-link {
  display: block;
  width: 100%;
  text-align: start;
  padding: 0.4rem 0;
  border: none;
  background: none;
  color: #475569;
  font-family: inherit;
  font-size: 0.85rem;
  line-height: 1.45;
  cursor: pointer;
  transition: color 0.2s;
}

.toc-link:hover {
  color: #007bff;
}

/* Matn */
.legal-content {
  min-width: 0;
}

.legal-section {
  scroll-margin-top: 96px;
  padding-bottom: 2rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid #f1f5f9;
}

.legal-section:last-of-type {
  border-bottom: none;
}

.section-title {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  font-size: clamp(1.1rem, 2.6vw, 1.35rem);
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.9rem;
  line-height: 1.35;
  letter-spacing: -0.01em;
}

.section-num {
  font-size: 0.75rem;
  font-weight: 800;
  color: #cbd5e1;
  font-variant-numeric: tabular-nums;
  flex-shrink: 0;
}

.section-body {
  font-size: 0.98rem;
  color: #475569;
  line-height: 1.8;
  margin: 0;
  text-wrap: pretty;
}

.section-list {
  list-style: none;
  margin: 1rem 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}

.section-list li {
  position: relative;
  padding-left: 1.5rem;
  font-size: 0.95rem;
  color: #475569;
  line-height: 1.7;
}

.section-list li::before {
  content: '';
  position: absolute;
  left: 0.3rem;
  top: 0.65em;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #007bff;
}

/* ─── Aloqa bloki ────────────────────────────── */
.legal-cta {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 2.5rem;
  padding: 1.4rem;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  background: #f8fafc;
  flex-wrap: wrap;
}

.cta-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 123, 255, 0.1);
  color: #007bff;
  flex-shrink: 0;
}

.cta-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 150px;
}

.cta-text strong {
  font-size: 0.95rem;
  color: #0f172a;
}

.cta-text span {
  font-size: 0.85rem;
  color: #64748b;
}

.cta-btn {
  padding: 0.7rem 1.4rem;
  min-height: 44px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, #007bff, #6366f1);
  color: #fff;
  font-family: inherit;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cta-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(0, 123, 255, 0.32);
}

/* ─── Responsive ─────────────────────────────── */
@media (max-width: 900px) {
  .legal-body {
    grid-template-columns: 1fr;
  }

  /* Telefonda ro'yxat yopishqoq bo'lmaydi — matndan oldin bir marta ko'rsatiladi */
  .legal-toc {
    position: static;
    padding: 1rem 1.1rem;
  }

  .toc-list {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.1rem 1rem;
  }
}

@media (max-width: 560px) {
  .toc-list {
    grid-template-columns: 1fr;
  }

  .toc-link {
    padding: 0.5rem 0;
  }

  .legal-section {
    padding-bottom: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .legal-cta {
    flex-direction: column;
    align-items: flex-start;
  }

  .cta-btn {
    width: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .back-link,
  .cta-btn,
  .toc-link {
    transition: none;
  }
}
</style>
