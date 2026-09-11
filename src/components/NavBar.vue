<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { goToHomeSection } from '@/composables/useHomeSectionNav'
import { LogIn, LayoutDashboard } from 'lucide-vue-next'
import { enterDashboard } from '@/composables/useAppLoader'

const { t, locale } = useI18n()
const router = useRouter()

const languages = [
  { code: 'uz', name: "O'zbek" },
  { code: 'oz', name: 'Ўзбек' },
  { code: 'ru', name: 'Русский' },
]

const sections = [
  { id: 'features', label: 'nav.features' },
  { id: 'workflow', label: 'footer.capabilities' },
  { id: 'pricing', label: 'nav.pricing' },
  { id: 'contact', label: 'nav.support' },
]

const isScrolled = ref(false)
const isMenuOpen = ref(false)
const isAuthenticated = ref(false)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

const closeMenu = () => {
  isMenuOpen.value = false
}

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const goSection = (id) => {
  closeMenu()
  goToHomeSection(router, id)
}

const goToDashboard = () => {
  closeMenu()
  enterDashboard(() => router.push('/dashboard'))
}

const handleLogoClick = () => {
  closeMenu()
  if (router.currentRoute.value.path === '/') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } else {
    router.push('/')
  }
}

const onKeydown = (e) => {
  if (e.key === 'Escape') closeMenu()
}

// Menyu ochiqligida orqa fon skroll qilinmasin
watch(isMenuOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
})

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('keydown', onKeydown)
  isAuthenticated.value = !!localStorage.getItem('userId')
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <nav :class="['navbar', { 'navbar-scrolled': isScrolled }]">
    <div class="nav-container">
      <a href="/" class="logo-link" @click.prevent="handleLogoClick">
        <img src="/logo-nav.svg" alt="CPOS" class="logo-img" />
      </a>

      <!-- Desktop -->
      <div class="desktop-nav">
        <a
          v-for="s in sections"
          :key="s.id"
          href="/"
          class="nav-link"
          @click.prevent="goSection(s.id)"
          >{{ t(s.label) }}</a
        >
      </div>

      <div class="desktop-actions">
        <select v-model="locale" class="lang-select" :aria-label="'Til / Язык'">
          <option v-for="lang in languages" :key="lang.code" :value="lang.code">
            {{ lang.name }}
          </option>
        </select>

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

      <!-- Mobil tugma -->
      <button
        class="menu-toggle"
        :class="{ 'is-open': isMenuOpen }"
        @click="toggleMenu"
        :aria-expanded="isMenuOpen"
        aria-controls="mobile-nav"
        aria-label="Menyu"
      >
        <span class="hamburger"></span>
      </button>
    </div>

    <!-- Mobil menyu: navbar'da backdrop-filter bor — u fixed avlodlar uchun
         containing block yaratadi, shuning uchun menyu body'ga teleport qilinadi -->
    <Teleport to="body">
      <Transition name="menu">
        <div v-if="isMenuOpen" id="mobile-nav" class="mobile-nav">
          <button class="menu-close" @click="closeMenu" aria-label="Yopish">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.25"
              stroke-linecap="round"
              aria-hidden="true"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>

          <div class="mobile-nav-inner">
            <div class="mobile-nav-links">
              <a
                v-for="s in sections"
                :key="s.id"
                href="/"
                class="mobile-link"
                @click.prevent="goSection(s.id)"
                >{{ t(s.label) }}</a
              >
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
                <router-link to="/login" class="btn-login-nav btn-block" @click="closeMenu">
                  <LogIn :size="18" :stroke-width="2.25" />
                  {{ t('nav.login') }}
                </router-link>
                <a href="/" class="btn-cta btn-block" @click.prevent="goSection('contact')">
                  {{ t('nav.start_trial') }}
                </a>
              </template>
              <template v-else>
                <button class="btn-login-nav btn-block" @click="goToDashboard">
                  <LayoutDashboard :size="18" :stroke-width="2.25" />
                  {{ t('nav.dashboard') }}
                </button>
              </template>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </nav>
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  padding: 0.75rem 0;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid transparent;
  transition:
    padding 0.3s ease,
    box-shadow 0.3s ease,
    border-color 0.3s ease;
  padding-top: max(0.75rem, env(safe-area-inset-top));
}

.navbar-scrolled {
  border-bottom-color: rgba(0, 0, 0, 0.06);
  box-shadow: 0 1px 20px rgba(0, 0, 0, 0.06);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--page-gutter, 2rem);
  display: flex;
  align-items: center;
  gap: 2rem;
}

.logo-link {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.logo-link * {
  pointer-events: none;
}

.logo-img {
  height: clamp(36px, 8vw, 46px);
  width: auto;
}

/* ─── Desktop ────────────────────────────────── */
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
  white-space: nowrap;
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

.desktop-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
}

.lang-select {
  padding: 0.45rem 0.6rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: transparent;
  font-family: inherit;
  font-size: 0.85rem;
  color: #475569;
  cursor: pointer;
  outline: none;
}

.lang-select:focus-visible {
  border-color: #007bff;
}

.btn-login-nav {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 0.55rem 1rem;
  border-radius: 100px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  text-decoration: none;
  border: 1.5px solid #e2e8f0;
  background: #fff;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.btn-login-nav:hover {
  border-color: #007bff;
  color: #007bff;
}

.btn-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.55rem 1.1rem;
  border-radius: 100px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #fff;
  text-decoration: none;
  background: linear-gradient(135deg, #007bff, #6366f1);
  box-shadow: 0 2px 12px rgba(0, 123, 255, 0.3);
  transition: all 0.2s ease;
  white-space: nowrap;
}

.btn-cta:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(0, 123, 255, 0.4);
}

/* ─── Mobil tugma ────────────────────────────── */
.menu-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  margin-left: auto;
  margin-right: -10px;
}

.hamburger,
.hamburger::before,
.hamburger::after {
  display: block;
  width: 22px;
  height: 2px;
  background: #1e293b;
  border-radius: 2px;
  transition: all 0.3s ease;
}

.hamburger {
  position: relative;
}

.hamburger::before,
.hamburger::after {
  content: '';
  position: absolute;
  left: 0;
}

.hamburger::before {
  top: -7px;
}

.hamburger::after {
  top: 7px;
}

.menu-toggle.is-open .hamburger {
  background: transparent;
}

.menu-toggle.is-open .hamburger::before {
  transform: translateY(7px) rotate(45deg);
}

.menu-toggle.is-open .hamburger::after {
  transform: translateY(-7px) rotate(-45deg);
}

/* ─── Mobil menyu ────────────────────────────── */
.mobile-nav {
  position: fixed;
  inset: 0;
  background: #fff;
  /* navbar (1000) ustida turadi — menyuning o'z yopish tugmasi bor */
  z-index: 1100;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding-top: max(1rem, env(safe-area-inset-top));
  padding-bottom: max(2rem, env(safe-area-inset-bottom));
}

.menu-close {
  position: absolute;
  top: max(1rem, env(safe-area-inset-top));
  right: 1rem;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 50%;
  background: #f1f5f9;
  color: #0f172a;
  cursor: pointer;
  z-index: 1;
}

.menu-close:active {
  background: #e2e8f0;
}

.mobile-nav-inner {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem var(--page-gutter, 1.5rem);
  min-height: 100%;
  justify-content: center;
}

.mobile-nav-links {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.mobile-link {
  font-size: 1.25rem;
  font-weight: 600;
  color: #0f172a;
  text-decoration: none;
  padding: 0.85rem 0;
  border-bottom: 1px solid #f1f5f9;
}

.mobile-link:active {
  color: #007bff;
}

.mobile-lang {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.lang-btn {
  flex: 1;
  min-width: 88px;
  min-height: 44px;
  padding: 0.5rem 0.75rem;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  background: transparent;
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 600;
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
  gap: 0.75rem;
}

.btn-block {
  width: 100%;
  min-height: 50px;
  font-size: 1rem;
  border-radius: 12px;
}

/* Menyu animatsiyasi */
.menu-enter-active,
.menu-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}

.menu-enter-from,
.menu-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

@media (max-width: 900px) {
  .desktop-nav,
  .desktop-actions {
    display: none;
  }

  .menu-toggle {
    display: flex;
  }
}

@media (prefers-reduced-motion: reduce) {
  .menu-enter-active,
  .menu-leave-active,
  .hamburger,
  .hamburger::before,
  .hamburger::after {
    transition: none;
  }
}
</style>
