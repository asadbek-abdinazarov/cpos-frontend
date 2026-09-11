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

const socials = [
  {
    label: 'Telegram',
    href: 'https://t.me/cposuz',
    path: 'M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z',
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/cpos.uz/',
    path: 'M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3Z',
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@cpos_uz',
    path: 'M23 12s0-3.85-.46-5.58c-.25-.95-1-1.7-1.94-1.95C18.88 4 12 4 12 4s-6.88 0-8.6.47c-.94.25-1.69 1-1.94 1.95C1 8.15 1 12 1 12s0 3.85.46 5.58c.25.95 1 1.7 1.94 1.95C5.12 20 12 20 12 20s6.88 0 8.6-.47c.94-.25 1.69-1 1.94-1.95C23 15.85 23 12 23 12M9.75 15.27V8.73L15.5 12l-5.75 3.27z',
  },
]
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
            <a
              v-for="s in socials"
              :key="s.label"
              :href="s.href"
              class="social-btn"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="s.label"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path :d="s.path" />
              </svg>
            </a>
          </div>
        </div>

        <!-- Product col -->
        <div class="footer-col">
          <h4 class="col-title">{{ t('footer.product') }}</h4>
          <ul class="footer-links">
            <li>
              <a href="/" @click.prevent="goSection('features')">{{ t('nav.features') }}</a>
            </li>
            <li>
              <a href="/" @click.prevent="goSection('workflow')">{{ t('footer.capabilities') }}</a>
            </li>
            <li>
              <a href="/" @click.prevent="goSection('pricing')">{{ t('nav.pricing') }}</a>
            </li>
          </ul>
        </div>

        <!-- Company col -->
        <div class="footer-col">
          <h4 class="col-title">{{ t('footer.company') }}</h4>
          <ul class="footer-links">
            <li>
              <router-link to="/about">{{ t('footer.about') }}</router-link>
            </li>
            <li>
              <a href="/" @click.prevent="goSection('contact')">{{ t('footer.contact') }}</a>
            </li>
          </ul>
        </div>

        <!-- Contact col -->
        <div class="footer-col">
          <h4 class="col-title">{{ t('footer.contact') }}</h4>
          <ul class="contact-list">
            <li>
              <span class="contact-icon"><Mail :size="14" :stroke-width="2" /></span>
              <a href="mailto:info@cpos.uz">info@cpos.uz</a>
            </li>
            <li>
              <span class="contact-icon"><Phone :size="14" :stroke-width="2" /></span>
              <a href="tel:+998917772004">+998 91 776 20 04</a>
            </li>
            <li>
              <span class="contact-icon"><MapPin :size="14" :stroke-width="2" /></span>
              <span>Tashkent, Uzbekistan</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <p class="copyright">
          &copy; {{ new Date().getFullYear() }} CPOS. {{ t('footer.rights') }}
        </p>
        <div class="legal-links">
          <router-link to="/privacy" class="legal-btn">{{ t('footer.privacy') }}</router-link>
          <router-link to="/terms" class="legal-btn">{{ t('footer.terms') }}</router-link>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: #0a0f1e;
  color: #94a3b8;
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
  background: linear-gradient(
    90deg,
    transparent,
    rgba(0, 123, 255, 0.5),
    rgba(99, 102, 241, 0.4),
    transparent
  );
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
  color: #64748b;
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
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.social-btn:hover {
  background: rgba(0, 123, 255, 0.15);
  border-color: rgba(0, 123, 255, 0.3);
  color: #60a5fa;
}

/* Columns */
.col-title {
  color: #e2e8f0;
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
  color: #64748b;
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.2s;
}

.footer-links a:hover {
  color: #94a3b8;
}

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
  color: #3b82f6;
  flex-shrink: 0;
}

.contact-list a {
  color: #64748b;
  text-decoration: none;
  transition: color 0.2s;
}

.contact-list a:hover {
  color: #94a3b8;
}

.contact-list span {
  color: #64748b;
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
  color: #475569;
  font-size: inherit;
  transition: color 0.2s;
}

.legal-btn:hover {
  color: #94a3b8;
}

@media (max-width: 900px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr;
    gap: 2.5rem;
  }
}

@media (max-width: 540px) {
  .footer-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  .footer-bottom {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  .footer {
    padding-top: 4rem;
  }
  .footer-desc {
    max-width: 100%;
  }
  .legal-links {
    gap: 1.25rem;
  }
}

@media (max-width: 400px) {
  .footer-container {
    padding: 0 1.25rem;
  }
  .footer {
    padding-top: 3.5rem;
  }
  .footer-grid {
    gap: 1.75rem;
    padding-bottom: 3rem;
  }
  .footer-logo {
    height: 48px;
  }
  .footer-bottom {
    padding: 1.25rem 0;
  }
}
</style>
