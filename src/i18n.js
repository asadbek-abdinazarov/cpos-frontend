import { createI18n } from 'vue-i18n'
import uz from './locales/uz.json'
import oz from './locales/oz.json'
import ru from './locales/ru.json'

export const SUPPORTED_LOCALES = ['uz', 'oz', 'ru']
const STORAGE_KEY = 'cpos-locale'

// Til tanlovi ?lang= dan (Google indeksidagi hreflang havolalari shu ko'rinishda),
// so'ng localStorage'dan, oxirida brauzer tilidan olinadi.
function resolveInitialLocale() {
  if (typeof window === 'undefined') return 'uz'

  const fromQuery = new URLSearchParams(window.location.search).get('lang')
  if (SUPPORTED_LOCALES.includes(fromQuery)) return fromQuery

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (SUPPORTED_LOCALES.includes(stored)) return stored
  } catch {
    // Private rejimda localStorage o'qish xato berishi mumkin — e'tiborsiz qoldiramiz
  }

  const browser = (navigator.language || '').toLowerCase()
  if (browser.startsWith('ru')) return 'ru'
  return 'uz'
}

const i18n = createI18n({
  locale: resolveInitialLocale(),
  fallbackLocale: 'uz',
  legacy: false, // Usage with Composition API
  messages: {
    uz,
    oz,
    ru,
  },
})

export function persistLocale(code) {
  if (!SUPPORTED_LOCALES.includes(code)) return
  try {
    localStorage.setItem(STORAGE_KEY, code)
  } catch {
    // Saqlay olmasak ham til joriy sessiyada ishlayveradi
  }
}

export default i18n
