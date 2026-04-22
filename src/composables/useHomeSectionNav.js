import { nextTick } from 'vue'

export function scrollToSectionId(id) {
  if (!id || typeof id !== 'string') return
  const el = document.getElementById(id)
  if (!el) return

  const navbar = document.querySelector('nav')
  const navHeight = navbar ? navbar.offsetHeight : 80
  const top = el.getBoundingClientRect().top + window.scrollY - navHeight
  window.scrollTo({ top, behavior: 'smooth' })
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
