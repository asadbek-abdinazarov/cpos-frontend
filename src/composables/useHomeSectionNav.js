import { nextTick } from 'vue'

function getNavOffset() {
  const navbar = document.querySelector('nav')
  return (navbar ? navbar.offsetHeight : 72) + 12
}

function targetTopOf(el) {
  return Math.max(0, el.getBoundingClientRect().top + window.scrollY - getNavOffset())
}

/**
 * AOS bo'limlarni ko'rinishga kirganda animatsiya qiladi, ya'ni scroll davomida
 * sahifa balandligi o'zgaradi va nishon joyidan siljiydi. Shuning uchun bir marta
 * scroll qilib qo'yish yetarli emas — harakat tugagach nishonni qayta o'lchaymiz.
 */
function settleScroll(el, attempt = 0) {
  const top = targetTopOf(el)
  window.scrollTo({ top, behavior: attempt === 0 ? 'smooth' : 'auto' })

  if (attempt >= 4) return

  let idleFrames = 0
  let lastY = window.scrollY

  const watch = () => {
    const y = window.scrollY
    idleFrames = Math.abs(y - lastY) < 1 ? idleFrames + 1 : 0
    lastY = y

    // Harakat to'xtadi — nishon hali ham joyidami?
    if (idleFrames >= 3) {
      if (Math.abs(targetTopOf(el) - window.scrollY) > 4) settleScroll(el, attempt + 1)
      return
    }
    requestAnimationFrame(watch)
  }
  requestAnimationFrame(watch)
}

export function scrollToSectionId(id) {
  if (!id || typeof id !== 'string') return
  const el = document.getElementById(id)
  if (!el) return
  settleScroll(el)
}

/**
 * Bosh sahifadagi bo'limga o'tish: URLda # ishlatilmaydi.
 * Boshqa sahifada bo'lsa — /?section=id orqali HomeView scroll qiladi va query tozalanadi.
 */
export async function goToHomeSection(router, id) {
  const path = router.currentRoute.value.path
  if (path === '/' || path === '') {
    await nextTick()
    requestAnimationFrame(() => scrollToSectionId(id))
    return
  }
  await router.push({ path: '/', query: { section: id } })
}
