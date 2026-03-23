<script setup>
import { useI18n } from 'vue-i18n'
import { Mail, Phone, MapPin } from 'lucide-vue-next'
const { t } = useI18n()
</script>

<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <!-- Column 1: Brand -->
        <div class="footer-col brand-col">
          <div class="brand-wrapper">
            <router-link to="/" class="footer-logo-link">
              <img src="/logo-footer.svg" alt="CPOS Logo" class="footer-logo" />
            </router-link>
          </div>
          <p class="footer-desc">
            {{ t('footer.desc') }}
          </p>
          <div class="social-links">
            <button type="button" class="social-link" aria-label="Facebook">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.04c-5.5 0-10 4.49-10 10.02c0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89c1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02Z"/></svg>
            </button>
            <button type="button" class="social-link" aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3Z"/></svg>
            </button>
            <button type="button" class="social-link" aria-label="Website">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 1 10 10a10 10 0 0 1-10 10A10 10 0 0 1 2 12A10 10 0 0 1 12 2M4.07 13H1v-2h3.07c.1 0 .1.1.2.2q-1.2 5.05-1.2 9c0 .1.1.2.2.2c3.4 0 6.6-1.5 8.7-3.9h-1.6c-.6 1.4-1.3 2.7-2.1 3.8c-.8-1.5-1.5-3.3-2-5.3m2.2-5.7c.3-1.6.8-3.1 1.4-4.5c.8 1.1 1.4 2.4 1.9 3.8h1.6c-2.1-2.4-5.3-3.9-8.7-3.9c-.1 0-.2.1-.2.2c0 3.95.4 7.9 1.2 9l-.2.1H1v-2h3.07c-.1-.7-.1-1.3-.1-2s0-1.4.1-2.1v-.2l-.2-.3m5.8 4.7H8.8c.2 2 .7 3.9 1.5 5.7c.8-1.8 1.3-3.7 1.5-5.7l.2-.1v.1m0-2H8.8c-.2-2-.7-3.9-1.5-5.7c-.8 1.8-1.3 3.7-1.5 5.7l-.2.1v-.1m10.9-2.7c.1.7.1 1.3.1 2s0 1.4-.1 2.1l.1.3h3.1v-2h-3.1c-.1 0-.1-.1-.2-.2q1.2-5.05 1.2-9c0-.1-.1-.2-.2-.2c-3.4 0-6.6 1.5-8.7 3.9h1.6c.6-1.4 1.3-2.7 2.1-3.8c.8 1.5 1.5 3.3 2 5.3l-.1.6m-2.2 5.7c-.3 1.6-.8 3.1-1.4 4.5c-.8-1.1-1.4-2.4-1.9-3.8h-1.6c2.1 2.4 5.3 3.9 8.7 3.9c.1 0 .2-.1.2-.2c0-3.95-.4-7.9-1.2-9l.2-.1H23v2h-3.07l-.2.2v.3Z"/></svg>
            </button>
          </div>
        </div>

        <div class="footer-col">
          <h4 class="col-title">{{ t('footer.product') }}</h4>
          <ul class="footer-links">
            <li><a href="/#features">{{ t('nav.features') }}</a></li>
            <li><a href="/#hardware">{{ t('nav.hardware') }}</a></li>
            <li><a href="/#pricing">{{ t('nav.pricing') }}</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4 class="col-title">{{ t('footer.company') }}</h4>
          <ul class="footer-links">
            <li><a href="/#about">{{ t('footer.about') }}</a></li>
            <li><a href="/#contact">{{ t('footer.contact') }}</a></li>
          </ul>
        </div>

        <!-- Column 4: Contact -->
        <div class="footer-col">
          <h4 class="col-title">Contact</h4>
          <ul class="contact-list">
            <li>
              <span class="icon"><Mail class="icon-sm" /></span>
              <a href="mailto:hello@cpos.uz">hello@cpos.uz</a>
            </li>
            <li>
              <span class="icon"><Phone class="icon-sm" /></span>
              <a href="tel:+998712000000">+998 71 200 00 00</a>
            </li>
            <li>
              <span class="icon"><MapPin class="icon-sm" /></span>
              <span>Tashkent, Uzbekistan</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p class="copyright">&copy; 2023 CPOS. {{ t('footer.rights') }}</p>
        <div class="legal-links">
          <button type="button" class="legal-link">{{ t('footer.privacy') }}</button>
          <button type="button" class="legal-link">{{ t('footer.terms') }}</button>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background-color: #0F172A; /* Dark Slate Blue */
  color: #94A3B8; /* Slate Gray */
  padding: 5rem 0 2rem;
  font-size: 0.95rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.5fr;
  gap: 3rem;
  margin-bottom: 4rem;
}

/* Brand Column */
.brand-wrapper {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.footer-logo-link {
  display: inline-flex;
  text-decoration: none;
}

.footer-logo {
  height: 70px;
  width: auto;
  display: block;
}

.footer-desc {
  line-height: 1.6;
  margin-bottom: 2rem;
  max-width: 300px;
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-link {
  color: #94A3B8;
  transition: color 0.3s ease;
}

button.social-link {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font: inherit;
  display: inline-flex;
  align-items: center;
}

.social-link:hover {
  color: var(--color-primary);
}

/* Columns General */
.col-title {
  color: #FFFFFF;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.footer-links, .contact-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.footer-links a, .contact-list a {
  color: #94A3B8;
  transition: color 0.3s ease;
  text-decoration: none;
}

.footer-links a:hover, .contact-list a:hover {
  color: var(--color-primary);
}

.contact-list li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.contact-list .icon {
  font-size: 1rem;
  color: #007BFF; /* Primary Blue for Icons */
}

/* Footer Bottom */
.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
}

.legal-links {
  display: flex;
  gap: 1.5rem;
}

.legal-link {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font: inherit;
  font-size: inherit;
  color: #94a3b8;
  transition: color 0.3s ease;
}

.legal-link:hover {
  color: #ffffff;
}

/* Responsive Design */
@media (max-width: 900px) {
  .footer {
    padding: 4rem 0 2rem;
  }

  .footer-grid {
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }
}

@media (max-width: 600px) {
  .footer-grid {
    grid-template-columns: 1fr;
  }
  
  .footer-bottom {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .brand-wrapper {
    justify-content: center; /* Center on mobile if desired, or keep left */
  }
}
</style>
