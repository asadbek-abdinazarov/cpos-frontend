import { unref } from 'vue'
import i18n from '@/i18n'

/** i18n locale kodlari → backend kutadigan til teglari */
const LOCALE_TO_API = {
  uz: 'uz-Latn',
  oz: 'uz-Cyrl',
  ru: 'ru',
}

/**
 * Joriy UI tili bo‘yicha backend xabarlariga mos til identifikatori.
 * Query (?lang=), Accept-Language va X-Locale uchun ishlatiladi.
 */
export function getApiLocaleTag() {
  const code = unref(i18n.global.locale)
  return LOCALE_TO_API[code] || LOCALE_TO_API.uz
}
