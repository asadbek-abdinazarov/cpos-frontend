<script setup>
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { goToHomeSection } from '@/composables/useHomeSectionNav'

const { t, tm } = useI18n()
const router = useRouter()

const goContact = () => goToHomeSection(router, 'contact')
const goFeatures = () => goToHomeSection(router, 'features')

/** Mockup — haqiqiy Analitika sahifasidagi ko'rsatkichlar tartibida */
const kpis = [
  { key: 'revenue', value: '4 280 000', delta: '+12%', tone: 'blue' },
  { key: 'cost', value: '1 640 000', delta: '+4%', tone: 'red' },
  { key: 'margin', value: '38.3%', delta: '+2.1%', tone: 'emerald' },
]

const bars = [45, 62, 51, 78, 96, 71, 43]

const topProducts = [
  { name: 'Kofe latte', share: 82 },
  { name: 'Non', share: 64 },
  { name: 'Sharbat', share: 47 },
]
</script>

<template>
  <section class="hero">
    <div class="hero-bg" aria-hidden="true">
      <div class="bg-grid"></div>
      <div class="bg-blob blob-1"></div>
      <div class="bg-blob blob-2"></div>
    </div>

    <div class="hero-container">
      <!-- ── Matn ustuni ─────────────────────────── -->
      <div class="text-col">
        <div class="badge-pill">
          <span class="badge-dot"></span>
          {{ t('hero.badge') }}
        </div>

        <h1 class="headline">
          {{ t('hero.title_prefix') }}
          <span class="headline-highlight">{{ t('hero.title_highlight') }}</span>
        </h1>

        <p class="subheadline">{{ t('hero.subtitle') }}</p>

        <div class="cta-group">
          <button type="button" class="btn btn-primary" @click="goContact">
            {{ t('hero.cta') }}
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
          <button type="button" class="btn btn-ghost" @click="goFeatures">
            {{ t('hero.watch_demo') }}
          </button>
        </div>

        <dl class="trust-bar">
          <div class="trust-item">
            <dt class="trust-label">{{ t('hero.trust_businesses') }}</dt>
            <dd class="trust-number">1 000+</dd>
          </div>
          <div class="trust-item">
            <dt class="trust-label">{{ t('hero.trust_uptime') }}</dt>
            <dd class="trust-number trust-number--ok">99.9%</dd>
          </div>
          <div class="trust-item">
            <dt class="trust-label">{{ t('hero.trust_support') }}</dt>
            <dd class="trust-number">24/7</dd>
          </div>
        </dl>
      </div>

      <!-- ── Dastur ko'rinishi ───────────────────── -->
      <div class="visual-col">
        <div class="float-badge badge-growth">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#10B981"
            stroke-width="2.5"
            aria-hidden="true"
          >
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
            <polyline points="17 6 23 6 23 12" />
          </svg>
          <span>{{ t('hero.float_growth') }} <strong>+12%</strong></span>
        </div>

        <div class="app-window">
          <div class="window-chrome">
            <div class="chrome-dots">
              <span class="dot dot-red"></span>
              <span class="dot dot-yellow"></span>
              <span class="dot dot-green"></span>
            </div>
            <span class="chrome-title">{{ t('hero.ui.window_title') }}</span>
          </div>

          <div class="window-body">
            <!-- Sidebar: haqiqiy kabinet menyusi tartibida -->
            <nav class="win-sidebar" aria-hidden="true">
              <span class="sidebar-logo"></span>
              <span class="nav-dot is-active"></span>
              <span class="nav-dot"></span>
              <span class="nav-dot"></span>
              <span class="nav-dot"></span>
              <span class="nav-dot"></span>
            </nav>

            <div class="win-main">
              <div class="kpi-row">
                <div v-for="kpi in kpis" :key="kpi.key" class="kpi-card">
                  <span class="kpi-label">{{ t(`hero.ui.${kpi.key}`) }}</span>
                  <span class="kpi-value">{{ kpi.value }}</span>
                  <span class="kpi-delta" :class="`is-${kpi.tone}`">{{ kpi.delta }}</span>
                </div>
              </div>

              <div class="chart-card">
                <div class="chart-head">
                  <span class="chart-title">{{ t('hero.ui.chart_title') }}</span>
                  <span class="chart-legend">
                    <span class="legend-dot"></span>{{ t('hero.ui.legend') }}
                  </span>
                </div>
                <div class="chart-bars">
                  <div v-for="(h, i) in bars" :key="i" class="bar-col">
                    <span class="bar" :class="{ 'is-peak': h === 96 }" :style="{ height: `${h}%` }"></span>
                    <span class="bar-label">{{ tm('hero.ui.days')[i] }}</span>
                  </div>
                </div>
              </div>

              <div class="top-card">
                <span class="top-title">{{ t('hero.ui.top_products') }}</span>
                <div v-for="p in topProducts" :key="p.name" class="top-row">
                  <span class="top-name">{{ p.name }}</span>
                  <span class="top-track"><span class="top-fill" :style="{ width: `${p.share}%` }"></span></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="float-badge badge-sale">
          <span class="pulse-ring"></span>
          <span>{{ t('hero.float_sale') }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ─── Layout ─────────────────────────────────── */
.hero {
  position: relative;
  display: flex;
  align-items: center;
  padding: clamp(6rem, 12vw, 8rem) 0 clamp(3.5rem, 8vw, 5rem);
  overflow: hidden;
  background: #fff;
}

.hero-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--page-gutter, 2rem);
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(2.5rem, 5vw, 5rem);
  align-items: center;
  position: relative;
  z-index: 10;
}

/* ─── Fon ────────────────────────────────────── */
.hero-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.bg-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(0, 123, 255, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 123, 255, 0.04) 1px, transparent 1px);
  background-size: 40px 40px;
  mask-image: radial-gradient(ellipse 80% 60% at 50% 40%, #000 40%, transparent 100%);
  -webkit-mask-image: radial-gradient(ellipse 80% 60% at 50% 40%, #000 40%, transparent 100%);
}

.bg-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
}

.blob-1 {
  width: min(600px, 90vw);
  aspect-ratio: 1;
  background: radial-gradient(circle, rgba(0, 123, 255, 0.1) 0%, transparent 70%);
  top: -150px;
  right: -100px;
}

.blob-2 {
  width: min(400px, 70vw);
  aspect-ratio: 1;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%);
  bottom: -100px;
  left: -80px;
}

/* ─── Badge ──────────────────────────────────── */
.badge-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(0, 123, 255, 0.08);
  border: 1px solid rgba(0, 123, 255, 0.18);
  color: #007bff;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: 100px;
  margin-bottom: 1.5rem;
}

.badge-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #007bff;
  animation: blink 1.8s ease-in-out infinite;
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}

/* ─── Sarlavha ───────────────────────────────── */
.headline {
  font-size: clamp(2.1rem, 5.5vw, 3.6rem);
  font-weight: 800;
  line-height: 1.12;
  color: #0f172a;
  margin-bottom: 1.25rem;
  letter-spacing: -0.02em;
  text-wrap: balance;
}

.headline-highlight {
  background: linear-gradient(135deg, #007bff 0%, #6366f1 60%, #06b6d4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subheadline {
  font-size: clamp(0.95rem, 2.2vw, 1.1rem);
  color: #64748b;
  line-height: 1.7;
  max-width: 480px;
  margin-bottom: 2rem;
  text-wrap: pretty;
}

/* ─── CTA ────────────────────────────────────── */
.cta-group {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  margin-bottom: 2.25rem;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0.85rem 1.6rem;
  min-height: 48px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.95rem;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease,
    border-color 0.2s ease;
  cursor: pointer;
}

.btn-primary {
  background: linear-gradient(135deg, #007bff 0%, #6366f1 100%);
  color: #fff;
  box-shadow: 0 4px 20px rgba(0, 123, 255, 0.32);
  border: none;
}

.btn-ghost {
  background: #fff;
  color: #374151;
  border: 1.5px solid #e2e8f0;
}

@media (hover: hover) {
  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(0, 123, 255, 0.42);
  }

  .btn-ghost:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
    transform: translateY(-2px);
  }
}

.btn:active {
  transform: translateY(0);
}

/* ─── Ishonch ko'rsatkichlari ────────────────── */
.trust-bar {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  margin: 0;
}

.trust-item {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

.trust-label {
  font-size: 0.72rem;
  color: #94a3b8;
  font-weight: 500;
  line-height: 1.3;
}

.trust-number {
  font-size: clamp(1rem, 2.6vw, 1.15rem);
  font-weight: 700;
  color: #0f172a;
  line-height: 1;
  margin: 0;
}

.trust-number--ok {
  color: #10b981;
}

/* ─── Dastur oynasi ──────────────────────────── */
.visual-col {
  position: relative;
  min-width: 0;
}

.app-window {
  background: #fff;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.1),
    0 4px 16px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transform: perspective(1200px) rotateY(-6deg) rotateX(3deg);
  transition: transform 0.5s ease;
}

@media (hover: hover) {
  .app-window:hover {
    transform: perspective(1200px) rotateY(-2deg) rotateX(1deg);
  }
}

.window-chrome {
  display: flex;
  align-items: center;
  padding: 10px 14px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  gap: 10px;
}

.chrome-dots {
  display: flex;
  gap: 5px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.dot-red {
  background: #ff5f57;
}
.dot-yellow {
  background: #ffbd2e;
}
.dot-green {
  background: #28ca40;
}

.chrome-title {
  flex: 1;
  text-align: center;
  font-size: 0.72rem;
  font-weight: 600;
  color: #94a3b8;
}

.window-body {
  display: flex;
  min-height: 340px;
}

/* Sidebar */
.win-sidebar {
  width: 44px;
  background: #0f172a;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 14px 0;
  gap: 14px;
  flex-shrink: 0;
}

.sidebar-logo {
  width: 24px;
  height: 24px;
  border-radius: 7px;
  background: linear-gradient(135deg, #007bff, #6366f1);
  margin-bottom: 6px;
}

.nav-dot {
  width: 20px;
  height: 6px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.12);
}

.nav-dot.is-active {
  background: rgba(96, 165, 250, 0.9);
}

/* Asosiy panel */
.win-main {
  flex: 1;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: #f8fafc;
  min-width: 0;
}

.kpi-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}

.kpi-card {
  background: #fff;
  border: 1px solid #f1f5f9;
  border-radius: 10px;
  padding: 9px 10px;
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

.kpi-label {
  font-size: 0.58rem;
  color: #94a3b8;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.kpi-value {
  font-size: 0.8rem;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.kpi-delta {
  font-size: 0.56rem;
  font-weight: 700;
}

.is-blue {
  color: #007bff;
}
.is-red {
  color: #ef4444;
}
.is-emerald {
  color: #10b981;
}

/* Grafik */
.chart-card {
  background: #fff;
  border: 1px solid #f1f5f9;
  border-radius: 10px;
  padding: 10px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 120px;
}

.chart-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.chart-title {
  font-size: 0.68rem;
  font-weight: 600;
  color: #374151;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chart-legend {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.58rem;
  color: #94a3b8;
  white-space: nowrap;
}

.legend-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #007bff;
}

.chart-bars {
  display: flex;
  align-items: flex-end;
  gap: 6px;
  flex: 1;
}

.bar-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  height: 100%;
  min-width: 0;
}

.bar {
  width: 100%;
  border-radius: 4px 4px 0 0;
  background: linear-gradient(180deg, rgba(0, 123, 255, 0.7), rgba(0, 123, 255, 0.28));
}

.bar.is-peak {
  background: linear-gradient(180deg, #007bff, rgba(0, 123, 255, 0.55));
}

.bar-label {
  font-size: 0.52rem;
  color: #94a3b8;
  font-weight: 500;
}

/* Top mahsulotlar */
.top-card {
  background: #fff;
  border: 1px solid #f1f5f9;
  border-radius: 10px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.top-title {
  font-size: 0.68rem;
  font-weight: 600;
  color: #374151;
}

.top-row {
  display: grid;
  grid-template-columns: 4.5rem 1fr;
  align-items: center;
  gap: 8px;
}

.top-name {
  font-size: 0.6rem;
  color: #64748b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.top-track {
  height: 6px;
  border-radius: 3px;
  background: #f1f5f9;
  overflow: hidden;
}

.top-fill {
  display: block;
  height: 100%;
  border-radius: 3px;
  background: linear-gradient(90deg, #007bff, #6366f1);
}

/* ─── Suzuvchi belgilar ──────────────────────── */
.float-badge {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 7px;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 8px 14px;
  font-size: 0.78rem;
  color: #374151;
  font-weight: 500;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  z-index: 20;
  white-space: nowrap;
}

.float-badge strong {
  color: #10b981;
}

.badge-growth {
  top: -12px;
  right: -10px;
  animation: floatY 3.5s ease-in-out infinite;
}

.badge-sale {
  bottom: 18px;
  left: -20px;
  animation: floatY 4s ease-in-out infinite reverse;
}

@keyframes floatY {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6px);
  }
}

.pulse-ring {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #007bff;
  position: relative;
  flex-shrink: 0;
}

.pulse-ring::after {
  content: '';
  position: absolute;
  inset: -3px;
  border-radius: 50%;
  border: 1.5px solid #007bff;
  animation: pulse 1.5s ease-out infinite;
}

@keyframes pulse {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(2.2);
  }
}

/* ─── Responsive ─────────────────────────────── */
@media (max-width: 900px) {
  .hero-container {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .subheadline {
    margin-left: auto;
    margin-right: auto;
  }

  .cta-group {
    justify-content: center;
  }

  .app-window {
    transform: none;
    max-width: 520px;
    margin: 0 auto;
  }

  .app-window:hover {
    transform: none;
  }

  .badge-growth {
    top: -10px;
    right: 0;
  }

  .badge-sale {
    left: 0;
  }
}

@media (max-width: 560px) {
  .cta-group {
    flex-direction: column;
    align-items: stretch;
    width: 100%;
  }

  .btn {
    width: 100%;
  }

  .trust-bar {
    padding: 0.9rem 1rem;
    gap: 0.5rem;
  }

  .trust-item {
    align-items: center;
    text-align: center;
  }

  /* Telefon ekranida oyna tik joylashadi: sidebar va suzuvchi belgilar ortiqcha */
  .win-sidebar,
  .float-badge {
    display: none;
  }

  .window-body {
    min-height: 0;
  }

  .win-main {
    padding: 10px;
    gap: 8px;
  }

  .kpi-row {
    grid-template-columns: 1fr;
    gap: 6px;
  }

  .kpi-card {
    flex-direction: row;
    align-items: baseline;
    justify-content: space-between;
    gap: 8px;
    padding: 8px 10px;
  }

  .kpi-label {
    font-size: 0.68rem;
  }

  .kpi-value {
    font-size: 0.88rem;
    margin-left: auto;
  }

  .kpi-delta {
    font-size: 0.66rem;
  }

  .chart-card {
    min-height: 132px;
  }

  .chart-title,
  .top-title {
    font-size: 0.75rem;
  }

  .bar-label {
    font-size: 0.6rem;
  }

  .top-name {
    font-size: 0.68rem;
  }

  .top-row {
    grid-template-columns: 5.5rem 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .badge-dot,
  .float-badge,
  .pulse-ring::after {
    animation: none;
  }

  .btn,
  .app-window {
    transition: none;
  }
}
</style>
