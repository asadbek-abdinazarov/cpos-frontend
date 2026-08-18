# Prompt: CPOS Login — Brand Panel Animation

> Quyidagi promptni to'liq nusxalab Claude'ga bering.
> Fayl: `src/views/LoginView.vue` → `<aside class="brand-panel">` bloki.

---

## PROMPT (nusxalash uchun)

You are a senior frontend engineer and motion designer. Build a single, self-contained
signature animation for the left brand panel of a POS (Point of Sale) SaaS login screen.

### 1. Context — the product

CPOS is a cloud Point-of-Sale system for small and medium retail businesses in Uzbekistan
(shops, clothing stores, markets). Its users are shop owners and cashiers — not developers.
The login screen is often the very first impression of the product, and it is seen many
times per day by the same people.

**The emotional job of this animation is TRUST.** A POS system holds someone's money and
their daily sales records. The motion must communicate: *this system is alive, precise,
always running, and safe to hand your business to.* It must NOT feel like a toy, a game,
or a crypto landing page.

### 2. What to replace

The panel currently contains: a logo, three floating glass "stat cards" (`.stat-card`),
a decorative concentric glow orb (`.orb-center`), a "live" pill, and a customer quote at
the bottom.

**Remove everything inside `<aside class="brand-panel">`** — the logo, the stat cards, the
orb, the live pill and the quote block, along with all their CSS
(`.bp-logo`, `.bp-visual`, `.orb-center`, `.stat-card`, `.sc-*`, `.live-pill`, `.live-dot`,
`.bp-quote`, `.quote-*`, `.qa-*`, and the `float-a` / `float-b` / `ping` keyframes).

Keep the panel shell itself: `.brand-panel`, `.bp-grid` (dot grid), and the ambient blurred
orbs `.bp-orb` / `.orb-1` / `.orb-2` / `.orb-3` — these define the existing atmosphere.

In their place, build **one cohesive animated composition** that fills the panel.

### 3. Technical constraints

- **Vue 3** with `<script setup>`, Composition API, **JavaScript (not TypeScript)**.
- All CSS goes in the existing `<style scoped>` block. Keep the `.bp-` / BEM-ish naming
  convention already used in the file.

#### Choosing the animation technology — decide, then justify

The project currently ships **no animation library**. Its dependencies are `aos`,
`chart.js`, `lucide-vue-next`, `vue-i18n`, `vue-router`, `axios`, and it builds with Vite 7.

**You choose the right tool for the composition you design — do not default to the
lowest-common-denominator option, and do not add a library out of habit.** We are willing
to install **GSAP** or **Lottie** (`lottie-web` / `vue3-lottie`) if the result is
meaningfully better for it. Evaluate honestly:

- **Pure CSS + inline SVG** — zero bundle cost, no install, GPU-composited, trivially
  respects `prefers-reduced-motion`. Genuinely sufficient for most ambient loops,
  staggered entrances, and hairline/geometry motion. Prefer this when it can carry the
  idea without contortions.
- **GSAP** (~25–70KB depending on plugins) — choose it when you need a precisely
  orchestrated timeline, seamless entrance→loop handoff, staggered sequencing with
  fine control, motion along an SVG path (`MotionPathPlugin`), morphing, or scrub/
  pause control that CSS keyframes make brittle. Note which plugins you need and
  whether any are in the paid Club tier — prefer a solution using only free plugins.
- **Lottie** (~60–120KB runtime) — only worth it for a genuinely illustrative,
  designer-authored animation exported from After Effects. **If you choose Lottie, you
  must also produce the JSON yourself** — do not assume a designer will deliver an asset.
  Be honest: if you cannot author a high-quality Lottie file here, say so and pick
  another tool rather than leaving a placeholder.

**Deliver your decision explicitly.** Before writing code, state in 3–6 sentences:
which technology you chose, what the composition needs that made it the right choice,
what the bundle cost is, and what you would have lost by picking the alternative.
If your answer is "pure CSS is enough here", say that plainly — that is a valid and
often correct outcome, and we would rather not install a dependency we don't need.

If your choice requires an install, give the exact command (e.g. `npm i gsap`) and write
the code as if it were already installed — we will run the install after we approve the
animation. Import it normally (`import gsap from 'gsap'`); do not write fallback branches
or `try/catch` guards around the import.
- The panel is `flex: 1.15` of a `min-height: 100vh` flex row, `background: #080d1a`,
  `overflow: hidden`. It is **hidden entirely below 960px** — so this is a desktop-only
  composition. Do not spend effort on mobile layout, but do not break the existing
  `@media (max-width: 960px) { .brand-panel { display: none } }` rule.

### 4. Design language to obey

Match the existing system exactly — do not invent a new palette:

| Token | Value | Use |
|---|---|---|
| Panel background | `#080d1a` | deep navy-black base |
| Primary | `#007BFF` | brand blue, main accent |
| Indigo | `#6366F1` | secondary accent, gradient partner |
| Emerald | `#10B981` / `#34D399` | "healthy / live / success" signals only |
| Text bright | `#F1F5F9` | primary text |
| Text muted | `#94A3B8` | secondary text |
| Text dim | `#64748B` | labels, captions |
| Hairlines | `rgba(255,255,255,0.06 – 0.12)` | borders, separators |
| Glass fill | `rgba(255,255,255,0.05)` | frosted surfaces |

- Font: `'Poppins', sans-serif` (already loaded). Weights in use: 500/600/700/800.
- Radii: 9–14px for small surfaces, 100px for pills.
- Frosted glass = `background: rgba(255,255,255,0.05)` + `border: 1px solid rgba(255,255,255,0.1)`
  + `backdrop-filter: blur(20px)`.

### 5. Motion principles (this is the important part)

1. **Calm, not busy.** One idea, expressed clearly. A full loop should last **8–14 seconds**
   and be reasonable to watch for minutes without irritation. No bouncing, no elastic
   overshoot, no rapid flashing, no confetti.
2. **Easing = confidence.** Use `cubic-bezier(0.4, 0, 0.2, 1)` for entrances and
   `ease-in-out` for sustained loops. Nothing linear except continuous rotation.
3. **Layered depth.** Background elements move slower and dimmer than foreground ones
   (parallax by speed and opacity, not just by size).
4. **Staggered entrance.** On mount, elements arrive in a deliberate sequence
   (60–120ms apart), never all at once. Entrance should complete within ~1.2s so a
   returning user is never kept waiting.
5. **Purposeful loop.** After the entrance, the composition settles into a slow ambient
   loop. The transition from entrance to loop must be seamless — no visible restart jump.
6. **Meaning over decoration.** Every moving element should read as *something the system
   is actually doing* — a transaction clearing, data syncing, a check passing — not as
   abstract shapes moving for their own sake.

### 6. Creative direction — pick ONE and commit to it

Choose the direction you judge strongest for conveying trust in a POS product, then
execute it fully. Do not blend all three into visual noise.

**A. "The transaction pulse"**
A vertical or circular flow where discrete data packets (small glowing nodes) travel along
thin hairline paths, arrive at a central hub, and resolve with a soft emerald check or
ring pulse. Reads as: *every sale is captured, processed and confirmed.* Emphasis on the
rhythm of completion — the satisfying moment a payment clears.

**B. "The living ledger"**
A slow vertical stream of abstracted, minimal transaction rows (amount + status glyph, no
real reading required) rising through the panel, each fading in at the bottom edge and
dissolving before the top. One row per ~1.5s. A subtle running total or sparkline anchors
the composition. Reads as: *the business is running, continuously, right now.*

**C. "The steady core"**
A single central mark — concentric rings, an orbiting satellite node, or a soft breathing
core — surrounded by slowly rotating hairline geometry, with periodic gentle sync pulses
radiating outward. Minimal, almost architectural. Reads as: *infrastructure. It does not
stop. It does not fail.*

### 7. Typography in the composition

Include **one short line of supporting copy** anchored in the panel (bottom-left or under
the composition), animated in as part of the entrance sequence:

- A headline of at most 5 words and one muted sub-line.
- Write it in **Uzbek (latin)**, matching the tone of the app's existing copy
  (`"Kichik biznes katta qadamlar"`, `"Oddiy va shaffof narxlar"`).
- Suggest 2–3 options in a comment so the copy can be swapped easily.
- The CPOS logo (`/logo-footer.svg`, currently `height: 48px`) should remain in the panel —
  reposition it if your composition calls for it, and bring it in as the first beat of the
  entrance.

### 8. Non-negotiable quality requirements

- **`prefers-reduced-motion: reduce`** — must be honored. Under it, all looping motion
  stops and the composition renders in a static, complete, still-attractive final state.
  This is a required accessibility behavior, not optional polish. With a JS-driven tool
  this means checking `window.matchMedia('(prefers-reduced-motion: reduce)')` before
  starting the timeline — a CSS-only media query will not cover a GSAP or Lottie loop.
- **Performance** — animate `transform` and `opacity`. Do not animate `width`, `height`,
  `top`, `left`, `filter`, or `box-shadow` in a continuous loop. SVG geometry attributes
  (`stroke-dashoffset`, path `d`) are acceptable when the composition genuinely calls for
  them. Target a steady 60fps on a mid-range laptop. Do not stack more than 2–3 large
  `backdrop-filter` surfaces. If you use `will-change`, apply it narrowly.
- **Lifecycle hygiene** — the login screen may sit open for a long time. Whatever tool you
  use, tear the animation down in `onUnmounted` (cancel `requestAnimationFrame`, call
  `gsap.context().revert()` / `timeline.kill()`, or `lottie.destroy()`), and pause it when
  `document.hidden` is true so an idle tab costs nothing.
- **No layout shift** — the composition must be absolutely positioned or flex-contained
  within the panel and must never cause the right-hand form panel to reflow.
- **Decorative for assistive tech** — all purely visual elements get `aria-hidden="true"`.
  Real copy stays readable in the DOM.
- **Self-contained assets** — no CDN, no runtime network requests, no external image URLs.
  SVG must be inline; a Lottie JSON, if used, must be a local file imported from `src/`.

### 9. Deliverable

Edit `src/views/LoginView.vue` directly:

1. Replace the inner content of `<aside class="brand-panel">`.
2. Remove all now-dead CSS from the removed elements — leave no orphaned rules or keyframes.
3. Add the new CSS in the same `<style scoped>` block, grouped under a clear
   `/* ── Brand panel animation ── */` comment header, following the file's existing
   comment-banner style.
4. Add any needed script logic to the existing `<script setup>` block.
5. Do not touch the right-hand form panel, the login logic, or the i18n keys.
6. If you chose a library, **do not run the install yourself** — state the exact command
   and leave it to us. If you chose pure CSS/SVG, run `npm run build` and confirm it passes.

Close with a short written rationale covering:

- **The technology decision** (from section 3) — what you chose, the bundle cost, and what
  the alternative would have cost you.
- **The creative decision** (from section 6) — which direction you took, why it conveys
  trust for this specific product, and how the loop's timing supports that.

Keep it to two short paragraphs. If a library would only marginally improve the result,
say so honestly and recommend against installing it.

---

## Prompt haqida qisqacha izoh (o'zbekcha)

Bu prompt quyidagilarni aniq belgilaydi, shuning uchun natija tasodifiy chiqmaydi:

- **Kontekst va his-tuyg'u** — animatsiyaning vazifasi "chiroyli" bo'lish emas, balki
  **ishonch** uyg'otish. POS tizimi odamning pulini boshqaradi, shuning uchun motion
  jiddiy va barqaror bo'lishi kerak.
- **Nimani o'chirish kerakligi** — aniq class nomlari bilan, shu bilan birga qaysi
  qatlamlar (dot-grid, ambient orblar) saqlanishi kerakligi ham ko'rsatilgan.
- **Texnologiya tanlovi ochiq** — Claude o'zi CSS/SVG, GSAP yoki Lottie'dan qaysi biri
  kompozitsiya uchun to'g'ri kelishini baholab, tanlovini asoslab beradi. Kutubxona kerak
  bo'lsa — o'rnatish buyrug'ini aytadi, lekin o'zi o'rnatmaydi; biz animatsiyani ko'rib,
  yoqsa keyin o'rnatamiz. Prompt ataylab "kutubxona qo'shma" ham demaydi, "albatta
  qo'sh" ham demaydi — ikkala tomonga ham ochiq savol qo'yadi va halol javob talab qiladi.
- **Dizayn tokenlari** — aynan loyihadagi ranglar jadval ko'rinishida berilgan, shuning
  uchun yangi palitra o'ylab topilmaydi.
- **Motion tamoyillari** — 8–14s loop, `cubic-bezier(0.4, 0, 0.2, 1)`, staggered kirish,
  parallax qatlamlar. "Sekin va ishonchli" degan mavhum gap emas, o'lchovli qiymatlar.
- **3 ta ijodiy yo'nalish** — Claude bittasini tanlab, uni to'liq bajaradi; aralashtirib
  vizual shovqin qilmaydi.
- **Sifat talablari** — `prefers-reduced-motion` (JS timeline uchun `matchMedia` orqali),
  `transform`/`opacity` animatsiyasi, `document.hidden` da pauza, `onUnmounted` da timeline
  tozalash, layout shift yo'qligi, `aria-hidden`. Bular professional natijani havaskor
  natijadan ajratib turadigan narsalar.

**Tavsiyam (ijodiy yo'nalish):** B ("The living ledger") POS mahsuloti uchun eng kuchli —
chunki u mahsulotning haqiqiy ishini ko'rsatadi (savdolar oqimi), abstrakt shakllar emas.
A eng "chiroyli", C eng minimal va xavfsiz tanlov.

**Tavsiyam (texnologiya):** GSAP bu ishga eng mos nomzod — kirish animatsiyasidan
uzluksiz loop'ga o'tish, aniq stagger va SVG yo'l bo'ylab harakat CSS keyframes'da
mo'rt chiqadi, GSAP'da esa tabiiy. Lottie faqat After Effects'da chizilgan illyustrativ
animatsiya uchun ma'noli — bu yerda uni model o'zi yaratishi kerak bo'lgani uchun sifat
kafolatlanmaydi. Yakuniy qarorni Claude kompozitsiyani o'ylab chiqqach beradi.
