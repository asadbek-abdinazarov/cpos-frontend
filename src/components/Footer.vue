<script setup>
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { goToHomeSection } from '@/composables/useHomeSectionNav'
import { Mail, Phone, MapPin } from 'lucide-vue-next'

const { t } = useI18n()
const router = useRouter()

const goSection = (id) => {
  goToHomeSection(router, id)
}
</script>

<template>
  <footer class="footer">
    <div class="footer-top-line"></div>
    <div class="footer-container">
      <div class="footer-grid">
        <!-- Brand col -->
        <div class="footer-col brand-col">
          <router-link to="/" class="footer-logo-link">
            <img src="/logo-footer.svg" alt="CPOS Logo" class="footer-logo" />
          </router-link>
          <p class="footer-desc">{{ t('footer.desc') }}</p>
          <div class="social-links">
            <button type="button" class="social-btn" aria-label="Facebook">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.04c-5.5 0-10 4.49-10 10.02c0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89c1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02Z"/></svg>
            </button>
            <button type="button" class="social-btn" aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3Z"/></svg>
            </button>
            <button type="button" class="social-btn" aria-label="Website">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            </button>
          </div>
        </div>

        <!-- Product col -->
        <div class="footer-col">
          <h4 class="col-title">{{ t('footer.product') }}</h4>
          <ul class="footer-links">
            <li><a href="/" @click.prevent="goSection('features')">{{ t('nav.features') }}</a></li>
            <li><a href="/" @click.prevent="goSection('hardware')">{{ t('nav.hardware') }}</a></li>
            <li><a href="/" @click.prevent="goSection('pricing')">{{ t('nav.pricing') }}</a></li>
          </ul>
        </div>

        <!-- Company col -->
        <div class="footer-col">
          <h4 class="col-title">{{ t('footer.company') }}</h4>
          <ul class="footer-links">
            <li><router-link to="/about">{{ t('footer.about') }}</router-link></li>
            <li><a href="/" @click.prevent="goSection('contact')">{{ t('footer.contact') }}</a></li>
          </ul>
        </div>

        <!-- Contact col -->
        <div class="footer-col">
          <h4 class="col-title">{{ t('footer.contact') }}</h4>
          <ul class="contact-list">
            <li>
              <span class="contact-icon"><Mail :size="14" :stroke-width="2" /></span>
              <a href="mailto:hello@cpos.uz">hello@cpos.uz</a>
            </li>
            <li>
              <span class="contact-icon"><Phone :size="14" :stroke-width="2" /></span>
              <a href="tel:+998712000000">+998 71 200 00 00</a>
            </li>
            <li>
              <span class="contact-icon"><MapPin :size="14" :stroke-width="2" /></span>
              <span>Tashkent, Uzbekistan</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <p class="copyright">&copy; {{ new Date().getFullYear() }} CPOS. {{ t('footer.rights') }}</p>
        <div class="legal-links">
          <button type="button" class="legal-btn">{{ t('footer.privacy') }}</button>
          <button type="button" class="legal-btn">{{ t('footer.terms') }}</button>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: #0A0F1E;
  color: #94A3B8;
  padding-top: 5rem;
  font-size: 0.9rem;
  position: relative;
}

.footer-top-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(0, 123, 255, 0.5), rgba(99, 102, 241, 0.4), transparent);
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.5fr;
  gap: 3rem;
  padding-bottom: 4rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

/* Brand */
.brand-col {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.footer-logo-link {
  display: inline-flex;
}

.footer-logo {
  height: 60px;
  width: auto;
}

.footer-desc {
  color: #64748B;
  line-height: 1.65;
  max-width: 280px;
  font-size: 0.875rem;
}

.social-links {
  display: flex;
  gap: 0.5rem;
}

.social-btn {
  width: 36px;
  height: 36px;
  border-radius: 9px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #64748B;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.social-btn:hover {
  background: rgba(0, 123, 255, 0.15);
  border-color: rgba(0, 123, 255, 0.3);
  color: #60A5FA;
}

/* Columns */
.col-title {
  color: #E2E8F0;
  font-size: 0.875rem;
  font-weight: 700;
  margin-bottom: 1.25rem;
  letter-spacing: 0.02em;
}

.footer-links {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.footer-links a {
  color: #64748B;
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.2s;
}

.footer-links a:hover { color: #94A3B8; }

.contact-list {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.contact-list li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
}

.contact-icon {
  color: #3B82F6;
  flex-shrink: 0;
}

.contact-list a {
  color: #64748B;
  text-decoration: none;
  transition: color 0.2s;
}

.contact-list a:hover { color: #94A3B8; }

.contact-list span {
  color: #64748B;
}

/* Footer bottom */
.footer-bottom {
  padding: 1.75rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.82rem;
  color: #475569;
}

.legal-links {
  display: flex;
  gap: 1.5rem;
}

.legal-btn {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font: inherit;
  font-size: inherit;
  color: #475569;
  transition: color 0.2s;
}

.legal-btn:hover { color: #94A3B8; }

@media (max-width: 900px) {
  .footer-grid { grid-template-columns: 1fr 1fr; gap: 2.5rem; }
}

@media (max-width: 540px) {
  .footer-grid { grid-template-columns: 1fr; }
  .footer-bottom { flex-direction: column; gap: 1rem; text-align: center; }
  .footer { padding-top: 4rem; }
}
</style>
