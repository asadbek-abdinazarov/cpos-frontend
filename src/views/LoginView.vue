<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import terminalImg from '@/assets/images/terminal.png'
import { login } from '@/services/api'
import { useNotification } from '@/composables/useNotification'
import { Eye, EyeOff } from 'lucide-vue-next'

const { t } = useI18n()
const router = useRouter()
const { showNotification } = useNotification()
const username = ref('')
const password = ref('')
const rememberMe = ref(false)
const loading = ref(false)
const errorMessage = ref('')
const showPassword = ref(false)

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
      localStorage.setItem('refreshToken', data.data.refreshToken)
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
    <!-- Left Side: Image -->
    <div class="login-image-section"  data-aos="fade-right" data-aos-duration="1000">
      <div class="image-overlay"></div>
      <img :src="terminalImg" alt="CPOS System" class="bg-image" />
      <div class="image-content">
        <h2>Modern Point of Sale System</h2>
        <p>Streamline your business operations with our all-in-one cloud solution.</p>
      </div>
    </div>

    <!-- Right Side: Login Form -->
    <div class="login-form-section"  data-aos="fade-left" data-aos-duration="1000">
      <div class="form-wrapper">
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
                placeholder="••••••••" 
                required
              />
              <button type="button" class="password-toggle" @click="showPassword = !showPassword">
                <Eye v-if="showPassword" class="icon" />
                <EyeOff v-else class="icon" />
              </button>
            </div>
          </div>

          <div class="form-actions">
            <!-- <label class="remember-me">
              <input type="checkbox" v-model="rememberMe" />
              <span>{{ t('auth.remember_me') }}</span>
            </label> -->
            <a href="#" class="forgot-password">{{ t('auth.forgot_password') }}</a>
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
          <p>{{ t('auth.no_account') }} <router-link to="/register" class="register-link">{{ t('auth.register_link') }}</router-link></p>
          <router-link to="/" class="back-home-link">
            <span class="arrow-icon">←</span> {{ t('auth.back_to_home') }}
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
  background-color: #FFFFFF;
}

/* Left Side - Image */
.login-image-section {
  flex: 1;
  position: relative;
  background-color: #0F172A;
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
  opacity: 0.6;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to top, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.4));
  z-index: 1;
}

.image-content {
  position: relative;
  z-index: 2;
  color: white;
  padding: 4rem;
  max-width: 600px;
  text-align: center;
  margin-bottom: 2rem;
}

.image-content h2 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: white;
}

.image-content p {
  font-size: 1.1rem;
  opacity: 0.9;
  line-height: 1.6;
}

/* Right Side - Form */
.login-form-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: #FFFFFF;
}

.form-wrapper {
  width: 100%;
  max-width: 440px;
}

.login-logo {
  height: 80px; /* Adjusted size */
  width: auto;
}

.headers {
  text-align: center;
  margin-bottom: 2.5rem;
}

.headers h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #0F172A;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #64748B;
  font-size: 0.95rem;
}

/* Form Styles */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.9rem;
  font-weight: 500;
  color: #334155;
}

.form-group input {
  padding: 0.75rem 1rem;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
  outline: none;
}

.form-group input:focus {
  border-color: #007BFF;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

/* Password Toggle */
.password-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.password-input-wrapper input {
  width: 100%;
  padding-right: 2.5rem;
}

.password-toggle {
  position: absolute;
  right: 0.75rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #64748B;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  transition: color 0.2s ease;
}

.password-toggle:hover {
  color: #0F172A;
}

.password-toggle .icon {
  width: 20px;
  height: 20px;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: #475569;
}

.forgot-password {
  color: #007BFF;
  text-decoration: none;
  font-weight: 500;
}

.btn-login {
  background-color: #007BFF;
  color: white;
  padding: 0.85rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
  margin-top: 0.5rem;
}

.btn-login:hover:not(:disabled) {
  background-color: #0056b3;
}

.btn-login:disabled {
  opacity: 0.7;
  cursor: not-allowed;
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
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.form-footer {
  margin-top: 2rem;
  text-align: center;
  font-size: 0.95rem;
  color: #64748B;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

.register-link {
  color: #007BFF;
  text-decoration: none;
  font-weight: 600;
}

.register-link:hover {
  text-decoration: underline;
}

.back-home-link {
  color: #64748B;
  text-decoration: none;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: color 0.2s;
}

.back-home-link:hover {
  color: #0F172A;
}

.arrow-icon {
  font-size: 1.1rem;
  line-height: 1;
}

/* Responsive */
@media (max-width: 900px) {
  .login-image-section {
    display: none; /* Hide image on tablet/mobile */
  }
}
</style>
