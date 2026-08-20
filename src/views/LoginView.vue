<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { login } from '@/services/api'
import { useNotification } from '@/composables/useNotification'
import { enterDashboard } from '@/composables/useAppLoader'
import { Eye, EyeOff } from 'lucide-vue-next'

const { t } = useI18n()
const router = useRouter()
const { showNotification } = useNotification()
const username = ref('')
const password = ref('')
const loading = ref(false)
const showPassword = ref(false)

const passwordToggleLabel = computed(() =>
  showPassword.value ? t('auth.hide_password') : t('auth.show_password'),
)

/* ── Brand panel animation: "The living ledger" ── */
const ledgerRows = [
  { amount: '24 000', method: 'NAQD' },
  { amount: '138 500', method: 'KARTA' },
  { amount: '9 200', method: 'CLICK' },
  { amount: '412 000', method: 'PAYME' },
  { amount: '56 800', method: 'KARTA' },
  { amount: '7 500', method: 'NAQD' },
  { amount: '230 000', method: 'KARTA' },
  { amount: '18 400', method: 'NAQD' },
]

const total = ref(12480000)
const panelHidden = ref(false)
const totalFmt = computed(() => String(total.value).replace(/\B(?=(\d{3})+(?!\d))/g, ' '))

/* Sparkline: a rolling window of cumulative totals — it climbs as sales come in */
const SPARK_POINTS = 10
/* viewBox is 224×52; the svg renders at 280×76, so overlays scale by these */
const SPARK_SCALE_X = 280 / 224
const SPARK_SCALE_Y = 76 / 52
const sparkHistory = ref(
  Array.from({ length: SPARK_POINTS }, (_, i) => total.value - (SPARK_POINTS - 1 - i) * 90000),
)

const sparkGeometry = computed(() => {
  const values = sparkHistory.value
  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = max - min || 1
  const points = values.map((v, i) => ({
    x: 2 + i * ((218 - 2) / (SPARK_POINTS - 1)),
    // 42 = baseline, 7 = ceiling; higher value sits higher on the chart
    y: 42 - ((v - min) / span) * (42 - 7),
  }))
  return {
    d: points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' '),
    last: points[points.length - 1],
  }
})

let ledgerTimer = null
let ledgerIndex = 0
const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

const tickLedger = () => {
  const row = ledgerRows[ledgerIndex++ % ledgerRows.length]
  total.value += Number(row.amount.replace(/\s/g, ''))
  sparkHistory.value = [...sparkHistory.value.slice(1), total.value]
}

const onVisibilityChange = () => {
  panelHidden.value = document.hidden
  if (document.hidden) {
    clearInterval(ledgerTimer)
    ledgerTimer = null
  } else if (!ledgerTimer && !prefersReducedMotion()) {
    ledgerTimer = setInterval(tickLedger, 1500)
  }
}

onMounted(() => {
  document.title = `CPOS - ${t('nav.login')}`
  if (!prefersReducedMotion()) ledgerTimer = setInterval(tickLedger, 1500)
  document.addEventListener('visibilitychange', onVisibilityChange)
})

onUnmounted(() => {
  clearInterval(ledgerTimer)
  ledgerTimer = null
  document.removeEventListener('visibilitychange', onVisibilityChange)
})

function getDeviceMac() {
  let mac = localStorage.getItem('deviceMac')
  if (!mac) {
    mac = 'WEB-' + crypto.randomUUID()
    localStorage.setItem('deviceMac', mac)
  }
  return mac
}

const handleLogin = async () => {
  loading.value = true
  try {
    const response = await login({
      username: username.value,
      password: password.value,
      deviceMac: getDeviceMac(),
    })
    const data = response.data
    if (data.success && data.data) {
      localStorage.setItem('username', data.data.username)
      localStorage.setItem('userId', data.data.userId)
      showNotification({ type: 'success', message: t('auth.login_success') })
      await enterDashboard(() => router.push('/dashboard'))
    } else {
      showNotification({ type: 'error', message: data.message || t('auth.login_error') })
    }
  } catch (error) {
    const msg = error.response?.data?.message || t('auth.login_error')
    showNotification({ type: 'error', message: msg })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="lp">
    <!-- ══════════════════════════════════════════
         LEFT  –  Brand panel
    ══════════════════════════════════════════ -->
    <aside class="brand-panel" :class="{ 'bp-paused': panelHidden }">
      <!-- Ambient layers -->
      <div class="bp-grid" aria-hidden="true"></div>
      <div class="bp-orb orb-1" aria-hidden="true"></div>
      <div class="bp-orb orb-2" aria-hidden="true"></div>
      <div class="bp-orb orb-3" aria-hidden="true"></div>

      <!-- beat 1: logo -->
      <div class="bp-head">
        <img src="/logo-footer.svg" alt="CPOS" class="bp-logo-img" />
      </div>

      <div class="bp-body">
        <div class="bp-comp">
          <!-- beat 2: the ledger stream -->
          <div class="bp-ledger" aria-hidden="true">
            <div
              v-for="(r, i) in ledgerRows"
              :key="i"
              class="bp-row"
              :style="{ '--sy': 448 - i * 68 + 'px', animationDelay: -1.5 * i + 's' }"
            >
              <div class="bp-row-l">
                <span class="bp-glyph" :style="{ animationDelay: -1.5 * i + 's' }">
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M2 6.4 4.6 9 10 3.4"
                      stroke="#34D399"
                      stroke-width="1.8"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </span>
                <span class="bp-amount">{{ r.amount }}</span>
              </div>
              <span class="bp-method">{{ r.method }}</span>
            </div>
          </div>

          <!-- beat 3: the anchor — running total + sparkline -->
          <div class="bp-total">
            <div class="bp-live"><span class="bp-live-dot" aria-hidden="true"></span>JONLI</div>
            <div class="bp-total-label">Bugungi savdo</div>
            <div class="bp-total-val">{{ totalFmt }}<span>so'm</span></div>
            <div class="bp-spark-wrap" aria-hidden="true">
              <svg width="280" height="76" viewBox="0 0 224 52" fill="none">
                <path
                  class="bp-spark"
                  :d="sparkGeometry.d"
                  stroke="url(#bpSpark)"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  fill="none"
                  stroke-dasharray="420"
                />
                <defs>
                  <linearGradient id="bpSpark" x1="0" y1="52" x2="224" y2="0">
                    <stop stop-color="#007BFF" />
                    <stop offset="1" stop-color="#34D399" />
                  </linearGradient>
                </defs>
              </svg>
              <span
                class="bp-spark-node"
                :style="{
                  left: sparkGeometry.last.x * SPARK_SCALE_X - 6 + 'px',
                  top: sparkGeometry.last.y * SPARK_SCALE_Y - 6 + 'px',
                }"
              ></span>
              <span
                class="bp-ring"
                :style="{
                  left: sparkGeometry.last.x * SPARK_SCALE_X - 10 + 'px',
                  top: sparkGeometry.last.y * SPARK_SCALE_Y - 10 + 'px',
                }"
              ></span>
            </div>
          </div>
        </div>
      </div>

      <!-- beat 4: copy -->
      <!-- Copy options: 1) "Har bir savdo hisobda"
                         2) "Biznesingiz jonli oqimda"
                         3) "Savdo oqimi to'xtamaydi" -->
      <div class="bp-copy">
        <h2>Har bir savdo hisobda</h2>
        <p>CPOS kunning har daqiqasida savdolaringizni yozib boradi.</p>
      </div>
    </aside>

    <!-- ══════════════════════════════════════════
         RIGHT  –  Form panel
    ══════════════════════════════════════════ -->
    <main class="form-panel">
      <!-- Mobile-only top bar -->
      <div class="mobile-bar">
        <img src="/logo-nav.svg" alt="CPOS" class="mobile-logo" />
      </div>

      <div class="form-wrap">
        <!-- Header -->
        <div class="fh">
          <div class="fh-eyebrow">
            <span class="fh-dot"></span>
            CPOS · Kabinet
          </div>
          <h1 class="fh-title">{{ t('auth.welcome_back') }}</h1>
          <p class="fh-sub">{{ t('auth.sign_in_subtitle') }}</p>
        </div>

        <!-- Form -->
        <form class="the-form" @submit.prevent="handleLogin" novalidate>
          <!-- Username -->
          <div class="fg">
            <label class="fg-label" for="un">{{ t('auth.username') }}</label>
            <div class="fg-input-wrap">
              <span class="fg-icon">
                <svg
                  width="15"
                  height="15"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  viewBox="0 0 24 24"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>
              <input
                id="un"
                type="text"
                v-model="username"
                name="username"
                autocomplete="username"
                class="fg-input"
                :placeholder="t('auth.username_placeholder')"
                required
                :disabled="loading"
              />
            </div>
          </div>

          <!-- Password -->
          <div class="fg">
            <div class="fg-label-row">
              <label class="fg-label" for="pw">{{ t('auth.password') }}</label>
              <button type="button" class="fg-forgot">{{ t('auth.forgot_password') }}</button>
            </div>
            <div class="fg-input-wrap">
              <span class="fg-icon">
                <svg
                  width="15"
                  height="15"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  viewBox="0 0 24 24"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </span>
              <input
                id="pw"
                :type="showPassword ? 'text' : 'password'"
                v-model="password"
                name="password"
                autocomplete="current-password"
                class="fg-input"
                placeholder="••••••••"
                required
                :disabled="loading"
              />
              <button
                type="button"
                class="fg-eye"
                :aria-label="passwordToggleLabel"
                :aria-pressed="showPassword"
                @click="showPassword = !showPassword"
              >
                <Eye v-if="showPassword" :size="17" :stroke-width="1.75" aria-hidden="true" />
                <EyeOff v-else :size="17" :stroke-width="1.75" aria-hidden="true" />
              </button>
            </div>
          </div>

          <!-- Submit -->
          <button type="submit" class="btn-submit" :disabled="loading">
            <span v-if="!loading" class="btn-inner">
              {{ t('auth.login_btn') }}
              <svg
                width="15"
                height="15"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                viewBox="0 0 24 24"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </span>
            <span v-else class="btn-loading">
              <span class="spinner"></span>
              {{ t('auth.logging_in') }}
            </span>
          </button>
        </form>

        <!-- Footer link -->
        <div class="ff">
          <router-link to="/" class="ff-back">
            <svg
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              viewBox="0 0 24 24"
            >
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            {{ t('auth.back_to_home') }}
          </router-link>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* ─────────────────────────────────────────────
   Root layout
───────────────────────────────────────────── */
.lp {
  display: flex;
  min-height: 100vh;
  /* svh follows mobile browser chrome; the page itself never scrolls */
  min-height: 100svh;
  height: 100svh;
  overflow: hidden;
  width: 100%;
  font-family: 'Poppins', sans-serif;
}

/* ─────────────────────────────────────────────
   Brand panel (left)
───────────────────────────────────────────── */
.brand-panel {
  position: relative;
  flex: 1.15;
  background: #080d1a;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: clamp(20px, 4.2vh, 56px) clamp(28px, 4vw, 56px) clamp(18px, 3.6vh, 48px);
  /* the panel is a container; the composition scales instead of reflowing */
  container-type: inline-size;
  container-name: brandpanel;
  /* ledger height drives both the mask and the rise keyframe */
  --ledger-h: clamp(240px, 52vh, 516px);
}

/* Dot-grid overlay */
.bp-grid {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, rgba(255, 255, 255, 0.06) 1px, transparent 1px);
  background-size: 28px 28px;
  z-index: 0;
}

/* Ambient orbs */
.bp-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  pointer-events: none;
  z-index: 0;
}

.orb-1 {
  width: 480px;
  height: 480px;
  background: radial-gradient(circle, rgba(0, 123, 255, 0.18) 0%, transparent 65%);
  top: -140px;
  right: -100px;
}

.orb-2 {
  width: 360px;
  height: 360px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.14) 0%, transparent 65%);
  bottom: -80px;
  left: -60px;
}

.orb-3 {
  width: 240px;
  height: 240px;
  background: radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 65%);
  top: 45%;
  left: 35%;
}

/* ─────────────────────────────────────────────
   Brand panel animation — "The living ledger"
───────────────────────────────────────────── */

/* beat 1: logo */
.bp-head {
  position: relative;
  z-index: 1;
  animation: bp-in 0.68s cubic-bezier(0.4, 0, 0.2, 1) both;
}

.bp-logo-img {
  height: clamp(48px, 8.5vh, 100px);
  display: block;
}

.bp-body {
  position: relative;
  z-index: 1;
  flex: 1;
  display: flex;
  align-items: center;
  margin-top: clamp(10px, 2.4vh, 26px);
  min-width: 0;
  min-height: 0;
}

.bp-comp {
  position: relative;
  display: flex;
  align-items: center;
  /* 300 (ledger) + 96 (gap) + 348 (total card) */
  width: 744px;
  flex: 0 0 744px;
  transform-origin: left center;
}

/* the composition needs 744px + 112px panel padding — scale it down below that */
@container brandpanel (max-width: 856px) {
  .bp-comp {
    transform: scale(0.86);
  }
}

@container brandpanel (max-width: 740px) {
  .bp-comp {
    transform: scale(0.72);
  }
}

@container brandpanel (max-width: 620px) {
  .bp-comp {
    transform: scale(0.58);
  }
}

/* short viewports: shrink the whole composition instead of overflowing */
@media (max-height: 860px) {
  .bp-comp {
    transform: scale(0.88);
  }
}

@media (max-height: 760px) {
  .bp-comp {
    transform: scale(0.78);
  }
}

@media (max-height: 660px) {
  .bp-comp {
    transform: scale(0.66);
  }
}

/* beat 2: the stream */
.bp-ledger {
  position: relative;
  width: 300px;
  flex: 0 0 300px;
  height: var(--ledger-h);
  overflow: hidden;
  animation: bp-in-soft 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.12s both;
  -webkit-mask-image: linear-gradient(to top, transparent 0%, #000 16%, #000 78%, transparent 100%);
  mask-image: linear-gradient(to top, transparent 0%, #000 16%, #000 78%, transparent 100%);
}

.bp-row {
  position: absolute;
  inset: 0 0 auto 0;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  border-radius: 12px;
  white-space: nowrap;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  animation: bp-rise 12s linear infinite;
  will-change: transform;
}

.bp-row-l {
  display: flex;
  align-items: center;
  gap: 12px;
}

.bp-glyph {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(16, 185, 129, 0.14);
  border: 1px solid rgba(52, 211, 153, 0.35);
  animation: bp-glyph 12s ease-in-out infinite;
}

.bp-amount {
  font-size: 15px;
  font-weight: 600;
  color: #f1f5f9;
}

.bp-method {
  font-size: 12px;
  font-weight: 500;
  color: #64748b;
  letter-spacing: 0.04em;
}

/* beat 3: the anchor */
.bp-total {
  position: relative;
  z-index: 2;
  margin-left: 96px;
  width: 348px;
  flex: 0 0 348px;
  box-sizing: border-box;
  min-width: 0;
  padding: clamp(22px, 3vh, 34px) clamp(22px, 2.2vw, 34px) clamp(20px, 2.6vh, 30px);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  animation: bp-in 0.72s cubic-bezier(0.4, 0, 0.2, 1) 0.24s both;
}

.bp-live {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: clamp(12px, 2vh, 20px);
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
  letter-spacing: 0.12em;
}

.bp-live-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #34d399;
  animation: bp-breathe 4s ease-in-out infinite;
}

.bp-total-label {
  font-size: 14px;
  font-weight: 500;
  color: #94a3b8;
  margin-bottom: 8px;
}

.bp-total-val {
  font-size: clamp(30px, 4.2vh, 42px);
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #f1f5f9;
}

.bp-total-val span {
  margin-left: 8px;
  font-size: 17px;
  font-weight: 500;
  color: #64748b;
}

.bp-spark-wrap {
  position: relative;
  margin-top: clamp(12px, 2.2vh, 22px);
  height: 76px;
}

.bp-spark {
  animation: bp-draw 1.1s cubic-bezier(0.4, 0, 0.2, 1) 0.5s both;
  /* the line reshapes as new sales land */
  transition: d 1.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.bp-spark-node {
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #34d399;
  animation: bp-in-soft 0.5s ease-out 1.5s both;
  transition:
    left 1.2s cubic-bezier(0.4, 0, 0.2, 1),
    top 1.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.bp-ring {
  position: absolute;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1px solid rgba(52, 211, 153, 0.7);
  animation: bp-ring 6s ease-in-out 1.8s infinite;
  transition:
    left 1.2s cubic-bezier(0.4, 0, 0.2, 1),
    top 1.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* beat 4: copy */
.bp-copy {
  position: relative;
  z-index: 1;
  max-width: 460px;
  animation: bp-in 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.36s both;
}

.bp-copy h2 {
  margin: 0 0 clamp(6px, 1vh, 10px);
  font-size: clamp(22px, 3.4vh, 34px);
  line-height: 1.18;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #f1f5f9;
  text-wrap: pretty;
}

.bp-copy p {
  margin: 0;
  font-size: 15px;
  line-height: 1.6;
  font-weight: 500;
  color: #94a3b8;
  text-wrap: pretty;
}

@keyframes bp-in {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bp-in-soft {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes bp-rise {
  0% {
    transform: translateY(var(--ledger-h, 516px));
    opacity: 0;
  }
  7% {
    opacity: 1;
  }
  82% {
    opacity: 1;
  }
  100% {
    transform: translateY(-84px);
    opacity: 0;
  }
}

@keyframes bp-glyph {
  0%,
  5% {
    opacity: 0;
    transform: scale(0.72);
  }
  13%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes bp-ring {
  0% {
    transform: scale(0.6);
    opacity: 0.55;
  }
  70%,
  100% {
    transform: scale(2.6);
    opacity: 0;
  }
}

@keyframes bp-draw {
  from {
    stroke-dashoffset: 420;
  }
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes bp-breathe {
  0%,
  100% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
}

/* idle tab costs nothing */
.bp-paused,
.bp-paused * {
  animation-play-state: paused !important;
}

/* accessibility: static, complete composition */
@media (prefers-reduced-motion: reduce) {
  .brand-panel,
  .brand-panel * {
    animation: none !important;
    transition: none !important;
  }
  .bp-row {
    transform: translateY(var(--sy)) !important;
    opacity: 1 !important;
  }
  .bp-glyph {
    opacity: 1 !important;
    transform: none !important;
  }
  .bp-spark {
    stroke-dashoffset: 0 !important;
  }
  .bp-ring {
    opacity: 0 !important;
  }
}

/* ─────────────────────────────────────────────
   Form panel (right)
───────────────────────────────────────────── */
.form-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fff;
  padding: clamp(1rem, 3.5vh, 2.5rem) clamp(1.25rem, 3vw, 2rem);
  position: relative;
  min-height: 0;
  /* if a very short viewport still can't fit the form, scroll here — not the page */
  overflow-y: auto;
}

/* Mobile top bar (hidden on desktop) */
.mobile-bar {
  display: none;
  width: 100%;
  margin-bottom: 2.5rem;
  justify-content: center;
}

.mobile-logo {
  height: 40px;
  width: auto;
}

/* Main form wrapper */
.form-wrap {
  width: 100%;
  max-width: 380px;
}

/* ── Form header ── */
.fh {
  margin-bottom: clamp(1.25rem, 3.5vh, 2.5rem);
}

.fh-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #94a3b8;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-bottom: clamp(0.5rem, 1.4vh, 1rem);
}

.fh-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #007bff;
}

.fh-title {
  font-size: clamp(1.5rem, 3.4vh, 2rem);
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.035em;
  line-height: 1.15;
  margin-bottom: 0.5rem;
}

.fh-sub {
  font-size: 0.9rem;
  color: #94a3b8;
  line-height: 1.5;
}

/* ── Form fields ── */
.the-form {
  display: flex;
  flex-direction: column;
  gap: clamp(0.7rem, 1.6vh, 1.1rem);
}

.fg {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.fg-label {
  font-size: 0.82rem;
  font-weight: 600;
  color: #374151;
  letter-spacing: 0.01em;
}

.fg-label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.fg-forgot {
  background: none;
  border: none;
  padding: 0;
  font-size: 0.78rem;
  font-weight: 600;
  color: #007bff;
  cursor: pointer;
  transition: color 0.2s;
}

.fg-forgot:hover {
  color: #0056b3;
}

/* Input wrapper */
.fg-input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.fg-icon {
  position: absolute;
  left: 14px;
  color: #cbd5e1;
  display: flex;
  align-items: center;
  pointer-events: none;
  z-index: 1;
  transition: color 0.2s;
}

.fg-input {
  width: 100%;
  padding: 0.78rem 1rem 0.78rem 2.7rem;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.9rem;
  font-family: inherit;
  background: #f8fafc;
  color: #0f172a;
  outline: none;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
}

.fg-input::placeholder {
  color: #cbd5e1;
  letter-spacing: 0.01em;
}

/* Focus: shift icon color + ring */
.fg-input-wrap:focus-within .fg-icon {
  color: #007bff;
}

.fg-input:hover:not(:focus):not(:disabled) {
  border-color: #cbd5e1;
}

.fg-input:focus {
  border-color: #007bff;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.fg-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Eye toggle */
.fg-eye {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  color: #94a3b8;
  display: flex;
  align-items: center;
  padding: 5px;
  border-radius: 6px;
  transition:
    color 0.2s,
    background 0.15s;
  line-height: 1;
}

.fg-eye:hover {
  color: #475569;
  background: rgba(0, 0, 0, 0.04);
}

.fg-eye:focus-visible {
  outline: 2px solid #007bff;
  outline-offset: 1px;
}

/* ── Submit ── */
.btn-submit {
  width: 100%;
  padding: 0.88rem 1.25rem;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, #007bff 0%, #4f67f5 60%, #6366f1 100%);
  color: #fff;
  font-size: 0.95rem;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    opacity 0.2s;
  box-shadow:
    0 4px 18px rgba(0, 123, 255, 0.32),
    0 1px 4px rgba(0, 0, 0, 0.08);
  margin-top: 0.4rem;
  letter-spacing: 0.01em;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow:
    0 8px 26px rgba(0, 123, 255, 0.4),
    0 2px 8px rgba(0, 0, 0, 0.08);
}

.btn-submit:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.25);
}

.btn-submit:disabled {
  opacity: 0.65;
  cursor: not-allowed;
  transform: none;
}

.btn-submit:focus-visible {
  outline: 2px solid #007bff;
  outline-offset: 3px;
}

.btn-inner {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-loading {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.spinner {
  width: 15px;
  height: 15px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.65s linear infinite;
  flex-shrink: 0;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ── Form footer ── */
.ff {
  margin-top: clamp(1rem, 2.8vh, 2rem);
  padding-top: clamp(0.85rem, 2vh, 1.5rem);
  border-top: 1px solid #f1f5f9;
  text-align: center;
}

.ff-back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #94a3b8;
  font-size: 0.82rem;
  font-weight: 500;
  text-decoration: none;
  transition:
    color 0.2s ease,
    gap 0.2s ease;
}

.ff-back:hover {
  color: #475569;
  gap: 9px;
}

/* ─────────────────────────────────────────────
   Responsive
───────────────────────────────────────────── */
@media (max-width: 960px) {
  .brand-panel {
    display: none;
  }

  .form-panel {
    background: linear-gradient(155deg, #eef4ff 0%, #f8faff 60%, #edf2ff 100%);
    justify-content: center;
    padding: 1.5rem 1.25rem;
  }

  .mobile-bar {
    display: flex;
    margin-bottom: clamp(1rem, 3vh, 2.5rem);
  }

  .form-wrap {
    max-width: 420px;
    margin: 0 auto;
  }
}

@media (max-width: 480px) {
  .form-panel {
    padding: 1.25rem 1rem;
  }
}

/* very short viewports (landscape phones): let the form scroll inside its panel */
@media (max-height: 560px) {
  .form-panel {
    justify-content: flex-start;
  }
}
</style>
