<template>
  <section class="contact-section" id="contact">
    <div class="container">
      <div class="contact-wrapper">
        <div class="contact-info">
          <h2 class="contact-title">{{ t('contact.title') }}</h2>
          <p>{{ t('contact.subtitle') }}</p>
          
          <div class="info-items">
            <div class="info-item">
              <span class="icon"><MapPin /></span>
              <p>Tashkent, Uzbekistan</p>
            </div>
            <div class="info-item">
              <span class="icon"><Phone /></span>
              <p>+998 90 123 45 67</p>
            </div>
            <div class="info-item">
              <span class="icon"><Mail /></span>
              <p>info@cpos.uz</p>
            </div>
          </div>
        </div>

        <div class="contact-form">
          <form @submit.prevent="handleSubmit">
            <div class="form-group">
              <label>{{ t('contact.form.name') }}</label>
              <input type="text" v-model="form.name" required :placeholder="t('contact.form.placeholder_name')" />
            </div>
            <div class="form-group">
              <div class="contact-field-head">
                <span class="contact-main-label">{{ t('contact.form.email_or_phone') }}</span>
                <div
                  class="mode-toggle"
                  role="group"
                  :aria-label="t('contact.form.email_or_phone')"
                >
                  <button
                    type="button"
                    class="mode-btn"
                    :class="{ active: contactMode === 'phone' }"
                    @click="contactMode = 'phone'"
                  >
                    {{ t('contact.form.mode_phone') }}
                  </button>
                  <button
                    type="button"
                    class="mode-btn"
                    :class="{ active: contactMode === 'email' }"
                    @click="contactMode = 'email'"
                  >
                    {{ t('contact.form.mode_email') }}
                  </button>
                </div>
              </div>
              <input
                id="contact-email-or-phone"
                :type="contactMode === 'email' ? 'email' : 'tel'"
                v-model="form.emailOrPhone"
                required
                :autocomplete="contactMode === 'email' ? 'email' : 'tel'"
                :aria-label="
                  contactMode === 'email' ? t('contact.form.email') : t('contact.form.phone')
                "
                :placeholder="
                  contactMode === 'email'
                    ? t('contact.form.placeholder_email')
                    : t('contact.form.placeholder_phone')
                "
              />
            </div>
            <div class="form-group">
              <label>{{ t('contact.form.message') }}</label>
              <textarea v-model="form.message" rows="2" :placeholder="t('contact.form.placeholder_message')"></textarea>
            </div>
            <button type="submit" class="btn-submit" :disabled="isSubmitting">
              {{ isSubmitting ? `${t('contact.form.submit')}...` : t('contact.form.submit') }}
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
  padding: 6rem 0;
  background-color: #0F172A;
  color: white;
}

.contact-wrapper {
  display: flex;
  gap: 4rem;
  align-items: center;
  max-width: 1000px;
  margin: 0 auto;
}

.contact-info {
  flex: 1;
}

.contact-info h2 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}
.contact-title {
  color: white;
}
.contact-info p {
  color: #94A3B8;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.info-items {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.icon {
  font-size: 1.5rem;
}

.contact-form {
  flex: 1;
  background: white;
  padding: 2.5rem;
  border-radius: 16px;
  color: #0F172A;
}

.form-group {
  font-family: var(--font-family-base);
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: 500;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.contact-field-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.contact-main-label {
  font-weight: 500;
  font-size: 0.9rem;
  color: #0f172a;
}

.mode-toggle {
  display: inline-flex;
  padding: 3px;
  background: #f1f5f9;
  border-radius: 999px;
  border: 1px solid #e2e8f0;
}

.mode-btn {
  padding: 0.35rem 0.85rem;
  font-size: 0.8rem;
  font-weight: 600;
  border: none;
  border-radius: 999px;
  background: transparent;
  color: #64748b;
  cursor: pointer;
  transition:
    background-color 0.2s,
    color 0.2s;
}

.mode-btn:hover {
  color: #0f172a;
}

.mode-btn.active {
  background: #fff;
  color: #007bff;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.08);
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: #007BFF;
}

.btn-submit {
  width: 100%;
  background-color: #007BFF;
  color: white;
  padding: 1rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-submit:hover {
  background-color: #0056b3;
}

.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .contact-section {
    padding: 4rem 0;
  }
  
  .contact-wrapper {
    flex-direction: column;
    gap: 3rem;
  }
}

.info-items p {
  margin-bottom: 0;
}
</style>
