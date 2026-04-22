<template>
  <section class="contact-section" id="contact">
    <div class="section-container">
      <div class="contact-card">
        <!-- Left info panel -->
        <div class="info-panel">
          <span class="section-tag">Aloqa</span>
          <h2 class="contact-title">{{ t('contact.title') }}</h2>
          <p class="contact-sub">{{ t('contact.subtitle') }}</p>

          <div class="info-items">
            <div class="info-item">
              <div class="info-icon">
                <MapPin :size="18" :stroke-width="2" />
              </div>
              <div>
                <div class="info-label">Manzil</div>
                <div class="info-value">Tashkent, Uzbekistan</div>
              </div>
            </div>
            <div class="info-item">
              <div class="info-icon">
                <Phone :size="18" :stroke-width="2" />
              </div>
              <div>
                <div class="info-label">Telefon</div>
                <a href="tel:+998901234567" class="info-value info-link">+998 90 123 45 67</a>
              </div>
            </div>
            <div class="info-item">
              <div class="info-icon">
                <Mail :size="18" :stroke-width="2" />
              </div>
              <div>
                <div class="info-label">Email</div>
                <a href="mailto:info@cpos.uz" class="info-value info-link">info@cpos.uz</a>
              </div>
            </div>
          </div>

          <!-- Decorative element -->
          <div class="info-deco">
            <div class="deco-ring ring-1"></div>
            <div class="deco-ring ring-2"></div>
            <div class="deco-ring ring-3"></div>
          </div>
        </div>

        <!-- Right form panel -->
        <div class="form-panel">
          <form @submit.prevent="handleSubmit" class="contact-form">
            <div class="form-group">
              <label class="form-label">{{ t('contact.form.name') }}</label>
              <input
                type="text"
                v-model="form.name"
                required
                class="form-input"
                :placeholder="t('contact.form.placeholder_name')"
              />
            </div>

            <div class="form-group">
              <div class="field-head">
                <span class="form-label">{{ t('contact.form.email_or_phone') }}</span>
                <div class="mode-toggle" role="group">
                  <button
                    type="button"
                    :class="['mode-btn', { active: contactMode === 'phone' }]"
                    @click="contactMode = 'phone'"
                  >{{ t('contact.form.mode_phone') }}</button>
                  <button
                    type="button"
                    :class="['mode-btn', { active: contactMode === 'email' }]"
                    @click="contactMode = 'email'"
                  >{{ t('contact.form.mode_email') }}</button>
                </div>
              </div>
              <input
                :type="contactMode === 'email' ? 'email' : 'tel'"
                v-model="form.emailOrPhone"
                required
                class="form-input"
                :autocomplete="contactMode === 'email' ? 'email' : 'tel'"
                :placeholder="contactMode === 'email' ? t('contact.form.placeholder_email') : t('contact.form.placeholder_phone')"
              />
            </div>

            <div class="form-group">
              <label class="form-label">{{ t('contact.form.message') }}</label>
              <textarea
                v-model="form.message"
                rows="3"
                class="form-input form-textarea"
                :placeholder="t('contact.form.placeholder_message')"
              ></textarea>
            </div>

            <button type="submit" class="btn-submit" :disabled="isSubmitting">
              <span v-if="!isSubmitting">{{ t('contact.form.submit') }}</span>
              <span v-else class="loading-text">
                <span class="spinner"></span>
                Yuborilmoqda...
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { MapPin, Phone, Mail } from 'lucide-vue-next'
import { sendPublicContactRequest } from '@/services/api'
import { useNotification } from '@/composables/useNotification'

const { t } = useI18n()
const { showNotification } = useNotification()
const form = ref({ name: '', emailOrPhone: '', message: '' })
const contactMode = ref('phone')
const isSubmitting = ref(false)

const handleSubmit = async () => {
  if (isSubmitting.value) return
  isSubmitting.value = true
  try {
    const payload = {
      name: form.value.name,
      emailOrPhone: form.value.emailOrPhone,
      message: form.value.message,
    }
    const { data } = await sendPublicContactRequest(payload)
    const successMessage = data?.data || data?.message || t('contact.form.success')
    showNotification({ type: 'success', message: successMessage })
    form.value = { name: '', emailOrPhone: '', message: '' }
  } catch (error) {
    const resData = error?.response?.data
    const validationErrors = resData?.errors
    if (validationErrors && typeof validationErrors === 'object') {
      Object.values(validationErrors).forEach((msg) => {
        if (msg) showNotification({ type: 'error', message: String(msg) })
      })
    } else {
      showNotification({
        type: 'error',
        message: resData?.message || error?.message || 'Unexpected error',
      })
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.contact-section {
  padding: 7rem 0;
  background: #0F172A;
  position: relative;
  overflow: hidden;
}

.contact-section::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(0, 123, 255, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 123, 255, 0.04) 1px, transparent 1px);
  background-size: 40px 40px;
}

.section-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 1;
}

.contact-card {
  display: grid;
  grid-template-columns: 1fr 1fr;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 32px 80px rgba(0, 0, 0, 0.35);
}

/* Info panel */
.info-panel {
  background: linear-gradient(155deg, #1E3A5F 0%, #0F172A 100%);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-right: none;
  border-radius: 24px 0 0 24px;
  padding: 3.5rem;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.section-tag {
  display: inline-block;
  background: rgba(0, 123, 255, 0.15);
  border: 1px solid rgba(0, 123, 255, 0.25);
  color: #60A5FA;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 5px 14px;
  border-radius: 100px;
  margin-bottom: 1.5rem;
  width: fit-content;
}

.contact-title {
  font-size: clamp(1.8rem, 3vw, 2.5rem);
  font-weight: 800;
  color: #fff;
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
  line-height: 1.15;
}

.contact-sub {
  font-size: 1rem;
  color: #94A3B8;
  line-height: 1.7;
  margin-bottom: 2.5rem;
}

.info-items {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.info-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(0, 123, 255, 0.12);
  border: 1px solid rgba(0, 123, 255, 0.2);
  color: #60A5FA;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.info-label {
  font-size: 0.72rem;
  color: #64748B;
  font-weight: 500;
  margin-bottom: 3px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.info-value {
  font-size: 0.95rem;
  color: #CBD5E1;
  font-weight: 500;
}

.info-link {
  color: #CBD5E1;
  text-decoration: none;
  transition: color 0.2s;
}

.info-link:hover { color: #60A5FA; }

/* Decorative rings */
.info-deco {
  position: absolute;
  bottom: -60px;
  right: -60px;
  pointer-events: none;
}

.deco-ring {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(0, 123, 255, 0.1);
  bottom: 0;
  right: 0;
}

.ring-1 { width: 160px; height: 160px; bottom: 0; right: 0; }
.ring-2 { width: 240px; height: 240px; bottom: -40px; right: -40px; }
.ring-3 { width: 320px; height: 320px; bottom: -80px; right: -80px; }

/* Form panel */
.form-panel {
  background: #fff;
  border-radius: 0 24px 24px 0;
  padding: 3.5rem;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  height: 100%;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

.field-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.mode-toggle {
  display: inline-flex;
  padding: 2px;
  background: #F1F5F9;
  border-radius: 100px;
  border: 1px solid #E2E8F0;
}

.mode-btn {
  padding: 0.3rem 0.8rem;
  font-size: 0.75rem;
  font-weight: 600;
  border: none;
  border-radius: 100px;
  background: transparent;
  color: #64748B;
  cursor: pointer;
  transition: all 0.2s;
}

.mode-btn.active {
  background: #fff;
  color: #007BFF;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1.5px solid #E2E8F0;
  border-radius: 10px;
  font-size: 0.95rem;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  color: #0F172A;
  background: #FAFAFA;
}

.form-input::placeholder { color: #CBD5E1; }

.form-input:focus {
  border-color: #007BFF;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.08);
  background: #fff;
}

.form-textarea {
  resize: none;
  min-height: 90px;
}

.btn-submit {
  width: 100%;
  padding: 0.9rem;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #007BFF, #6366F1);
  color: #fff;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s ease;
  box-shadow: 0 4px 16px rgba(0, 123, 255, 0.3);
  margin-top: auto;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 123, 255, 0.4);
}

.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-text {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 860px) {
  .contact-card {
    grid-template-columns: 1fr;
  }

  .info-panel { border-radius: 24px 24px 0 0; border-right: 1px solid rgba(255, 255, 255, 0.07); border-bottom: none; }
  .form-panel { border-radius: 0 0 24px 24px; }
}

@media (max-width: 520px) {
  .contact-section { padding: 5rem 0; }
  .info-panel, .form-panel { padding: 2.5rem 1.75rem; }
}
</style>
