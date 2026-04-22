<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { goToHomeSection } from '@/composables/useHomeSectionNav'
import VideoPlayer from './VideoPlayer.vue'

const { t } = useI18n()
const router = useRouter()
const isVideoOpen = ref(false)

const goContact = () => goToHomeSection(router, 'contact')
</script>

<template>
  <section class="hero">
    <!-- Background decorations -->
    <div class="bg-grid"></div>
    <div class="bg-blob blob-1"></div>
    <div class="bg-blob blob-2"></div>
    <div class="bg-blob blob-3"></div>

    <div class="hero-container">
      <!-- Left: Text Content -->
      <div class="text-col">
        <div class="badge-pill">
          <span class="badge-dot"></span>
          Yangi · v1.2 chiqdi
        </div>

        <h1 class="headline">
          {{ t('hero.title_prefix') }}<br />
          <span class="headline-highlight">{{ t('hero.title_highlight') }}</span>
        </h1>

        <p class="subheadline">{{ t('hero.subtitle') }}</p>

        <div class="cta-group">
          <a href="/" @click.prevent="goContact" class="btn-primary-wrap">
            <button type="button" class="btn btn-primary">
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
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </a>
          <button class="btn btn-ghost" @click="isVideoOpen = true">
            <span class="play-icon">
              <svg width="12" height="14" viewBox="0 0 12 14" fill="currentColor">
                <path d="M1.5 1.5l9 5.5-9 5.5V1.5z" />
              </svg>
            </span>
            {{ t('hero.watch_demo') }}
          </button>
        </div>

        <!-- Trust bar -->
        <div class="trust-bar">
          <div class="trust-item">
            <span class="trust-number">2,400+</span>
            <span class="trust-label">Faol bizneslar</span>
          </div>
          <div class="trust-divider"></div>
          <div class="trust-item">
            <div class="stars">
              <svg
                v-for="i in 5"
                :key="i"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="#FBBF24"
              >
                <path
                  d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                />
              </svg>
            </div>
            <span class="trust-label">4.9 reyting</span>
          </div>
          <div class="trust-divider"></div>
          <div class="trust-item">
            <span class="trust-number uptime">99.9%</span>
            <span class="trust-label">Ish vaqti</span>
          </div>
        </div>
      </div>

      <!-- Right: Dashboard Visual -->
      <div class="visual-col">
        <!-- Floating badge top-right -->
        <div class="float-badge badge-top">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#10B981"
            stroke-width="2.5"
          >
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
            <polyline points="17 6 23 6 23 12" />
          </svg>
          <span>Bugungi daromad <strong>+24%</strong></span>
        </div>

        <!-- Dashboard window -->
        <div class="dashboard-window">
          <!-- Window chrome -->
          <div class="window-chrome">
            <div class="chrome-dots">
              <span class="dot red"></span>
              <span class="dot yellow"></span>
              <span class="dot green"></span>
            </div>
            <div class="chrome-title">CPOS Dashboard</div>
            <div class="chrome-actions">
              <span class="chrome-btn"></span>
              <span class="chrome-btn"></span>
            </div>
          </div>

          <!-- Window body -->
          <div class="window-body">
            <!-- Sidebar -->
            <div class="win-sidebar">
              <div class="sidebar-logo">
                <span class="logo-dot"></span>
              </div>
              <div class="sidebar-nav">
                <div class="nav-item active">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                  </svg>
                </div>
                <div class="nav-item">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <line x1="12" y1="1" x2="12" y2="23" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
                <div class="nav-item">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                </div>
                <div class="nav-item">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
              </div>
            </div>

            <!-- Main content -->
            <div class="win-main">
              <!-- KPI Cards -->
              <div class="kpi-row">
                <div class="kpi-card">
                  <div class="kpi-icon revenue">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.5"
                    >
                      <line x1="12" y1="1" x2="12" y2="23" />
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </div>
                  <div class="kpi-info">
                    <span class="kpi-label">Daromad</span>
                    <span class="kpi-value">4.28M</span>
                  </div>
                  <span class="kpi-badge up">↑ 12%</span>
                </div>
                <div class="kpi-card">
                  <div class="kpi-icon orders">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.5"
                    >
                      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                      <line x1="3" y1="6" x2="21" y2="6" />
                      <path d="M16 10a4 4 0 0 1-8 0" />
                    </svg>
                  </div>
                  <div class="kpi-info">
                    <span class="kpi-label">Buyurtmalar</span>
                    <span class="kpi-value">184</span>
                  </div>
                  <span class="kpi-badge up">↑ 8%</span>
                </div>
                <div class="kpi-card">
                  <div class="kpi-icon customers">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.5"
                    >
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                    </svg>
                  </div>
                  <div class="kpi-info">
                    <span class="kpi-label">Mijozlar</span>
                    <span class="kpi-value">1,240</span>
                  </div>
                  <span class="kpi-badge up">↑ 5%</span>
                </div>
              </div>

              <!-- Chart area -->
              <div class="chart-area">
                <div class="chart-header">
                  <span class="chart-title">Haftalik sotuvlar</span>
                  <div class="chart-legend">
                    <span class="legend-dot primary"></span><span>Daromad</span>
                  </div>
                </div>
                <div class="chart-bars">
                  <div class="bar-group">
                    <div class="bar" style="height: 45%"></div>
                    <span class="bar-label">Du</span>
                  </div>
                  <div class="bar-group">
                    <div class="bar" style="height: 65%"></div>
                    <span class="bar-label">Se</span>
                  </div>
                  <div class="bar-group">
                    <div class="bar" style="height: 50%"></div>
                    <span class="bar-label">Ch</span>
                  </div>
                  <div class="bar-group">
                    <div class="bar" style="height: 80%"></div>
                    <span class="bar-label">Pa</span>
                  </div>
                  <div class="bar-group">
                    <div class="bar highlight-bar" style="height: 95%"></div>
                    <span class="bar-label">Ju</span>
                  </div>
                  <div class="bar-group">
                    <div class="bar" style="height: 70%"></div>
                    <span class="bar-label">Sh</span>
                  </div>
                  <div class="bar-group">
                    <div class="bar" style="height: 40%"></div>
                    <span class="bar-label">Ya</span>
                  </div>
                </div>
              </div>

              <!-- Recent transactions mini list -->
              <div class="mini-list">
                <div
                  class="mini-row"
                  v-for="item in [
                    { name: 'Dona non', cat: 'Oziq-ovqat', amount: '12,500', status: 'paid' },
                    { name: 'Kofe latte', cat: 'Ichimlik', amount: '18,000', status: 'paid' },
                    { name: 'T-shirt L', cat: 'Kiyim', amount: '85,000', status: 'pending' },
                  ]"
                  :key="item.name"
                >
                  <div class="mini-avatar"></div>
                  <div class="mini-info">
                    <span class="mini-name">{{ item.name }}</span>
                    <span class="mini-cat">{{ item.cat }}</span>
                  </div>
                  <span class="mini-amount">{{ item.amount }} UZS</span>
                  <span class="mini-status" :class="item.status">{{
                    item.status === 'paid' ? '✓' : '…'
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Floating badge bottom-left -->
        <div class="float-badge badge-bottom">
          <span class="pulse-ring"></span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#007BFF"
            stroke-width="2.5"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>Buyurtma qabul qilindi</span>
        </div>
      </div>
    </div>

    <VideoPlayer :isOpen="isVideoOpen" @close="isVideoOpen = false" />
  </section>
</template>

<style scoped>
/* ─── Layout ─────────────────────────────────── */
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 7rem 0 5rem;
  overflow: hidden;
  background: #fff;
}

.hero-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5rem;
  align-items: center;
  position: relative;
  z-index: 10;
}

/* ─── Background ─────────────────────────────── */
.bg-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(0, 123, 255, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 123, 255, 0.04) 1px, transparent 1px);
  background-size: 40px 40px;
  z-index: 0;
}

.bg-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  z-index: 0;
  pointer-events: none;
}

.blob-1 {
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(0, 123, 255, 0.1) 0%, transparent 70%);
  top: -150px;
  right: -100px;
}

.blob-2 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%);
  bottom: -100px;
  left: -80px;
}

.blob-3 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(16, 185, 129, 0.06) 0%, transparent 70%);
  top: 40%;
  left: 40%;
}

/* ─── Badge pill ─────────────────────────────── */
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
  letter-spacing: 0.01em;
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

/* ─── Headline ───────────────────────────────── */
.headline {
  font-size: clamp(2.6rem, 4.5vw, 3.8rem);
  font-weight: 800;
  line-height: 1.1;
  color: #0f172a;
  margin-bottom: 1.5rem;
  letter-spacing: -0.02em;
}

.headline-highlight {
  background: linear-gradient(135deg, #007bff 0%, #6366f1 60%, #06b6d4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ─── Subheadline ────────────────────────────── */
.subheadline {
  font-size: 1.1rem;
  color: #64748b;
  line-height: 1.75;
  max-width: 460px;
  margin-bottom: 2.5rem;
}

/* ─── CTA group ──────────────────────────────── */
.cta-group {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
}

.btn-primary-wrap {
  display: contents;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0.85rem 1.75rem;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.25s ease;
  cursor: pointer;
  white-space: nowrap;
}

.btn-primary {
  background: linear-gradient(135deg, #007bff 0%, #6366f1 100%);
  color: #fff;
  box-shadow: 0 4px 20px rgba(0, 123, 255, 0.35);
  border: none;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(0, 123, 255, 0.45);
}

.btn-ghost {
  background: transparent;
  color: #374151;
  border: 1.5px solid #e2e8f0;
  font-size: 0.95rem;
}

.btn-ghost:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
  transform: translateY(-2px);
}

.play-icon {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, #007bff, #6366f1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
}

/* ─── Trust bar ──────────────────────────────── */
.trust-bar {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1rem 1.25rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  width: fit-content;
}

.trust-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.trust-number {
  font-size: 1.1rem;
  font-weight: 700;
  color: #0f172a;
  line-height: 1;
}

.trust-number.uptime {
  color: #10b981;
}

.trust-label {
  font-size: 0.72rem;
  color: #94a3b8;
  font-weight: 500;
}

.stars {
  display: flex;
  gap: 1px;
}

.trust-divider {
  width: 1px;
  height: 32px;
  background: #e2e8f0;
}

/* ─── Visual column ──────────────────────────── */
.visual-col {
  position: relative;
}

/* ─── Floating badges ────────────────────────── */
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

.badge-top {
  top: -12px;
  right: -10px;
  animation: floatUp 3.5s ease-in-out infinite;
}

.badge-bottom {
  bottom: 16px;
  left: -20px;
  animation: floatDown 4s ease-in-out infinite;
}

.float-badge strong {
  color: #10b981;
}

@keyframes floatUp {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6px);
  }
}

@keyframes floatDown {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(6px);
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

/* ─── Dashboard window ───────────────────────── */
.dashboard-window {
  background: #fff;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  box-shadow:
    0 0 0 1px rgba(0, 0, 0, 0.03),
    0 20px 60px rgba(0, 0, 0, 0.1),
    0 4px 16px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  transform: perspective(1200px) rotateY(-6deg) rotateX(3deg);
  transition: transform 0.5s ease;
}

.dashboard-window:hover {
  transform: perspective(1200px) rotateY(-2deg) rotateX(1deg);
}

/* Chrome bar */
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

.dot.red {
  background: #ff5f57;
}
.dot.yellow {
  background: #ffbd2e;
}
.dot.green {
  background: #28ca40;
}

.chrome-title {
  flex: 1;
  text-align: center;
  font-size: 0.72rem;
  font-weight: 600;
  color: #94a3b8;
}

.chrome-actions {
  display: flex;
  gap: 6px;
}

.chrome-btn {
  width: 22px;
  height: 8px;
  border-radius: 4px;
  background: #e2e8f0;
}

/* Window body */
.window-body {
  display: flex;
  height: 330px;
}

/* Sidebar */
.win-sidebar {
  width: 48px;
  background: #0f172a;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 14px 0;
  gap: 20px;
  flex-shrink: 0;
}

.sidebar-logo {
  width: 26px;
  height: 26px;
  background: linear-gradient(135deg, #007bff, #6366f1);
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}

.logo-dot {
  width: 8px;
  height: 8px;
  background: #fff;
  border-radius: 50%;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.nav-item {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.nav-item.active {
  background: rgba(0, 123, 255, 0.18);
  color: #60a5fa;
}

/* Main panel */
.win-main {
  flex: 1;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow: hidden;
  background: #f8fafc;
}

/* KPI row */
.kpi-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.kpi-card {
  background: #fff;
  border-radius: 10px;
  padding: 10px;
  display: flex;
  align-items: center;
  gap: 7px;
  border: 1px solid #f1f5f9;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}

.kpi-icon {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.kpi-icon.revenue {
  background: rgba(0, 123, 255, 0.1);
  color: #007bff;
}
.kpi-icon.orders {
  background: rgba(99, 102, 241, 0.1);
  color: #6366f1;
}
.kpi-icon.customers {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.kpi-info {
  display: flex;
  flex-direction: column;
  gap: 1px;
  flex: 1;
  min-width: 0;
}

.kpi-label {
  font-size: 0.6rem;
  color: #94a3b8;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.kpi-value {
  font-size: 0.82rem;
  font-weight: 700;
  color: #0f172a;
  line-height: 1;
}

.kpi-badge {
  font-size: 0.58rem;
  font-weight: 700;
  padding: 2px 5px;
  border-radius: 5px;
  flex-shrink: 0;
}

.kpi-badge.up {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

/* Chart area */
.chart-area {
  background: #fff;
  border-radius: 10px;
  padding: 10px;
  flex: 1;
  border: 1px solid #f1f5f9;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.chart-title {
  font-size: 0.7rem;
  font-weight: 600;
  color: #374151;
}

.chart-legend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.6rem;
  color: #94a3b8;
}

.legend-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.legend-dot.primary {
  background: #007bff;
}

.chart-bars {
  display: flex;
  align-items: flex-end;
  gap: 6px;
  flex: 1;
  padding-bottom: 4px;
}

.bar-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  height: 100%;
  justify-content: flex-end;
}

.bar {
  width: 100%;
  background: linear-gradient(180deg, rgba(0, 123, 255, 0.7) 0%, rgba(0, 123, 255, 0.3) 100%);
  border-radius: 4px 4px 0 0;
}

.bar.highlight-bar {
  background: linear-gradient(180deg, #007bff 0%, rgba(0, 123, 255, 0.6) 100%);
  box-shadow: 0 0 8px rgba(0, 123, 255, 0.35);
}

.bar-label {
  font-size: 0.55rem;
  color: #94a3b8;
  font-weight: 500;
}

/* Mini list */
.mini-list {
  background: #fff;
  border-radius: 10px;
  border: 1px solid #f1f5f9;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}

.mini-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 10px;
  border-bottom: 1px solid #f8fafc;
}

.mini-row:last-child {
  border-bottom: none;
}

.mini-avatar {
  width: 22px;
  height: 22px;
  border-radius: 6px;
  background: linear-gradient(135deg, #e0effe, #c7d7fd);
  flex-shrink: 0;
}

.mini-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}

.mini-name {
  font-size: 0.65rem;
  font-weight: 600;
  color: #1e293b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mini-cat {
  font-size: 0.58rem;
  color: #94a3b8;
}

.mini-amount {
  font-size: 0.65rem;
  font-weight: 600;
  color: #374151;
  white-space: nowrap;
}

.mini-status {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6rem;
  font-weight: 700;
  flex-shrink: 0;
}

.mini-status.paid {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}
.mini-status.pending {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

/* ─── Responsive ─────────────────────────────── */
@media (max-width: 1024px) {
  .hero-container {
    gap: 3.5rem;
  }
}

@media (max-width: 860px) {
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

  .trust-bar {
    margin: 0 auto;
  }

  .badge-pill {
    display: inline-flex;
    margin-left: auto;
    margin-right: auto;
  }

  .dashboard-window {
    transform: none;
    max-width: 520px;
    margin: 0 auto;
  }

  .dashboard-window:hover {
    transform: none;
  }

  .badge-top {
    top: -10px;
    right: 0;
  }
  .badge-bottom {
    left: 0;
  }
}

@media (max-width: 520px) {
  .hero {
    padding: 5.5rem 0 4rem;
  }

  .headline {
    font-size: 2.3rem;
  }

  .window-body {
    height: 270px;
  }

  .float-badge {
    display: none;
  }

  .cta-group {
    flex-direction: column;
    width: 100%;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
