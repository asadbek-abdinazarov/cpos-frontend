<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { LogIn, LayoutDashboard } from 'lucide-vue-next'

const { t, locale } = useI18n()

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
    <div class="container navbar-content">
      <!-- Left: Logo -->
      <div class="logo">
        <router-link to="/" class="logo-link">
          <img src="/logo-nav.svg" alt="CPOS Logo" class="logo-img" />
        </router-link>
      </div>

      <!-- Center: Desktop Nav -->
      <div class="nav-links desktop-nav">
        <a href="/#features" class="nav-link">{{ t('nav.features') }}</a>
        <a href="/#hardware" class="nav-link">{{ t('nav.hardware') }}</a>
        <a href="/#pricing" class="nav-link">{{ t('nav.pricing') }}</a>
        <a href="/#contact" class="nav-link">{{ t('nav.support') }}</a>
      </div>

      <!-- Right: Actions -->
      <div class="nav-actions desktop-actions">
        <!-- Language Switcher -->
        <div class="lang-switcher">
          <select v-model="$i18n.locale" class="lang-select">
            <option v-for="lang in languages" :key="lang.code" :value="lang.code">
              {{ lang.name }}
            </option>
          </select>
        </div>

        <template v-if="!isAuthenticated">
          <router-link to="/login" class="btn-login-nav">
            <LogIn class="btn-login-nav-icon" :size="18" :stroke-width="2.25" aria-hidden="true" />
            {{ t('nav.login') }}
          </router-link>
        </template>
        <template v-else>
          <router-link to="/dashboard" class="btn-login-nav">
            <LayoutDashboard
              class="btn-login-nav-icon"
              :size="18"
              :stroke-width="2.25"
              aria-hidden="true"
            />
            {{ t('nav.dashboard') }}
          </router-link>
        </template>
      </div>

      <!-- Mobile Menu Button -->
      <button class="menu-toggle" @click="toggleMenu" aria-label="Toggle navigation">
        <span class="hamburger" :class="{ 'is-active': isMenuOpen }"></span>
      </button>

      <!-- Mobile Nav Overlay -->
      <div :class="['mobile-nav', { 'is-open': isMenuOpen }]">
        <div class="mobile-nav-links">
          <a href="/#features" class="nav-link" @click="closeMenu">{{ t('nav.features') }}</a>
          <a href="/#hardware" class="nav-link" @click="closeMenu">{{ t('nav.hardware') }}</a>
          <a href="/#pricing" class="nav-link" @click="closeMenu">{{ t('nav.pricing') }}</a>
          <a href="/#contact" class="nav-link" @click="closeMenu">{{ t('nav.support') }}</a>

          <div class="mobile-lang-switcher">
            <button
              v-for="lang in languages"
              :key="lang.code"
              @click="locale = lang.code"
              :class="{ active: locale === lang.code }"
            >
              {{ lang.name }}
            </button>
          </div>

          <div class="mobile-actions">
            <template v-if="!isAuthenticated">
              <router-link to="/login" class="btn-login-nav btn-login-nav--mobile" @click="closeMenu">
                <LogIn class="btn-login-nav-icon" :size="20" :stroke-width="2.25" aria-hidden="true" />
                {{ t('nav.login') }}
              </router-link>
              <a href="/#contact" class="btn btn-primary" @click="closeMenu">{{
                t('nav.start_trial')
              }}</a>
            </template>
            <template v-else>
              <router-link to="/dashboard" class="btn-login-nav btn-login-nav--mobile" @click="closeMenu">
                <LayoutDashboard
                  class="btn-login-nav-icon"
                  :size="20"
                  :stroke-width="2.25"
                  aria-hidden="true"
                />
                {{ t('nav.dashboard') }}
              </router-link>
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
  padding: 1rem 0;
  z-index: 1000;
  transition: all 0.3s ease;
  background-color: transparent;
  border-bottom: 1px solid transparent;
}

.navbar-scrolled {
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: var(--shadow-sm);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.navbar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Logo Styles */
.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
}

.logo-img {
  height: 50px;
  width: auto;
  display: block;
}

/* Navigation Links */
.desktop-nav {
  display: flex;
  gap: 2.5rem;
  align-items: center;
}

.nav-link {
  font-weight: 500;
  color: #475569; /* Slate 600 */
  text-decoration: none;
  transition: color 0.2s ease;
  font-size: 0.95rem;
}

.nav-link:hover {
  color: var(--color-primary);
}

/* Right Actions */
.desktop-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.lang-select {
  padding: 0.5rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background-color: transparent;
  font-family: inherit;
  font-size: 0.9rem;
  color: #475569;
  cursor: pointer;
  outline: none;
}

.lang-select:focus {
  border-color: var(--color-primary);
}

/* Kirish — outline pill tugma */
.btn-login-nav {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  padding: 0.5rem 1.1rem;
  border-radius: 9999px;
  font-weight: 600;
  font-size: 0.9rem;
  letter-spacing: 0.01em;
  text-decoration: none;
  color: var(--color-primary);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%);
  border: 1.5px solid rgba(0, 123, 255, 0.35);
  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease,
    color 0.2s ease;
}

.btn-login-nav-icon {
  flex-shrink: 0;
  opacity: 0.92;
}

.btn-login-nav:hover {
  color: var(--color-primary-dark);
  background: linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%);
  border-color: var(--color-primary);
  box-shadow:
    0 4px 14px rgba(0, 86, 179, 0.18),
    0 1px 2px rgba(15, 23, 42, 0.06);
  transform: translateY(-1px);
}

.btn-login-nav:active {
  transform: translateY(0);
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.08);
}

.btn-login-nav:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 3px;
}

.btn-login-nav--mobile {
  padding: 0.65rem 1.35rem;
  font-size: 1.05rem;
}

.btn {
  padding: 0.6rem 1.25rem;
  border-radius: 50px; /* Pill shape */
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.btn-primary {
  background-color: var(--color-primary);
  color: var(--color-white);
}

.btn-primary:hover {
  background-color: #004494;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(0, 86, 179, 0.2);
}

/* Mobile Menu Styles */
.menu-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 1001;
  padding: 10px;
}

.hamburger {
  display: block;
  width: 24px;
  height: 2px;
  background-color: var(--color-text-main);
  position: relative;
  transition: all 0.3s ease-in-out;
}

.hamburger::before,
.hamburger::after {
  content: '';
  position: absolute;
  width: 24px;
  height: 2px;
  background-color: var(--color-text-main);
  transition: all 0.3s ease-in-out;
  left: 0;
}

.hamburger::before {
  top: -8px;
}
.hamburger::after {
  bottom: -8px;
}

.hamburger.is-active {
  background-color: transparent;
}

.hamburger.is-active::before {
  transform: rotate(45deg);
  top: 0;
}

.hamburger.is-active::after {
  transform: rotate(-45deg);
  bottom: 0;
}

.mobile-nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: var(--color-white);
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateX(100%);
  transition: transform 0.3s ease-in-out;
  padding-top: 4rem;
}

.mobile-nav.is-open {
  transform: translateX(0);
}

.mobile-nav-links {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.mobile-nav-links .nav-link {
  font-size: 1.5rem;
}

.mobile-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  margin-top: 1rem;
}

.mobile-lang-switcher {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.mobile-lang-switcher button {
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: transparent;
  color: #64748b;
  font-size: 0.9rem;
}

.mobile-lang-switcher button.active {
  background-color: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
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
