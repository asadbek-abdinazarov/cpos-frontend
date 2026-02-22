import { createI18n } from 'vue-i18n'
import uz from './locales/uz.json'
import oz from './locales/oz.json'
import ru from './locales/ru.json'

const i18n = createI18n({
  locale: 'uz', // default locale
  fallbackLocale: 'uz',
  legacy: false, // Usage with Composition API
  messages: {
    uz,
    oz,
    ru
  }
})

export default i18n
