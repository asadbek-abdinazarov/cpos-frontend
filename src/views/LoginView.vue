<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { login, persistAuthTokensFromResponse } from '@/services/api'
import { useNotification } from '@/composables/useNotification'
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

onMounted(() => {
  document.title = `CPOS - ${t('nav.login')}`
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
      persistAuthTokensFromResponse(data)
      localStorage.setItem('username', data.data.username)
      localStorage.setItem('userId', data.data.userId)
      showNotification({ type: 'success', message: t('auth.login_success') })
      router.push('/dashboard')
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
    <aside class="brand-panel">
      <!-- Ambient layers -->
      <div class="bp-grid"></div>
      <div class="bp-orb orb-1"></div>
      <div class="bp-orb orb-2"></div>
      <div class="bp-orb orb-3"></div>

      <div class="bp-inner">

        <!-- Top logo -->
        <div class="bp-logo">
          <img src="/logo-footer.svg" alt="CPOS" />
        </div>

        <!-- Central visual: stat cards + glow orb -->
        <div class="bp-visual">
          <div class="orb-center"></div>

          <!-- Stat cards -->
          <div class="stat-card sc-1">
            <div class="sc-icon sc-blue">
              <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </div>
            <div class="sc-body">
              <span class="sc-val">1,240</span>
              <span class="sc-lbl">Faol do'konlar</span>
            </div>
            <span class="sc-trend up">↑ 12%</span>
          </div>

          <div class="stat-card sc-2">
            <div class="sc-icon sc-green">
              <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
            </div>
            <div class="sc-body">
              <span class="sc-val">4.28M</span>
              <span class="sc-lbl">Bugungi daromad</span>
            </div>
            <span class="sc-trend up">↑ 24%</span>
          </div>

          <div class="stat-card sc-3">
            <div class="sc-icon sc-purple">
              <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
            <div class="sc-body">
              <span class="sc-val">5M+</span>
              <span class="sc-lbl">Tranzaksiyalar</span>
            </div>
            <span class="sc-trend up">↑ 8%</span>
          </div>

          <!-- Live indicator -->
          <div class="live-pill">
            <span class="live-dot"></span>
            Tizim ishlayapti · 99.9%
          </div>
        </div>

        <!-- Bottom quote -->
        <div class="bp-quote">
          <svg class="quote-mark" width="32" height="24" viewBox="0 0 32 24" fill="none">
            <path d="M0 24V14.4C0 6.4 4.8 1.6 14.4 0l1.6 2.4C10.4 3.6 7.6 6.4 7.2 10.4H14.4V24H0ZM17.6 24V14.4C17.6 6.4 22.4 1.6 32 0l1.6 2.4C28 3.6 25.2 6.4 24.8 10.4H32V24H17.6Z" fill="currentColor" opacity=".18"/>
          </svg>
          <p class="quote-text">CPOS bilan ishlash juda oson. Xodimlarim 15 daqiqada o'rganib olishdi.</p>
          <div class="quote-author">
            <div class="qa-avatar">A</div>
            <div>
              <div class="qa-name">Azizbek T.</div>
              <div class="qa-biz">Kiyim do'koni, Toshkent</div>
            </div>
          </div>
        </div>

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
                <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
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
                <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
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
                <Eye   v-if="showPassword" :size="17" :stroke-width="1.75" aria-hidden="true" />
                <EyeOff v-else             :size="17" :stroke-width="1.75" aria-hidden="true" />
              </button>
            </div>
          </div>

          <!-- Submit -->
          <button type="submit" class="btn-submit" :disabled="loading">
            <span v-if="!loading" class="btn-inner">
              {{ t('auth.login_btn') }}
              <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
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
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
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
  width: 100%;
  font-family: 'Poppins', sans-serif;
}

/* ─────────────────────────────────────────────
   Brand panel (left)
───────────────────────────────────────────── */
.brand-panel {
  position: relative;
  flex: 1.15;
  background: #080D1A;
  overflow: hidden;
  display: flex;
}

/* Dot-grid overlay */
.bp-grid {
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px);
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
  width: 480px; height: 480px;
  background: radial-gradient(circle, rgba(0,123,255,0.18) 0%, transparent 65%);
  top: -140px; right: -100px;
}

.orb-2 {
  width: 360px; height: 360px;
  background: radial-gradient(circle, rgba(99,102,241,0.14) 0%, transparent 65%);
  bottom: -80px; left: -60px;
}

.orb-3 {
  width: 240px; height: 240px;
  background: radial-gradient(circle, rgba(16,185,129,0.10) 0%, transparent 65%);
  top: 45%; left: 35%;
}

/* Inner scaffold */
.bp-inner {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 2.75rem 3.5rem;
  gap: 0;
}

/* Logo row */
.bp-logo {
  flex-shrink: 0;
  margin-bottom: 2.5rem;
}

.bp-logo img {
  height: 48px;
  width: auto;
  display: block;
}

/* ── Central visual area ── */
.bp-visual {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 0;
}

/* Central glow orb (decorative) */
.orb-center {
  width: 280px;
  height: 280px;
  border-radius: 50%;
  background: radial-gradient(circle at 40% 40%,
    rgba(0,123,255,0.18) 0%,
    rgba(99,102,241,0.10) 50%,
    transparent 70%
  );
  border: 1px solid rgba(0,123,255,0.12);
  flex-shrink: 0;
  position: relative;
}

.orb-center::before {
  content: '';
  position: absolute;
  inset: 16px;
  border-radius: 50%;
  border: 1px solid rgba(0,123,255,0.08);
}

.orb-center::after {
  content: '';
  position: absolute;
  inset: 36px;
  border-radius: 50%;
  border: 1px solid rgba(0,123,255,0.05);
}

/* ── Stat cards ── */
.stat-card {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.10);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 14px;
  padding: 12px 16px;
  white-space: nowrap;
}

/* Positioned around the orb */
.sc-1 {
  top: 12%;
  left: -5%;
  animation: float-a 5s ease-in-out infinite;
}

.sc-2 {
  bottom: 18%;
  right: -8%;
  animation: float-b 4.5s ease-in-out infinite;
}

.sc-3 {
  bottom: 5%;
  left: 5%;
  animation: float-a 6s ease-in-out infinite 0.8s;
}

@keyframes float-a {
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-9px); }
}

@keyframes float-b {
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(9px); }
}

.sc-icon {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.sc-blue   { background: rgba(0,  123,255,0.18); color: #60A5FA; }
.sc-green  { background: rgba(16, 185,129,0.18); color: #34D399; }
.sc-purple { background: rgba(99, 102,241,0.18); color: #A5B4FC; }

.sc-body {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.sc-val {
  font-size: 1rem;
  font-weight: 700;
  color: #F1F5F9;
  line-height: 1.1;
}

.sc-lbl {
  font-size: 0.7rem;
  color: #64748B;
  font-weight: 500;
}

.sc-trend {
  font-size: 0.68rem;
  font-weight: 700;
  padding: 3px 7px;
  border-radius: 100px;
}

.sc-trend.up {
  background: rgba(16,185,129,0.12);
  color: #34D399;
}

/* Live pill */
.live-pill {
  position: absolute;
  top: 8%;
  right: 0%;
  display: flex;
  align-items: center;
  gap: 7px;
  background: rgba(16,185,129,0.08);
  border: 1px solid rgba(16,185,129,0.2);
  border-radius: 100px;
  padding: 5px 12px;
  font-size: 0.72rem;
  font-weight: 600;
  color: #34D399;
}

.live-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #10B981;
  position: relative;
  flex-shrink: 0;
}

.live-dot::after {
  content: '';
  position: absolute;
  inset: -3px;
  border-radius: 50%;
  border: 1.5px solid #10B981;
  animation: ping 1.8s ease-out infinite;
}

@keyframes ping {
  0%   { opacity: 1; transform: scale(1); }
  100% { opacity: 0; transform: scale(2.4); }
}

/* ── Bottom quote ── */
.bp-quote {
  flex-shrink: 0;
  padding-top: 2.5rem;
  position: relative;
}

/* Thin top separator */
.bp-quote::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
}

.quote-mark {
  color: #fff;
  margin-bottom: 1rem;
}

.quote-text {
  font-size: 1rem;
  color: #94A3B8;
  line-height: 1.7;
  margin-bottom: 1.25rem;
  font-style: italic;
}

.quote-author {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.qa-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: linear-gradient(135deg, #007BFF, #6366F1);
  color: #fff;
  font-weight: 700;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.qa-name {
  font-size: 0.875rem;
  font-weight: 700;
  color: #E2E8F0;
}

.qa-biz {
  font-size: 0.75rem;
  color: #64748B;
  margin-top: 1px;
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
  padding: 2.5rem 2rem;
  position: relative;
}

/* Mobile top bar (hidden on desktop) */
.mobile-bar {
  display: none;
  width: 100%;
  margin-bottom: 2.5rem;
  justify-content: center;
}

.mobile-logo { height: 40px; width: auto; }

/* Main form wrapper */
.form-wrap {
  width: 100%;
  max-width: 380px;
}

/* ── Form header ── */
.fh {
  margin-bottom: 2.5rem;
}

.fh-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #94A3B8;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-bottom: 1rem;
}

.fh-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #007BFF;
}

.fh-title {
  font-size: 2rem;
  font-weight: 800;
  color: #0F172A;
  letter-spacing: -0.035em;
  line-height: 1.15;
  margin-bottom: 0.5rem;
}

.fh-sub {
  font-size: 0.9rem;
  color: #94A3B8;
  line-height: 1.5;
}

/* ── Form fields ── */
.the-form {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
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
  color: #007BFF;
  cursor: pointer;
  transition: color 0.2s;
}

.fg-forgot:hover { color: #0056b3; }

/* Input wrapper */
.fg-input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.fg-icon {
  position: absolute;
  left: 14px;
  color: #CBD5E1;
  display: flex;
  align-items: center;
  pointer-events: none;
  z-index: 1;
  transition: color 0.2s;
}

.fg-input {
  width: 100%;
  padding: 0.78rem 1rem 0.78rem 2.7rem;
  border: 1.5px solid #E2E8F0;
  border-radius: 10px;
  font-size: 0.9rem;
  font-family: inherit;
  background: #F8FAFC;
  color: #0F172A;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.fg-input::placeholder {
  color: #CBD5E1;
  letter-spacing: 0.01em;
}

/* Focus: shift icon color + ring */
.fg-input-wrap:focus-within .fg-icon {
  color: #007BFF;
}

.fg-input:hover:not(:focus):not(:disabled) {
  border-color: #CBD5E1;
}

.fg-input:focus {
  border-color: #007BFF;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(0,123,255,0.10);
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
  color: #94A3B8;
  display: flex;
  align-items: center;
  padding: 5px;
  border-radius: 6px;
  transition: color 0.2s, background 0.15s;
  line-height: 1;
}

.fg-eye:hover { color: #475569; background: rgba(0,0,0,0.04); }

.fg-eye:focus-visible {
  outline: 2px solid #007BFF;
  outline-offset: 1px;
}

/* ── Submit ── */
.btn-submit {
  width: 100%;
  padding: 0.88rem 1.25rem;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, #007BFF 0%, #4F67F5 60%, #6366F1 100%);
  color: #fff;
  font-size: 0.95rem;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s;
  box-shadow: 0 4px 18px rgba(0,123,255,0.32), 0 1px 4px rgba(0,0,0,0.08);
  margin-top: 0.4rem;
  letter-spacing: 0.01em;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 26px rgba(0,123,255,0.40), 0 2px 8px rgba(0,0,0,0.08);
}

.btn-submit:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(0,123,255,0.25);
}

.btn-submit:disabled {
  opacity: 0.65;
  cursor: not-allowed;
  transform: none;
}

.btn-submit:focus-visible {
  outline: 2px solid #007BFF;
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
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.65s linear infinite;
  flex-shrink: 0;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* ── Form footer ── */
.ff {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #F1F5F9;
  text-align: center;
}

.ff-back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #94A3B8;
  font-size: 0.82rem;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s ease, gap 0.2s ease;
}

.ff-back:hover {
  color: #475569;
  gap: 9px;
}

/* ─────────────────────────────────────────────
   Responsive
───────────────────────────────────────────── */
@media (max-width: 960px) {
  .brand-panel { display: none; }

  .form-panel {
    background: linear-gradient(155deg, #EEF4FF 0%, #F8FAFF 60%, #EDF2FF 100%);
    justify-content: flex-start;
    padding: 0 1.25rem 2rem;
  }

  .mobile-bar { display: flex; padding-top: 2.25rem; }

  .form-wrap { max-width: 420px; margin: 0 auto; }
}

@media (max-width: 480px) {
  .form-panel { padding: 0 1rem 2rem; }
  .fh-title { font-size: 1.7rem; }
}
</style>
