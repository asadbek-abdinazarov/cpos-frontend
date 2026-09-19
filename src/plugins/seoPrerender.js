import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

/**
 * Build paytida index.html ichiga statik, indekslanadigan kontent joylaydi.
 *
 * Googlebot JS'ni render qiladi, lekin bu ikkinchi navbatdagi ("render queue")
 * jarayon va kunlar davomida kechikishi mumkin. Yandex hamda ijtimoiy
 * tarmoqlarning bot'lari esa JS'ni umuman bajarmaydi. Shuning uchun asosiy
 * matn #app ichiga oldindan yoziladi — Vue mount bo'lganda uni almashtiradi,
 * foydalanuvchi hech narsani sezmaydi.
 */
export default function seoPrerender() {
  return {
    name: 'cpos-seo-prerender',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        warnIfOgImageMissing(this)

        const uz = JSON.parse(
          readFileSync(fileURLToPath(new URL('../locales/uz.json', import.meta.url)), 'utf-8'),
        )

        const faqLd = renderFaqJsonLd(uz)
        const block = renderStaticContent(uz)

        // Blok DOM'da va matn sifatida o'qiladi, lekin JS yuklanayotgan bir
        // lahzada foydalanuvchiga xom matn ko'rinmasligi uchun shaffof bo'ladi.
        // Bot'lar uchun `visibility` yoki `display:none` dan farqli o'laroq,
        // opacity kontentni indeksdan chiqarmaydi.
        const style = `<style>#seo-prerender{opacity:0;pointer-events:none;position:absolute;top:0;left:0;width:100%;z-index:-1}</style>`

        return html
          .replace('</head>', `${faqLd}${style}\n</head>`)
          .replace('<div id="app"></div>', `<div id="app">${block}</div>`)
      },
    },
  }
}

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/**
 * og:image meta'da e'lon qilingan, lekin public/ da yo'q bo'lsa ogohlantiradi.
 * Bunday holatda Telegram va Facebook havolani rasmsiz, kichik ko'rinishda
 * chiqaradi — build o'zi muvaffaqiyatli bo'lgani uchun buni sezmay qolish oson.
 */
function warnIfOgImageMissing(ctx) {
  const path = fileURLToPath(new URL('../../public/og-image.png', import.meta.url))
  if (existsSync(path)) return

  ctx.warn(
    'public/og-image.png topilmadi — og:image meta 404 ga ishora qilmoqda. ' +
      'Havola ulashilganda banner ko\'rinmaydi. 1200x630 PNG qo\'shing.',
  )
}

/** FAQPage sxemasi — Google qidiruvda savol-javob ko'rinishini beradi */
function renderFaqJsonLd(m) {
  const items = m.faq?.list ?? []
  if (!items.length) return ''

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: 'uz',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }

  // </script> ketma-ketligi JSON ichida bo'lsa HTML parser'ni buzadi
  const json = JSON.stringify(ld).replace(/</g, '\\u003c')
  return `    <script type="application/ld+json">${json}</script>\n`
}

function renderStaticContent(m) {
  const detailed = m.detailed_features ?? {}
  const detailKeys = Object.keys(detailed).filter(
    (k) => detailed[k] && typeof detailed[k] === 'object' && detailed[k].title,
  )

  const featureList = Object.values(m.features?.list ?? {})
  const steps = m.capabilities?.steps ?? []
  const faq = m.faq?.items ?? m.faq?.list ?? []

  // Vue mount bo'lganda #app ichidagi hamma narsa almashtiriladi, shu jumladan
  // bu blok ham. Google uchun bu "cloaking" emas: matn bot ko'radigan versiyada
  // ham, render qilingan sahifada ham bir xil — faqat ikkinchisida chiroyliroq
  // komponentlar bilan ko'rsatiladi.
  return `<div id="seo-prerender">
<h1>${esc(m.seo?.home?.title ?? 'CPOS')}</h1>
<p>${esc(m.seo?.home?.description ?? '')}</p>
<p>${esc(m.hero?.subtitle ?? '')}</p>

<h2>${esc(m.features?.title ?? '')} ${esc(m.features?.title_highlight ?? '')}</h2>
<p>${esc(m.features?.subtitle ?? '')}</p>
<ul>${featureList
    .map((f) => `<li><strong>${esc(f.title)}</strong> — ${esc(f.desc)}</li>`)
    .join('')}</ul>

<h2>${esc(detailed.title ?? '')}</h2>
<p>${esc(detailed.subtitle ?? '')}</p>
${detailKeys
  .map(
    (k) => `<section><h3>${esc(detailed[k].title)}</h3><p>${esc(detailed[k].desc ?? '')}</p>
<ul>${(detailed[k].list ?? []).map((i) => `<li>${esc(i)}</li>`).join('')}</ul></section>`,
  )
  .join('')}

<h2>${esc(m.capabilities?.title ?? '')}</h2>
<p>${esc(m.capabilities?.subtitle ?? '')}</p>
<ol>${steps
    .map((s) => `<li><strong>${esc(s.title)}</strong> — ${esc(s.desc)}</li>`)
    .join('')}</ol>

${
  faq.length
    ? `<h2>${esc(m.faq?.title ?? '')}</h2>
<dl>${faq
        .map(
          (q) =>
            `<dt>${esc(q.question ?? q.q ?? '')}</dt><dd>${esc(q.answer ?? q.a ?? '')}</dd>`,
        )
        .join('')}</dl>`
    : ''
}
</div>`
}
