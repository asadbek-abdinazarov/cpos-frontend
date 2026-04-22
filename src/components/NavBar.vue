<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { goToHomeSection } from '@/composables/useHomeSectionNav'
import { LogIn, LayoutDashboard } from 'lucide-vue-next'
import { enterDashboard } from '@/composables/useAppLoader'

const { t, locale } = useI18n()
const router = useRouter()

const goToDashboard = () => {
  closeMenu()
  enterDashboard(() => router.push('/dashboard'))
}

const goSection = (id) => {
  goToHomeSection(router, id)
}

const handleLogoClick = () => {
  if (router.currentRoute.value.path === '/') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } else {
    router.push('/')
  }
}

const languages = [
  { code: 'uz', name: "O'zbek" },
  { code: 'oz', name: 'Ўзбек' },
  { code: 'ru', name: 'Русский' },
]

const isScrolled = ref(false)
const isMenuOpen = ref(false)
const isAuthenticated = ref(false)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}

const goSectionAndClose = (id) => {
  goSection(id)
  closeMenu()
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  isAuthenticated.value = !!localStorage.getItem('refreshToken')
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <nav :class="['navbar', { 'navbar-scrolled': isScrolled }]">
    <div class="nav-container">
      <!-- Logo -->
      <a href="/" class="logo-link" @click.prevent="handleLogoClick">
        <img src="/logo-nav.svg" alt="CPOS Logo" class="logo-img" />
      </a>

      <!-- Desktop Nav Links -->
      <div class="desktop-nav">
        <a href="/" class="nav-link" @click.prevent="goSection('features')">{{
          t('nav.features')
        }}</a>
        <a href="/" class="nav-link" @click.prevent="goSection('hardware')">{{
          t('nav.hardware')
        }}</a>
        <a href="/" class="nav-link" @click.prevent="goSection('pricing')">{{
          t('nav.pricing')
        }}</a>
        <a href="/" class="nav-link" @click.prevent="goSection('contact')">{{
          t('nav.support')
        }}</a>
      </div>

      <!-- Right Actions -->
      <div class="desktop-actions">
        <div class="lang-switcher">
          <select v-model="$i18n.locale" class="lang-select">
            <option v-for="lang in languages" :key="lang.code" :value="lang.code">
              {{ lang.name }}
            </option>
          </select>
        </div>

        <template v-if="!isAuthenticated">
          <router-link to="/login" class="btn-login-nav">
            <LogIn :size="16" :stroke-width="2.25" />
            {{ t('nav.login') }}
          </router-link>
          <a href="/" class="btn-cta" @click.prevent="goSection('contact')">
            {{ t('nav.start_trial') }}
          </a>
        </template>
        <template v-else>
          <button class="btn-login-nav" @click="goToDashboard">
            <LayoutDashboard :size="16" :stroke-width="2.25" />
            {{ t('nav.dashboard') }}
          </button>
        </template>
      </div>

      <!-- Mobile Hamburger -->
      <button class="menu-toggle" @click="toggleMenu" aria-label="Toggle navigation">
        <span class="hamburger" :class="{ 'is-active': isMenuOpen }"></span>
      </button>

      <!-- Mobile Nav -->
      <div :class="['mobile-nav', { 'is-open': isMenuOpen }]">
        <div class="mobile-nav-inner">
          <div class="mobile-nav-links">
            <a href="/" class="mobile-link" @click.prevent="goSectionAndClose('features')">{{
              t('nav.features')
            }}</a>
            <a href="/" class="mobile-link" @click.prevent="goSectionAndClose('hardware')">{{
              t('nav.hardware')
            }}</a>
            <a href="/" class="mobile-link" @click.prevent="goSectionAndClose('pricing')">{{
              t('nav.pricing')
            }}</a>
            <a href="/" class="mobile-link" @click.prevent="goSectionAndClose('contact')">{{
              t('nav.support')
            }}</a>
          </div>

          <div class="mobile-lang">
            <button
              v-for="lang in languages"
              :key="lang.code"
              @click="locale = lang.code"
              :class="['lang-btn', { active: locale === lang.code }]"
            >
              {{ lang.name }}
            </button>
          </div>

          <div class="mobile-actions">
            <template v-if="!isAuthenticated">
              <router-link
                to="/login"
                class="btn-login-nav btn-login-nav--mobile"
                @click="closeMenu"
              >
                <LogIn :size="18" :stroke-width="2.25" />
                {{ t('nav.login') }}
              </router-link>
              <a
                href="/"
                class="btn-cta btn-cta--mobile"
                @click.prevent="goSectionAndClose('contact')"
              >
                {{ t('nav.start_trial') }}
              </a>
            </template>
            <template v-else>
              <button class="btn-login-nav btn-login-nav--mobile" @click="goToDashboard">
                <LayoutDashboard :size="18" :stroke-width="2.25" />
                {{ t('nav.dashboard') }}
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  padding: 1rem 0;
  transition: all 0.3s ease;
}

.navbar-scrolled {
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 1px 20px rgba(0, 0, 0, 0.06);
  padding: 0.75rem 0;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  gap: 2rem;
}

.logo-link {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  cursor: pointer;
}

.logo-link * {
  pointer-events: none;
}

.logo-img {
  height: 48px;
  width: auto;
}

/* Desktop nav */
.desktop-nav {
  display: flex;
  align-items: center;
  gap: 2rem;
  flex: 1;
  justify-content: center;
}

.nav-link {
  font-size: 0.9rem;
  font-weight: 500;
  color: #475569;
  text-decoration: none;
  transition: color 0.2s;
  position: relative;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 2px;
  background: #007bff;
  border-radius: 2px;
  transition: width 0.2s ease;
}

.nav-link:hover {
  color: #007bff;
}

.nav-link:hover::after {
  width: 100%;
}

/* Right actions */
.desktop-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
}

.lang-select {
  padding: 0.4rem 0.6rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: transparent;
  font-family: inherit;
  font-size: 0.85rem;
  color: #475569;
  cursor: pointer;
  outline: none;
  transition: border-color 0.2s;
}

.lang-select:focus {
  border-color: #007bff;
}

.btn-login-nav {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0.5rem 1rem;
  border-radius: 100px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  text-decoration: none;
  border: 1.5px solid #e2e8f0;
  background: #fff;
  transition: all 0.2s ease;
}

.btn-login-nav:hover {
  border-color: #007bff;
  color: #007bff;
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.12);
}

.btn-cta {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1.1rem;
  border-radius: 100px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #fff;
  text-decoration: none;
  background: linear-gradient(135deg, #007bff, #6366f1);
  box-shadow: 0 2px 12px rgba(0, 123, 255, 0.3);
  transition: all 0.2s ease;
}

.btn-cta:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(0, 123, 255, 0.4);
}

/* Mobile toggle */
.menu-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  z-index: 1010;
  margin-left: auto;
}

.hamburger {
  display: block;
  width: 22px;
  height: 2px;
  background: #1e293b;
  position: relative;
  transition: all 0.3s ease;
}

.hamburger::before,
.hamburger::after {
  content: '';
  position: absolute;
  width: 22px;
  height: 2px;
  background: #1e293b;
  left: 0;
  transition: all 0.3s ease;
}

.hamburger::before {
  top: -7px;
}
.hamburger::after {
  bottom: -7px;
}

.hamburger.is-active {
  background: transparent;
}
.hamburger.is-active::before {
  transform: rotate(45deg);
  top: 0;
}
.hamburger.is-active::after {
  transform: rotate(-45deg);
  bottom: 0;
}

/* Mobile nav */
.mobile-nav {
  position: fixed;
  inset: 0;
  background: #fff;
  transform: translateX(100%);
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1005;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mobile-nav.is-open {
  transform: translateX(0);
}

.mobile-nav-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2.5rem;
  padding: 2rem;
  width: 100%;
}

.mobile-nav-links {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.mobile-link {
  font-size: 1.4rem;
  font-weight: 600;
  color: #0f172a;
  text-decoration: none;
  transition: color 0.2s;
}

.mobile-link:hover {
  color: #007bff;
}

.mobile-lang {
  display: flex;
  gap: 0.5rem;
}

.lang-btn {
  padding: 0.45rem 1rem;
  border: 1.5px solid #e2e8f0;
  border-radius: 100px;
  background: transparent;
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.lang-btn.active {
  background: #007bff;
  color: #fff;
  border-color: #007bff;
}

.mobile-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 100%;
  max-width: 280px;
}

.btn-login-nav--mobile {
  width: 100%;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
}

.btn-cta--mobile {
  width: 100%;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border-radius: 12px;
}

@media (max-width: 900px) {
  .desktop-nav,
  .desktop-actions {
    display: none;
  }
  .menu-toggle {
    display: block;
  }
}
</style>
