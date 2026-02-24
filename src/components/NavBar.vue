<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

const languages = [
  { code: 'uz', name: 'O\'zbek' },
  { code: 'oz', name: 'Ўзбек' },
  { code: 'ru', name: 'Русский' }
]

const currentFlag = (code) => {
  // Optional: Add flags if needed, or just return name
  return code.toUpperCase()
}

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
        <a href="#">
          <img src="/logo-nav.svg" alt="CPOS Logo" class="logo-img" />
        </a>
      </div>

      <!-- Center: Desktop Nav -->
      <div class="nav-links desktop-nav">
        <a href="#features" class="nav-link">{{ t('nav.features') }}</a>
        <a href="#hardware" class="nav-link">{{ t('nav.hardware') }}</a>
        <a href="#pricing" class="nav-link">{{ t('nav.pricing') }}</a>
        <a href="#contact" class="nav-link">{{ t('nav.support') }}</a>
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
          <router-link to="/login" class="login-link">{{ t('nav.login') }}</router-link>
          <router-link to="/register" class="btn btn-primary" tag="button">{{ t('nav.register') }}</router-link>
        </template>
        <template v-else>
          <router-link to="/dashboard" class="btn btn-primary" tag="button">{{ t('nav.dashboard') || 'Go to Dashboard' }}</router-link>
        </template>
      </div>
      
      <!-- Mobile Menu Button -->
      <button class="menu-toggle" @click="toggleMenu" aria-label="Toggle navigation">
        <span class="hamburger" :class="{ 'is-active': isMenuOpen }"></span>
      </button>

      <!-- Mobile Nav Overlay -->
      <div :class="['mobile-nav', { 'is-open': isMenuOpen }]">
        <div class="mobile-nav-links">
          <a href="#features" class="nav-link" @click="closeMenu">{{ t('nav.features') }}</a>
          <a href="#hardware" class="nav-link" @click="closeMenu">{{ t('nav.hardware') }}</a>
          <a href="#pricing" class="nav-link" @click="closeMenu">{{ t('nav.pricing') }}</a>
          <a href="#contact" class="nav-link" @click="closeMenu">{{ t('nav.support') }}</a>
          
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
               <router-link to="/login" class="login-link" @click="closeMenu">{{ t('nav.login') }}</router-link>
               <router-link to="/register" class="btn btn-primary" @click="closeMenu">{{ t('nav.start_trial') }}</router-link>
             </template>
             <template v-else>
               <router-link to="/dashboard" class="btn btn-primary" @click="closeMenu">{{ t('nav.dashboard') || 'Go to Dashboard' }}</router-link>
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
  border-bottom: 1px solid rgba(0,0,0,0.05);
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
  border: 1px solid #E2E8F0;
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

.login-link {
  font-weight: 600;
  color: var(--color-primary);
  text-decoration: none;
  font-size: 0.95rem;
}

.login-link:hover {
  text-decoration: underline;
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

.hamburger::before { top: -8px; }
.hamburger::after { bottom: -8px; }

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
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  background: transparent;
  color: #64748B;
  font-size: 0.9rem;
}

.mobile-lang-switcher button.active {
  background-color: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

@media (max-width: 900px) {
  .desktop-nav, .desktop-actions {
    display: none;
  }

  .menu-toggle {
    display: block;
  }
}
</style>
