#!/bin/bash
# Ubuntu 22.04 serverda BIR MARTA ishga tushiring:
#   sudo bash domain-setup.sh
#
# Bu skript host nginx'ni cpos.uz uchun reverse proxy qilib sozlaydi:
#   cpos.uz, www.cpos.uz  -> Docker konteyner (127.0.0.1:8080)  [frontend]
#   api.cpos.uz           -> backend (127.0.0.1:8080 emas, alohida port) [backend]
#   Let's Encrypt SSL (certbot) + avtomatik yangilanish
#   HTTP -> HTTPS redirect
#
# OLDIN bajarilishi kerak:
#   1) server-setup.sh ishga tushirilgan bo'lsin (Docker + /opt/cpos-frontend)
#   2) DNS A-record'lar shu server IP'siga yo'naltirilgan bo'lsin:
#        cpos.uz      A   <SERVER_IP>
#        www.cpos.uz  A   <SERVER_IP>
#        api.cpos.uz  A   <SERVER_IP>

set -euo pipefail

DOMAIN="cpos.uz"
API_DOMAIN="api.${DOMAIN}"
APP_DIR="/opt/cpos-frontend"

# Frontend Docker konteyner porti (docker-compose .env dagi APP_PORT bilan bir xil)
FRONTEND_PORT="$(grep -sE '^APP_PORT=' "$APP_DIR/.env" | cut -d= -f2 || true)"
FRONTEND_PORT="${FRONTEND_PORT:-8080}"

if [[ $EUID -ne 0 ]]; then
  echo "Iltimos sudo bilan ishga tushiring: sudo bash domain-setup.sh"
  exit 1
fi

read -rp "Backend qaysi portda ishlayapti? [8000]: " BACKEND_PORT
BACKEND_PORT="${BACKEND_PORT:-8000}"

read -rp "SSL sertifikat uchun email (Let's Encrypt ogohlantirishlari): " LE_EMAIL
if [[ -z "$LE_EMAIL" ]]; then
  echo "Email kiritilmadi — to'xtatildi."
  exit 1
fi

echo
echo "=== Sozlamalar ==="
echo "  Frontend : https://${DOMAIN}, https://www.${DOMAIN}  ->  127.0.0.1:${FRONTEND_PORT} (Docker)"
echo "  Backend  : https://${API_DOMAIN}                     ->  127.0.0.1:${BACKEND_PORT}"
echo
read -rp "Davom etamizmi? [y/N]: " CONFIRM
[[ "${CONFIRM,,}" == "y" ]] || { echo "Bekor qilindi."; exit 0; }

echo "=== 1/6: nginx va certbot o'rnatilmoqda ==="
apt-get update -y
apt-get install -y nginx certbot python3-certbot-nginx

echo "=== 2/6: DNS tekshirilmoqda ==="
SERVER_IP="$(curl -fsS --max-time 10 https://api.ipify.org || echo '')"
for d in "$DOMAIN" "www.${DOMAIN}" "$API_DOMAIN"; do
  RESOLVED="$(getent ahostsv4 "$d" | awk '{print $1}' | head -1 || true)"
  if [[ -z "$RESOLVED" ]]; then
    echo "  OGOHLANTIRISH: $d hali DNS'da topilmadi."
  elif [[ -n "$SERVER_IP" && "$RESOLVED" != "$SERVER_IP" ]]; then
    echo "  OGOHLANTIRISH: $d -> $RESOLVED (server IP: $SERVER_IP) — mos emas."
  else
    echo "  OK: $d -> $RESOLVED"
  fi
done
echo "(DNS noto'g'ri bo'lsa certbot sertifikat bera olmaydi.)"
read -rp "Davom etamizmi? [y/N]: " CONFIRM_DNS
[[ "${CONFIRM_DNS,,}" == "y" ]] || { echo "Bekor qilindi. DNS to'g'rilangach qayta urinib ko'ring."; exit 0; }

echo "=== 3/6: nginx konfiglari yozilmoqda (HTTP) ==="
# Certbot keyinchalik shu fayllarga SSL bloklarini o'zi qo'shadi.

tee /etc/nginx/sites-available/cpos-frontend >/dev/null <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN} www.${DOMAIN};

    # Yuklanadigan fayl hajmi
    client_max_body_size 20M;

    access_log /var/log/nginx/cpos-frontend.access.log;
    error_log  /var/log/nginx/cpos-frontend.error.log;

    location / {
        proxy_pass http://127.0.0.1:${FRONTEND_PORT};
        proxy_http_version 1.1;
        proxy_set_header Host              \$host;
        proxy_set_header X-Real-IP         \$remote_addr;
        proxy_set_header X-Forwarded-For   \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header Upgrade           \$http_upgrade;
        proxy_set_header Connection        "upgrade";
        proxy_read_timeout 60s;
    }
}
EOF

tee /etc/nginx/sites-available/cpos-api >/dev/null <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name ${API_DOMAIN};

    client_max_body_size 50M;

    access_log /var/log/nginx/cpos-api.access.log;
    error_log  /var/log/nginx/cpos-api.error.log;

    location / {
        proxy_pass http://127.0.0.1:${BACKEND_PORT};
        proxy_http_version 1.1;
        proxy_set_header Host              \$host;
        proxy_set_header X-Real-IP         \$remote_addr;
        proxy_set_header X-Forwarded-For   \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header Upgrade           \$http_upgrade;
        proxy_set_header Connection        "upgrade";
        proxy_read_timeout 120s;
    }
}
EOF

ln -sf /etc/nginx/sites-available/cpos-frontend /etc/nginx/sites-enabled/
ln -sf /etc/nginx/sites-available/cpos-api      /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

nginx -t
systemctl enable nginx
systemctl reload nginx

echo "=== 4/6: Firewall ==="
if command -v ufw >/dev/null 2>&1; then
  ufw allow 'Nginx Full' || true
  # Konteyner endi faqat 127.0.0.1 ga bog'lanadi, 8080 tashqaridan yopiq bo'lsin
  ufw delete allow 8080/tcp 2>/dev/null || true
fi

echo "=== 5/6: SSL sertifikat olinmoqda (Let's Encrypt) ==="
# Frontend va backend uchun ALOHIDA sertifikatlar olinadi.
# Sabab: api.cpos.uz uchun sertifikat allaqachon mavjud bo'lishi mumkin —
# uni kengaytirish (--expand) o'rniga tegmasdan qoldirgan ma'qul.

# --- Frontend: cpos.uz + www.cpos.uz ---
if certbot certificates 2>/dev/null | grep -qE "^\s+Certificate Name: ${DOMAIN}$"; then
  echo "  '${DOMAIN}' sertifikati allaqachon mavjud — yangilanmoqda (nginx'ga bog'lanadi)."
  certbot --nginx -d "${DOMAIN}" -d "www.${DOMAIN}" \
    --cert-name "${DOMAIN}" \
    --non-interactive --agree-tos --email "${LE_EMAIL}" \
    --keep-until-expiring --expand --redirect
else
  echo "  '${DOMAIN}' uchun yangi sertifikat olinmoqda."
  certbot --nginx -d "${DOMAIN}" -d "www.${DOMAIN}" \
    --cert-name "${DOMAIN}" \
    --non-interactive --agree-tos --email "${LE_EMAIL}" \
    --redirect
fi

# --- Backend: api.cpos.uz ---
if certbot certificates 2>/dev/null | grep -qE "^\s+Certificate Name: ${API_DOMAIN}$"; then
  echo "  '${API_DOMAIN}' sertifikati allaqachon mavjud — qayta olinmaydi."
  echo "  Faqat nginx konfigiga SSL bog'lanmoqda..."
  certbot install --nginx --cert-name "${API_DOMAIN}" --non-interactive --redirect
else
  echo "  '${API_DOMAIN}' uchun yangi sertifikat olinmoqda."
  certbot --nginx -d "${API_DOMAIN}" \
    --cert-name "${API_DOMAIN}" \
    --non-interactive --agree-tos --email "${LE_EMAIL}" \
    --redirect
fi

echo "=== 6/6: Avtomatik yangilanish tekshirilmoqda ==="
systemctl enable --now certbot.timer
certbot renew --dry-run

nginx -t
systemctl reload nginx

echo
echo "=== Tayyor! ==="
echo "  https://${DOMAIN}"
echo "  https://${API_DOMAIN}"
echo
echo "MUHIM: GitHub Secrets'da VITE_API_BASE_URL ni yangilang:"
echo "    VITE_API_BASE_URL=https://${API_DOMAIN}/api/v1/"
echo "So'ng main branchga push qiling — frontend yangi API manzili bilan qayta build bo'ladi."
echo
echo "Foydali buyruqlar:"
echo "  systemctl reload nginx            # konfigni qayta o'qish"
echo "  certbot certificates              # sertifikat muddati"
echo "  tail -f /var/log/nginx/cpos-frontend.error.log"
