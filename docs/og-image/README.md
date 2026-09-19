# og-image banner

`public/og-image.png` — havola Telegram, Facebook yoki LinkedIn'ga
tashlanganda ko'rinadigan banner (1200×630).

## Qayta yaratish

`template.html` ni tahrirlang, so'ng:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless --disable-gpu --hide-scrollbars \
  --force-device-scale-factor=1 \
  --window-size=1200,630 \
  --default-background-color=ffffff \
  --virtual-time-budget=6000 \
  --screenshot=../../public/og-image.png \
  "file://$PWD/template.html"
```

`--virtual-time-budget` Poppins shrifti Google Fonts'dan yuklanishini
kutadi — usiz banner tizim shriftida chiqadi.

## Muhim

Rasmni almashtirgandan keyin `?v=` raqamini ikki joyda oshiring:

- `src/composables/useSeo.js` → `OG_IMAGE`
- `index.html` → `og:image` va `twitter:image`

Telegram va Facebook og:image'ni uzoq keshlaydi; versiyasiz ular eski
rasmni ko'rsatib yuraveradi. Deploy'dan keyin keshni majburan
yangilash mumkin:

- Facebook: https://developers.facebook.com/tools/debug/ → Scrape Again
- Telegram: https://t.me/WebpageBot ga havolani yuboring
- LinkedIn: https://www.linkedin.com/post-inspector/

## Dizayn cheklovlari

Platformalar rasmni turli nisbatlarda kesadi, shuning uchun:

- matn chekkalardan kamida 80px ichkarida
- pastki ~130px bo'sh (u yerga sarlavha overlay bo'lishi mumkin)
- 26px dan kichik shrift ishlatilmaydi — lentada rasm ~400px kenglikda
  ko'rinadi
