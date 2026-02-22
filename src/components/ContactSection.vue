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
              <label>{{ t('contact.form.phone') }}</label>
              <input type="tel" v-model="form.phone" required :placeholder="t('contact.form.placeholder_phone')" />
            </div>
            <div class="form-group">
              <label>{{ t('contact.form.message') }}</label>
              <textarea v-model="form.message" rows="2" :placeholder="t('contact.form.placeholder_message')"></textarea>
            </div>
            <button type="submit" class="btn-submit">{{ t('contact.form.submit') }}</button>
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

const { t } = useI18n()
const form = ref({ name: '', phone: '', message: '' })

const handleSubmit = () => {
  console.log('Form submitted:', form.value)
  alert(t('contact.form.success'))
  form.value = { name: '', phone: '', message: '' }
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
