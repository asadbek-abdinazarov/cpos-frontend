<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import terminalImg from '@/assets/images/terminal.png'
import { register } from '@/services/api'
import { useNotification } from '@/composables/useNotification'
import { Eye, EyeOff } from 'lucide-vue-next'

const { t } = useI18n()

const router = useRouter()
const { showNotification } = useNotification()
const loading = ref(false)
const errorMessage = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const form = ref({
  firstname: '',
  lastname: '',
  username: '',
  email: '',
  phone: '',
  orgType: 'legal',
  orgName: '',
  stir: '',
  orgAddress: '',
  orgPhone: '',
  password: '',
  confirmPassword: '',
})

onMounted(() => {
  document.title = `CPOS - ${t('nav.register')}`
})

const handleRegister = async () => {
  errorMessage.value = ''

  if (form.value.password !== form.value.confirmPassword) {
    errorMessage.value = t('auth.passwords_mismatch')
    showNotification({ type: 'error', message: errorMessage.value })
    return
  }

  loading.value = true

  try {
    const response = await register({
      firstName: form.value.firstname,
      lastName: form.value.lastname,
      username: form.value.username,
      password: form.value.password,
      email: form.value.email,
      phone: form.value.phone,
      organizationName: form.value.orgName,
      organizationStir: form.value.stir,
      organizationAddress: form.value.orgAddress,
      organizationPhone: form.value.orgPhone,
    })

    const data = response.data

    if (data.success && data.data) {
      localStorage.setItem('accessToken', data.data.accessToken)
      localStorage.setItem('refreshToken', data.data.refreshToken)
      localStorage.setItem('username', data.data.username)
      showNotification({ type: 'success', message: t('auth.register_success') })
      router.push('/dashboard')
    } else {
      errorMessage.value = data.message || t('auth.register_error')
      showNotification({ type: 'error', message: errorMessage.value })
    }
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage.value = error.response.data.message
    } else {
      errorMessage.value = t('auth.register_error')
    }
    showNotification({ type: 'error', message: errorMessage.value })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-container">
    <!-- Left Side: Image -->
    <div class="auth-image-section" data-aos="fade-right" data-aos-duration="1000">
      <div class="image-overlay"></div>
      <img :src="terminalImg" alt="CPOS System" class="bg-image" />
      <div class="image-content">
        <h2>Join Thousands of Businesses</h2>
        <p>Start your journey with the most advanced POS system in Uzbekistan.</p>
      </div>
    </div>

    <!-- Right Side: Register Form -->
    <div class="auth-form-section" data-aos="fade-left" data-aos-duration="1000">
      <div class="form-wrapper">
        <div class="headers">
          <h1>{{ t('auth.create_account') }}</h1>
          <p class="subtitle">{{ t('auth.start_trial_subtitle') }}</p>
        </div>

        <form @submit.prevent="handleRegister" class="auth-form">
          <div class="form-row">
            <div class="form-group">
              <label for="firstname">{{ t('auth.firstname') }}</label>
              <input
                type="text"
                id="firstname"
                v-model="form.firstname"
                required
                placeholder="John"
              />
            </div>
            <div class="form-group">
              <label for="lastname">{{ t('auth.lastname') }}</label>
              <input type="text" id="lastname" v-model="form.lastname" required placeholder="Doe" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="username">{{ t('auth.username') }}</label>
              <input
                type="text"
                id="username"
                v-model="form.username"
                required
                placeholder="johndoe"
              />
            </div>
            <div class="form-group">
              <label for="email">{{ t('auth.email_register') }}</label>
              <input
                type="email"
                id="email"
                v-model="form.email"
                required
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div class="form-group">
            <label for="phone">{{ t('auth.phone') }}</label>
            <input
              type="tel"
              id="phone"
              v-model="form.phone"
              required
              placeholder="+998 90 123 45 67"
            />
          </div>

          <div class="form-group">
            <label>{{ t('auth.org_type') }}</label>
            <div class="radio-group">
              <label class="radio-label">
                <input type="radio" value="legal" v-model="form.orgType" />
                <span class="radio-custom"></span>
                {{ t('auth.legal') }}
              </label>
              <label class="radio-label">
                <input type="radio" value="individual" v-model="form.orgType" />
                <span class="radio-custom"></span>
                {{ t('auth.individual') }}
              </label>
            </div>
          </div>

          <div class="form-row">
            <div v-if="form.orgType === 'legal'" class="form-group">
              <label for="orgName">{{ t('auth.org_name') }}</label>
              <input type="text" id="orgName" v-model="form.orgName" placeholder="My Company LLC" />
            </div>

            <div class="form-group">
              <label for="stir">{{ t('auth.stir') }}</label>
              <input type="text" id="stir" v-model="form.stir" required placeholder="123456789" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="orgAddress">{{ t('auth.org_address') }}</label>
              <input
                type="text"
                id="orgAddress"
                v-model="form.orgAddress"
                placeholder="Tashkent, Amir Temur 1"
              />
            </div>
            <div class="form-group">
              <label for="orgPhone">{{ t('auth.org_phone') }}</label>
              <input
                type="tel"
                id="orgPhone"
                v-model="form.orgPhone"
                placeholder="+998 71 123 45 67"
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="password">{{ t('auth.password') }}</label>
              <div class="password-input-wrapper">
                <input
                  :type="showPassword ? 'text' : 'password'"
                  id="password"
                  v-model="form.password"
                  required
                  placeholder="••••••••"
                />
                <button type="button" class="password-toggle" @click="showPassword = !showPassword">
                  <Eye v-if="showPassword" class="icon" />
                  <EyeOff v-else class="icon" />
                </button>
              </div>
            </div>
            <div class="form-group">
              <label for="confirmPassword">{{ t('auth.confirm_password') }}</label>
              <div class="password-input-wrapper">
                <input
                  :type="showConfirmPassword ? 'text' : 'password'"
                  id="confirmPassword"
                  v-model="form.confirmPassword"
                  required
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  class="password-toggle"
                  @click="showConfirmPassword = !showConfirmPassword"
                >
                  <Eye v-if="showConfirmPassword" class="icon" />
                  <EyeOff v-else class="icon" />
                </button>
              </div>
            </div>
          </div>

          <button type="submit" class="btn-primary-auth" :disabled="loading">
            <span v-if="loading" class="btn-loading">
              <span class="spinner"></span>
              {{ t('auth.registering') }}
            </span>
            <span v-else>{{ t('auth.register_btn') }}</span>
          </button>
        </form>

        <div class="form-footer">
          <p>
            {{ t('auth.already_account') }}
            <router-link to="/login" class="link">{{ t('auth.login_link') }}</router-link>
          </p>
          <router-link to="/" class="back-home-link">
            <span class="arrow-icon">←</span> {{ t('auth.back_to_home') }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-container {
  display: flex;
  min-height: 100vh;
  width: 100%;
  background-color: #ffffff;
}

/* Left Side - Image */
.auth-image-section {
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
.auth-form-section {
  flex: 1;
  display: flex;
  align-items: center; /* Center vertically if content allows, or 'flex-start' with padding */
  justify-content: center;
  padding: 2rem;
  background-color: #ffffff;
  overflow-y: auto; /* Allow scrolling on right side if form is long */
}

.form-wrapper {
  width: 100%;
  max-width: 500px; /* Slightly wider for 2-col inputs */
  padding: 2rem 0;
}

.auth-logo {
  height: 80px;
  width: auto;
}

.headers {
  text-align: center;
  margin-bottom: 2rem;
}

.headers h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #64748b;
  font-size: 0.95rem;
}

/* Form Styles */
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.form-row .form-group {
  flex: 1;
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

.form-group input[type='text'],
.form-group input[type='email'],
.form-group input[type='password'],
.form-group input[type='tel'] {
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  outline: none;
}

.form-group input:focus {
  border-color: #007bff;
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
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  transition: color 0.2s ease;
}

.password-toggle:hover {
  color: #0f172a;
}

.password-toggle .icon {
  width: 20px;
  height: 20px;
}

/* Radio Group */
.radio-group {
  display: flex;
  gap: 1.5rem;
  margin-top: 0.25rem;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.95rem;
  color: #475569;
}

.radio-label input {
  display: none;
}

.radio-custom {
  width: 18px;
  height: 18px;
  border: 2px solid #cbd5e1;
  border-radius: 50%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.radio-label input:checked + .radio-custom {
  border-color: #007bff;
}

.radio-label input:checked + .radio-custom::after {
  content: '';
  width: 10px;
  height: 10px;
  background-color: #007bff;
  border-radius: 50%;
}

.btn-primary-auth {
  background-color: #007bff;
  color: white;
  padding: 0.85rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
  margin-top: 1rem;
}

.btn-primary-auth:hover:not(:disabled) {
  background-color: #0056b3;
}

.btn-primary-auth:disabled {
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
  to {
    transform: rotate(360deg);
  }
}

.form-footer {
  margin-top: 2rem;
  text-align: center;
  font-size: 0.95rem;
  color: #64748b;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

.link {
  color: #007bff;
  text-decoration: none;
  font-weight: 600;
}

.link:hover {
  text-decoration: underline;
}

.back-home-link {
  color: #64748b;
  text-decoration: none;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: color 0.2s;
}

.back-home-link:hover {
  color: #0f172a;
}

.arrow-icon {
  font-size: 1.1rem;
  line-height: 1;
}

/* Responsive */
@media (max-width: 900px) {
  .auth-image-section {
    display: none;
  }
}
</style>
