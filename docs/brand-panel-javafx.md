# CPOS Brand Panel — JavaFX port spetsifikatsiyasi

Login oynasining chap paneli ("The living ledger") ni JavaFX'ga ko'chirish uchun
to'liq qiymatlar va animatsiya vaqtlari. Manba: `src/views/LoginView.vue`.

G'oya: **savdo oqimi to'xtamaydi**. Chapdan cheksiz ko'tarilayotgan chek qatorlari,
o'ngda ularni yig'ib boradigan jonli summa va o'suvchi sparkline.

---

## 1. Rang palitrasi

JavaFX'da `Color.web(...)` yoki CSS'da to'g'ridan-to'g'ri ishlating.

| Nomi | HEX / RGBA | Qayerda |
|---|---|---|
| Panel foni | `#080D1A` | `.brand-panel` |
| Matn — asosiy | `#F1F5F9` | summa, sarlavha, chek summasi |
| Matn — ikkilamchi | `#94A3B8` | "Bugungi savdo", tavsif |
| Matn — xira | `#64748B` | "JONLI", to'lov turi, "so'm" |
| Yashil (accent) | `#34D399` | tasdiq belgisi, jonli nuqta, sparkline oxiri |
| Ko'k (accent) | `#007BFF` | sparkline boshi |
| Karta foni | `rgba(255,255,255,0.05)` | chek qatori, summa kartasi |
| Karta chegarasi | `rgba(255,255,255,0.08)` | chek qatori |
| Karta chegarasi (kuchli) | `rgba(255,255,255,0.10)` | summa kartasi |
| Nuqtali to'r | `rgba(255,255,255,0.06)` | fon to'ri |

### Ambient orblar (blur = 100px)

| Orb | O'lcham | Rang (markaz) | Joylashuv |
|---|---|---|---|
| 1 | 480×480 | `rgba(0,123,255,0.18)` | top: -140, right: -100 |
| 2 | 360×360 | `rgba(99,102,241,0.14)` | bottom: -80, left: -60 |
| 3 | 240×240 | `rgba(16,185,129,0.10)` | top: 45%, left: 35% |

Har biri radial gradient: markazda ko'rsatilgan rang → 65% da shaffof.

---

## 2. Layout o'lchamlari

```
┌─ brand-panel ──────────────────────────────────────────┐
│  padding: 56 56 48                                     │
│                                                        │
│  [logo 100px balandlik]              ← beat 1          │
│                                                        │
│  ↕ 26px                                                │
│  ┌─ bp-comp (744px keng) ────────────────────────────┐ │
│  │  ┌ ledger ┐   96px    ┌─ total karta ─┐           │ │
│  │  │ 300×516│   gap     │ 348px keng    │           │ │
│  │  │        │           │ padding 34/30 │           │ │
│  │  └────────┘           └───────────────┘           │ │
│  └───────────────────────────────────────────────────┘ │
│                                                        │
│  [sarlavha + tavsif, max 460px]      ← beat 4          │
└────────────────────────────────────────────────────────┘
```

- Panel kengligi: qolgan joyning `1.15` ulushi (o'ng form paneli `1.0`).
- Kompozitsiya kengligi: `300 + 96 + 348 = 744px`.
- Panel `960px` dan tor bo'lsa — **butunlay yashiriladi** (mobil rejim).

### Kompozitsiya masshtabi

Panel torayganda reflow emas, **scale** qilinadi (`transform-origin: left center`):

| Panel kengligi | Scale |
|---|---|
| > 856px | 1.00 |
| ≤ 856px | 0.86 |
| ≤ 740px | 0.72 |
| ≤ 620px | 0.58 |

JavaFX: `composition.setScaleX(s); composition.setScaleY(s);` — pivot chapda
bo'lishi uchun `Scale` transform'ini `pivotX=0, pivotY=height/2` bilan qo'ying.

---

## 3. Elementlar tafsiloti

### 3.1 Fon to'ri (`bp-grid`)
Nuqtali to'r, `28×28px` qadam, har nuqta 1px radius, rang `rgba(255,255,255,0.06)`.

JavaFX: `Canvas` ga chizish eng arzon:
```java
gc.setFill(Color.web("#FFFFFF", 0.06));
for (double y = 0; y < h; y += 28)
    for (double x = 0; x < w; x += 28)
        gc.fillOval(x, y, 2, 2);
```

### 3.2 Chek qatori (`bp-row`)
- O'lcham: `300×60px`, burchak radiusi `12px`, ichki padding `0 16px`.
- Chapda: yashil doira belgi (22×22, radius 50%) + summa; o'ngda to'lov turi.
- Doira: fon `rgba(16,185,129,0.14)`, chegara `rgba(52,211,153,0.35)`,
  ichida ✓ ikonka `#34D399`, chiziq qalinligi 1.8.
- Summa: 15px, `600` og'irlik, `#F1F5F9`.
- To'lov turi: 12px, `500`, `#64748B`, harflar oralig'i `0.04em`.

### 3.3 Summa kartasi (`bp-total`)
- `348px` keng, radius `20px`, padding `34 34 30`.
- Fon `rgba(255,255,255,0.05)` + chegara `rgba(255,255,255,0.10)`.
- Orqa fon blur `20px` (JavaFX: `GaussianBlur` bilan snapshot, yoki soddalashtirib
  fonni biroz och qilib qo'ying — pastdagi 6-bo'limga qarang).

Ichki tartib (yuqoridan pastga):
| Element | Stil |
|---|---|
| "JONLI" + nuqta | 13px, `600`, `#64748B`, letter-spacing `0.12em`, pastda 20px bo'shliq |
| "Bugungi savdo" | 14px, `500`, `#94A3B8`, pastda 8px |
| Summa | **42px**, `700`, `#F1F5F9`, letter-spacing `-0.02em` |
| "so'm" | 17px, `500`, `#64748B`, chapdan 8px |
| Sparkline | yuqoridan 22px, maydon 280×76 |

Jonli nuqta: 9×9 doira, `#34D399`.

### 3.4 Sarlavha (`bp-copy`)
- `h2`: 34px, `700`, `#F1F5F9`, line-height 1.18, letter-spacing `-0.02em`.
- `p`: 15px, `500`, `#94A3B8`, line-height 1.6.
- Matn: **"Har bir savdo hisobda"** / "CPOS kunning har daqiqasida savdolaringizni
  yozib boradi."

Shrift: **Poppins** (JavaFX'da `Font.loadFont(...)` bilan yuklang).

---

## 4. Ma'lumot modeli va mantiq

### Chek qatorlari (aylanma ro'yxat, 8 ta)

| Summa | Usul |
|---|---|
| 24 000 | NAQD |
| 138 500 | KARTA |
| 9 200 | CLICK |
| 412 000 | PAYME |
| 56 800 | KARTA |
| 7 500 | NAQD |
| 230 000 | KARTA |
| 18 400 | NAQD |

### Holat
- `total` boshlang'ich qiymati: **12 480 000**
- `sparkHistory`: 10 ta nuqta, boshlang'ich: `total - (9 - i) * 90 000`
  (ya'ni `11 670 000 … 12 480 000` oralig'ida bir tekis o'suvchi qator)

### Tick (har **1500 ms**)
```java
Row row = rows.get(index++ % rows.size());
total += row.amount;
sparkHistory.remove(0);
sparkHistory.add(total);
```
JavaFX: `Timeline` + `KeyFrame(Duration.millis(1500), e -> tick())`,
`setCycleCount(Timeline.INDEFINITE)`.

### Summa formati
3 xonadan **probel** bilan ajratiladi: `12 480 000`.
```java
NumberFormat nf = NumberFormat.getInstance(new Locale("uz"));
DecimalFormatSymbols sym = new DecimalFormatSymbols();
sym.setGroupingSeparator(' ');   // uzilmas probel
```

---

## 5. Sparkline geometriyasi

**viewBox `224×52`**, ekranda `280×76` o'lchamda chiziladi.
Masshtab: `scaleX = 280/224 = 1.25`, `scaleY = 76/52 ≈ 1.4615`.

10 ta nuqta uchun:
```java
double min = Collections.min(history);
double max = Collections.max(history);
double span = (max - min) == 0 ? 1 : (max - min);

for (int i = 0; i < 10; i++) {
    double x = 2 + i * ((218 - 2) / 9.0);              // 2 … 218
    double y = 42 - ((history.get(i) - min) / span) * (42 - 7);  // 42=poy, 7=shift
}
```
Nuqtalar `Polyline` yoki `Path` bilan tutashtiriladi — **to'g'ri chiziq**, egri emas.

- Chiziq qalinligi 2, uchlari va burchaklari yumaloq (`StrokeLineCap.ROUND`).
- Gradient: `(0,52) → (224,0)` bo'ylab `#007BFF` → `#34D399`.
  JavaFX: `new LinearGradient(0, 1, 1, 0, true, CycleMethod.NO_CYCLE, stops)`.

### Oxirgi nuqta ustidagi bezaklar
Ekran koordinatasi: `x * 1.25`, `y * 1.4615`.
- **Nuqta**: 12×12 to'ldirilgan doira `#34D399` (markazi oxirgi nuqtada).
- **Halqa**: 24×24, faqat chegara `rgba(52,211,153,0.7)`, 1px.

Ikkalasi ham yangi qiymat kelganda **1200 ms** davomida yangi joyga siljiydi
(`cubic-bezier(0.4, 0, 0.2, 1)`).

---

## 6. Animatsiyalar

JavaFX'da barcha `cubic-bezier(0.4, 0, 0.2, 1)` uchun:
```java
Interpolator EASE = Interpolator.SPLINE(0.4, 0, 0.2, 1);
```

### 6.1 Kirish animatsiyalari (bir marta, yuklanganda)

| Element | Effekt | Davomiylik | Kechikish |
|---|---|---|---|
| Logo | opacity 0→1, Y +14→0 | 680 ms | 0 |
| Ledger | opacity 0→1 | 800 ms | 120 ms |
| Summa kartasi | opacity 0→1, Y +14→0 | 720 ms | 240 ms |
| Sarlavha | opacity 0→1, Y +14→0 | 800 ms | 360 ms |
| Sparkline chizilishi | dash 420→0 | 1100 ms | 500 ms |
| Sparkline nuqtasi | opacity 0→1 | 500 ms | 1500 ms |

Sparkline chizilishi JavaFX'da:
```java
path.getStrokeDashArray().setAll(420.0);
Timeline draw = new Timeline(
    new KeyFrame(Duration.ZERO, new KeyValue(path.strokeDashOffsetProperty(), 420)),
    new KeyFrame(Duration.millis(1100), new KeyValue(path.strokeDashOffsetProperty(), 0, EASE)));
draw.setDelay(Duration.millis(500));
```

### 6.2 Chek oqimi — `bp-rise` (asosiy effekt)

**Har qator 12 sekundlik cheksiz siklda** pastdan yuqoriga suzadi.
8 qator, har biri **-1.5s** kechikish bilan → ekranda uzluksiz oqim
(`animationDelay = -1.5 * i`).

Sikl ichida (12s = 100%):

| Vaqt | translateY | opacity |
|---|---|---|
| 0% | `+516px` | 0 |
| 7% (840ms) | — | 1 |
| 82% (9.84s) | — | 1 |
| 100% | `-84px` | 0 |

**Chiziqli** interpolatsiya (`Interpolator.LINEAR`), easing yo'q.

JavaFX'da manfiy kechikishni qo'llab bo'lmaydi, shuning uchun timeline'ni
kerakli nuqtadan boshlang:
```java
Timeline t = buildRiseTimeline(row);   // 12s, INDEFINITE
t.playFrom(Duration.seconds(1.5 * i)); // i-qator uchun
```

### 6.3 Tasdiq belgisi — `bp-glyph`
Xuddi shu 12s sikl, xuddi shu kechikish:

| Vaqt | opacity | scale |
|---|---|---|
| 0–5% | 0 | 0.72 |
| 13%–100% | 1 | 1.0 |

Ya'ni qator ko'ringandan biroz keyin belgi "qalqib" chiqadi.

### 6.4 Jonli nuqta — `bp-breathe`
4s sikl, cheksiz: opacity `0.5 → 1 → 0.5` (`ease-in-out`).
```java
FadeTransition ft = new FadeTransition(Duration.seconds(2), dot);
ft.setFromValue(0.5); ft.setToValue(1.0);
ft.setAutoReverse(true); ft.setCycleCount(Animation.INDEFINITE);
```

### 6.5 Halqa puls — `bp-ring`
6s sikl, cheksiz, **1800 ms** kechikish bilan:

| Vaqt | scale | opacity |
|---|---|---|
| 0% | 0.6 | 0.55 |
| 70%–100% (4.2s dan) | 2.6 | 0 |

70% dan keyin halqa ko'rinmaydi — sikl oxirigacha "dam oladi".

### 6.6 Sparkline shaklining o'zgarishi
Yangi qiymat kelganda chiziq **1200 ms** davomida yangi shaklga o'tadi
(`cubic-bezier(0.4, 0, 0.2, 1)`). JavaFX'da `Path` elementlarini to'g'ridan-to'g'ri
animatsiya qilib bo'lmaydi — ikki yo'l bor:

1. **Oson**: `Polyline.getPoints()` ni `Timeline` bilan har kadrda yangilash
   (10 nuqta × 2 koordinata = 20 ta qiymat, oraliq interpolatsiya).
2. **Tavsiya**: eski va yangi nuqtalar orasida `DoubleProperty progress` (0→1)
   ochib, uning listener'ida `Polyline` nuqtalarini qayta hisoblash:
```java
DoubleProperty p = new SimpleDoubleProperty(0);
p.addListener((o, ov, nv) -> {
    double f = nv.doubleValue();
    for (int i = 0; i < 10; i++) {
        double y = oldY[i] + (newY[i] - oldY[i]) * f;
        polyline.getPoints().set(i * 2 + 1, y);
    }
});
new Timeline(new KeyFrame(Duration.millis(1200), new KeyValue(p, 1, EASE))).play();
```

---

## 7. Optimizatsiya va foydalanish qulayligi

### 7.1 Oyna ko'rinmaganda to'xtatish
Veb versiyada `visibilitychange` da barcha animatsiya to'xtaydi va tick timer
tozalanadi. JavaFX ekvivalenti:
```java
stage.iconifiedProperty().addListener((o, was, is) -> {
    if (is) { allAnimations.forEach(Animation::pause); ticker.pause(); }
    else    { allAnimations.forEach(Animation::play);  ticker.play();  }
});
// xuddi shu narsani stage.focusedProperty() yoki showingProperty() uchun ham
```
Bu CPU'ni bekorga yemaslik uchun — panel doim harakatda bo'lgani uchun sezilarli.

### 7.2 Harakatni kamaytirish rejimi
Veb versiyada `prefers-reduced-motion` bo'lsa animatsiyalar **butunlay o'chadi**,
lekin kompozitsiya **to'liq va tugallangan** ko'rinadi:

- Chek qatorlari statik joyda turadi: `y = 448 - i * 68` (i = 0…7),
  ya'ni `448, 380, 312, 244, 176, 108, 40, -28`.
- Belgilar to'liq ko'rinadi (opacity 1, scale 1).
- Sparkline to'liq chizilgan (dashOffset 0).
- Halqa ko'rinmaydi (opacity 0).

JavaFX'da bunday tizim sozlamasi yo'q — dasturingizda sozlama bo'lsa
(masalan "Animatsiyalar" belgisi) shu holatga tushiring. Bo'lmasa ham, bu
holat **zaxira ko'rinish** sifatida foydali: past quvvatli mashinada yoqing.

### 7.3 Blur haqida
`backdrop-filter: blur(20px)` JavaFX'da to'g'ridan-to'g'ri yo'q. Variantlar:
1. **Eng oson**: blur'siz, karta fonini biroz quyuqroq qiling —
   `rgba(255,255,255,0.07)`. Vizual farq kichik.
2. Orb'lar ostidagi hududni `snapshot()` qilib, `GaussianBlur(20)` qo'llab,
   karta ostiga `ImageView` sifatida qo'yish. Orb'lar statik bo'lgani uchun
   buni **bir marta** hisoblash yetarli.

Orb'larning o'zi statik — ularni ham bir marta blur qilingan rasm sifatida
tayyorlab qo'ying, har kadrda `GaussianBlur` hisoblamang.

### 7.4 Ledger maskasi
Chek oqimi yuqori va past chekkalarida **so'nadi**:
`linear-gradient(to top, transparent 0%, #000 16%, #000 78%, transparent 100%)`.

JavaFX: ledger konteyneriga
```java
Rectangle mask = new Rectangle(300, 516);
mask.setFill(new LinearGradient(0, 1, 0, 0, true, CycleMethod.NO_CYCLE,
    new Stop(0.00, Color.TRANSPARENT),
    new Stop(0.16, Color.BLACK),
    new Stop(0.78, Color.BLACK),
    new Stop(1.00, Color.TRANSPARENT)));
ledgerPane.setClip(mask);
```
Eslatma: `setClip` faqat kesadi, shaffoflik darajasini bermaydi. To'liq mos
kelishi uchun `Blend` yoki ledger ustiga panel fonidan gradientli
`Rectangle` qo'yish kerak (yuqorida va pastda `#080D1A` → shaffof).
Ikkinchi yo'l soddaroq va natijasi bir xil.

---

## 8. Qurilish tartibi (tavsiya)

1. **Statik skelet**: fon, to'r, orblar, logo, bo'sh ledger, summa kartasi, matn.
   Animatsiyasiz — o'lchamlar va ranglar to'g'ri chiqishiga ishonch hosil qiling.
2. **Sparkline** statik holatda (boshlang'ich 10 nuqta bilan) chizilsin.
3. **Ticker** (1500 ms) — summa raqami yangilanadi, sparkline shakli o'zgaradi.
4. **Chek oqimi** — 8 qator, 12s sikl, manfiy kechikish `playFrom` orqali.
5. **Mayda detallar**: jonli nuqta nafasi, halqa pulsi, belgi qalqishi.
6. **Kirish animatsiyalari** (beat 1→4 ketma-ketligi).
7. **Optimizatsiya**: oyna minimallashganda pauza, blur'ni oldindan hisoblash.

Har bosqichdan keyin ishga tushirib ko'ring — animatsiyalarni birdaniga
yozsangiz, qaysi biri noto'g'ri ekanini topish qiyin bo'ladi.

---

## 9. Tez ma'lumotnoma

```
Panel foni      #080D1A          Tick oralig'i    1500 ms
Accent yashil   #34D399          Qator sikli      12 s
Accent ko'k     #007BFF          Qator kechikishi -1.5 s × i
Matn asosiy     #F1F5F9          Qatorlar soni    8
Matn ikkilamchi #94A3B8          Sparkline nuqta  10
Matn xira       #64748B          Boshlang'ich sum 12 480 000

Kompozitsiya    744 px  (300 ledger + 96 gap + 348 karta)
Ledger          300 × 516     Qator 300 × 60, radius 12
Karta           348 keng, radius 20, padding 34/34/30
Sparkline       viewBox 224×52 → ekranda 280×76
Panel padding   56 / 56 / 48
Easing          cubic-bezier(0.4, 0, 0.2, 1)
```
