<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import terminalImg from '@/assets/images/terminal.png'
import { login, persistAuthTokensFromResponse } from '@/services/api'
import { useNotification } from '@/composables/useNotification'
import { Eye, EyeOff } from 'lucide-vue-next'

const { t } = useI18n()
const router = useRouter()
const { showNotification } = useNotification()
const username = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')
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
  errorMessage.value = ''
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
      errorMessage.value = data.message || t('auth.login_error')
      showNotification({ type: 'error', message: errorMessage.value })
    }
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage.value = error.response.data.message
    } else {
      errorMessage.value = t('auth.login_error')
    }
    showNotification({ type: 'error', message: errorMessage.value })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-container">
    <div class="login-image-section">
      <div class="image-overlay"></div>
      <img :src="terminalImg" alt="" class="bg-image" />
      <div class="image-content">
        <h2>{{ t('auth.login_hero_title') }}</h2>
        <p>{{ t('auth.login_hero_subtitle') }}</p>
      </div>
    </div>

    <div class="login-form-section">
      <div class="form-wrapper form-card">
        <div class="brand-row">
          <img src="/logo-nav.svg" alt="CPOS" class="login-logo" width="160" height="50" />
        </div>

        <div class="headers">
          <h1>{{ t('auth.welcome_back') }}</h1>
          <p class="subtitle">{{ t('auth.sign_in_subtitle') }}</p>
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="username">{{ t('auth.username') }}</label>
            <input
              type="text"
              id="username"
              v-model="username"
              name="username"
              autocomplete="username"
              :placeholder="t('auth.username_placeholder')"
              required
            />
          </div>

          <div class="form-group">
            <label for="password">{{ t('auth.password') }}</label>
            <div class="password-input-wrapper">
              <input
                :type="showPassword ? 'text' : 'password'"
                id="password"
                v-model="password"
                name="password"
                autocomplete="current-password"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                class="password-toggle"
                :aria-label="passwordToggleLabel"
                :aria-pressed="showPassword"
                @click="showPassword = !showPassword"
              >
                <Eye v-if="showPassword" class="icon" aria-hidden="true" />
                <EyeOff v-else class="icon" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="forgot-password">{{ t('auth.forgot_password') }}</button>
          </div>

          <button type="submit" class="btn-login" :disabled="loading">
            <span v-if="loading" class="btn-loading">
              <span class="spinner"></span>
              {{ t('auth.logging_in') }}
            </span>
            <span v-else>{{ t('auth.login_btn') }}</span>
          </button>
        </form>

        <div class="form-footer">
          <router-link to="/" class="back-home-link">
            <span class="arrow-icon" aria-hidden="true">←</span> {{ t('auth.back_to_home') }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  min-height: 100vh;
  width: 100%;
  background-color: var(--color-background);
}

/* Left — hero image */
.login-image-section {
  flex: 1;
  position: relative;
  background-color: #0f172a;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  overflow: hidden;
}

.bg-image {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.55;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    165deg,
    rgba(15, 23, 42, 0.55) 0%,
    rgba(15, 23, 42, 0.75) 45%,
    rgba(15, 23, 42, 0.92) 100%
  );
  z-index: 1;
}

.image-content {
  position: relative;
  z-index: 2;
  color: var(--color-white);
  padding: 4rem;
  max-width: 560px;
  text-align: center;
  margin-bottom: 2rem;
}

.image-content h2 {
  font-size: clamp(1.75rem, 3vw, 2.5rem);
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--color-white);
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.image-content p {
  font-size: 1.05rem;
  opacity: 0.92;
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.92);
}

/* Right — form panel */
.login-form-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1.5rem;
  background: linear-gradient(180deg, #f8fafc 0%, #ffffff 55%);
}

.form-wrapper {
  width: 100%;
  max-width: 420px;
}

.form-card {
  background: var(--color-white);
  border-radius: 20px;
  padding: 2.25rem 2rem 2rem;
  box-shadow: var(--shadow-md);
  border: 1px solid rgba(226, 232, 240, 0.85);
}

.brand-row {
  display: flex;
  justify-content: center;
  margin-bottom: 1.75rem;
}

.login-logo {
  height: 48px;
  width: auto;
  display: block;
}

.headers {
  text-align: center;
  margin-bottom: 2rem;
}

.headers h1 {
  font-size: 1.65rem;
  font-weight: 700;
  color: var(--color-secondary);
  margin-bottom: 0.4rem;
  letter-spacing: -0.02em;
}

.subtitle {
  color: var(--color-text-light);
  font-size: 0.9375rem;
  line-height: 1.5;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #334155;
}

.form-group input {
  padding: 0.8rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
  outline: none;
  background: #fafbfc;
}

.form-group input:hover {
  border-color: #cbd5e1;
}

.form-group input:focus {
  border-color: var(--color-primary);
  background: var(--color-white);
  box-shadow: 0 0 0 4px rgba(0, 123, 255, 0.15);
}

.password-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.password-input-wrapper input {
  width: 100%;
  padding-right: 2.75rem;
}

.password-toggle {
  position: absolute;
  right: 0.65rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.35rem;
  border-radius: 8px;
  transition:
    color 0.2s ease,
    background 0.2s ease;
}

.password-toggle:hover {
  color: var(--color-secondary);
  background: rgba(148, 163, 184, 0.12);
}

.password-toggle:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.password-toggle .icon {
  width: 20px;
  height: 20px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: 0.875rem;
  margin-top: -0.25rem;
}

.forgot-password {
  background: none;
  border: none;
  padding: 0;
  font: inherit;
  color: var(--color-primary);
  font-weight: 600;
  cursor: pointer;
  text-align: right;
}

.forgot-password:hover {
  color: var(--color-primary-dark);
  text-decoration: underline;
}

.btn-login {
  width: 100%;
  margin-top: 0.35rem;
  background-color: var(--color-primary);
  color: var(--color-white);
  padding: 0.9rem 1.25rem;
  border: none;
  border-radius: 9999px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
  box-shadow: 0 4px 14px rgba(0, 123, 255, 0.28);
}

.btn-login:hover:not(:disabled) {
  background-color: var(--color-primary-dark);
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.btn-login:active:not(:disabled) {
  transform: translateY(0);
}

.btn-login:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 3px;
}

.btn-login:disabled {
  opacity: 0.72;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.35);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.65s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.form-footer {
  margin-top: 1.75rem;
  padding-top: 1.25rem;
  border-top: 1px solid #f1f5f9;
  text-align: center;
  font-size: 0.9375rem;
}

.back-home-link {
  color: #64748b;
  text-decoration: none;
  font-size: 0.9rem;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  transition: color 0.2s ease;
  font-weight: 500;
}

.back-home-link:hover {
  color: var(--color-primary);
}

.arrow-icon {
  font-size: 1.1rem;
  line-height: 1;
}

@media (max-width: 900px) {
  .login-container {
    background: linear-gradient(165deg, #eef2f7 0%, #f8fafc 45%, #e8edf4 100%);
  }

  .login-image-section {
    display: none;
  }

  .login-form-section {
    background: transparent;
    padding: 1.5rem 1rem 2rem;
    align-items: flex-start;
    padding-top: 2.5rem;
  }

  .form-card {
    padding: 1.75rem 1.35rem 1.75rem;
    border-radius: 18px;
    box-shadow: var(--shadow-lg);
  }
}
</style>
