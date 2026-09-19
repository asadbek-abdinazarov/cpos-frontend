import { watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'

const SITE_URL = 'https://cpos.uz'

// Havola ulashilganda ko'rinadigan banner (1200x630). Rasm almashtirilganda
// ?v= raqamini oshiring — Telegram va Facebook og:image'ni uzoq keshlaydi va
// aks holda eski rasmni ko'rsatib yuraveradi.
const OG_IMAGE = `${SITE_URL}/og-image.png?v=1`

// Google hreflang uchun to'liq BCP-47 kodlari. Kirill yozuvi alohida variant
// sifatida e'lon qilinadi — aks holda uz va oz bitta til deb qaraladi.
const HREFLANG = {
  uz: 'uz-Latn-UZ',
  oz: 'uz-Cyrl-UZ',
  ru: 'ru-UZ',
}

// <html lang> uchun qisqa kod
const HTML_LANG = {
  uz: 'uz',
  oz: 'uz-Cyrl',
  ru: 'ru',
}

const OG_LOCALE = {
  uz: 'uz_UZ',
  oz: 'uz_Cyrl_UZ',
  ru: 'ru_RU',
}

function upsertMeta(attr, key, content) {
  if (!content) return
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertLink(rel, href, hreflang) {
  const selector = hreflang
    ? `link[rel="${rel}"][hreflang="${hreflang}"]`
    : `link[rel="${rel}"]:not([hreflang])`
  let el = document.head.querySelector(selector)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    if (hreflang) el.setAttribute('hreflang', hreflang)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

/**
 * Sahifa meta ma'lumotlarini joriy tilga moslab yangilaydi.
 *
 * @param {object} options
 * @param {() => string} options.title      Sahifa sarlavhasi (reaktiv getter)
 * @param {() => string} [options.description]
 * @param {() => string} [options.keywords]
 * @param {() => string} [options.ogDescription] Ijtimoiy tarmoqlar uchun qisqaroq matn
 * @param {string} [options.path]           Canonical yo'l, masalan '/login'
 * @param {boolean} [options.noindex]       Kabinet sahifalari uchun
 */
export function useSeo(options) {
  const { locale } = useI18n()
  const path = options.path ?? '/'
  const canonical = `${SITE_URL}${path === '/' ? '/' : path}`

  watchEffect(() => {
    const lang = locale.value
    const title = options.title()
    const description = options.description?.()
    const keywords = options.keywords?.()
    const ogDescription = options.ogDescription?.() ?? description

    document.title = title
    document.documentElement.setAttribute('lang', HTML_LANG[lang] ?? 'uz')

    upsertMeta('name', 'description', description)
    upsertMeta('name', 'keywords', keywords)

    upsertMeta('property', 'og:type', 'website')
    upsertMeta('property', 'og:site_name', 'CPOS')
    upsertMeta('property', 'og:title', title)
    upsertMeta('property', 'og:description', ogDescription)
    upsertMeta('property', 'og:url', canonical)
    upsertMeta('property', 'og:locale', OG_LOCALE[lang] ?? 'uz_UZ')
    upsertMeta('property', 'og:image', OG_IMAGE)

    upsertMeta('name', 'twitter:card', 'summary_large_image')
    upsertMeta('name', 'twitter:title', title)
    upsertMeta('name', 'twitter:description', ogDescription)
    upsertMeta('name', 'twitter:image', OG_IMAGE)

    upsertMeta('name', 'robots', options.noindex ? 'noindex, nofollow' : 'index, follow')

    upsertLink('canonical', canonical)
    for (const [code, tag] of Object.entries(HREFLANG)) {
      upsertLink('alternate', `${canonical}${canonical.includes('?') ? '&' : '?'}lang=${code}`, tag)
    }
    upsertLink('alternate', canonical, 'x-default')
  })
}

export { SITE_URL, HREFLANG, HTML_LANG }
