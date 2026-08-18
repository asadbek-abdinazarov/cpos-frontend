#!/bin/bash
# Ubuntu 22.04 serverda BIR MARTA ishga tushiring:
#   bash server-setup.sh
#
# Bu skript serverni Docker orqali deploy qilishga tayyorlaydi:
#   - Docker Engine + Docker Compose plugin o'rnatadi
#   - /opt/cpos-frontend papkasini yaratadi
#   - docker-compose.yml va .env fayllarini joylashtiradi
#   - GHCR (GitHub Container Registry) ga login qiladi
#   - UFW firewall'ni sozlaydi
#
# Konteyner faqat 127.0.0.1:8080 ga bog'lanadi. Tashqi dunyoga (cpos.uz, SSL)
# chiqarish uchun keyin domain-setup.sh ni ishga tushiring.

set -euo pipefail

APP_DIR="/opt/cpos-frontend"
APP_USER="${SUDO_USER:-$USER}"

if [[ $EUID -eq 0 && -z "${SUDO_USER:-}" ]]; then
  echo "Iltimos, root emas, oddiy foydalanuvchi sifatida 'sudo' bilan ishga tushiring."
  exit 1
fi

echo "=== 1/6: Tizim yangilanmoqda ==="
sudo apt-get update -y
sudo apt-get install -y ca-certificates curl gnupg lsb-release ufw

echo "=== 2/6: Docker o'rnatilmoqda ==="
if ! command -v docker >/dev/null 2>&1; then
  sudo install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg |
    sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
  sudo chmod a+r /etc/apt/keyrings/docker.gpg

  echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" |
    sudo tee /etc/apt/sources.list.d/docker.list >/dev/null

  sudo apt-get update -y
  sudo apt-get install -y docker-ce docker-ce-cli containerd.io \
    docker-buildx-plugin docker-compose-plugin
else
  echo "Docker allaqachon o'rnatilgan — o'tkazib yuborildi."
fi

sudo systemctl enable --now docker

echo "=== 3/6: Foydalanuvchi docker guruhiga qo'shilmoqda ==="
sudo usermod -aG docker "$APP_USER"

echo "=== 4/6: Papka va konfiglar tayyorlanmoqda ==="
sudo mkdir -p "$APP_DIR"
sudo chown -R "$APP_USER":"$APP_USER" "$APP_DIR"

# docker-compose.yml (repodagi bilan bir xil bo'lishi kerak)
tee "$APP_DIR/docker-compose.yml" >/dev/null <<'EOF'
services:
  frontend:
    image: ${IMAGE}
    container_name: cpos-frontend
    restart: unless-stopped
    ports:
      - '127.0.0.1:${APP_PORT:-8080}:80'
    healthcheck:
      test: ['CMD', 'wget', '-qO-', 'http://127.0.0.1/healthz']
      interval: 30s
      timeout: 3s
      retries: 3
      start_period: 5s
EOF

# .env — CI/CD har deployda IMAGE qatorini yangilab turadi
if [[ ! -f "$APP_DIR/.env" ]]; then
  read -rp "GitHub owner (username yoki tashkilot nomi): " GH_OWNER
  read -rp "Repo nomi [cpos-frontend]: " GH_REPO
  GH_REPO="${GH_REPO:-cpos-frontend}"
  read -rp "Ichki (localhost) port [8080]: " APP_PORT
  APP_PORT="${APP_PORT:-8080}"

  OWNER_LC=$(echo "$GH_OWNER" | tr '[:upper:]' '[:lower:]')
  REPO_LC=$(echo "$GH_REPO" | tr '[:upper:]' '[:lower:]')

  tee "$APP_DIR/.env" >/dev/null <<EOF
IMAGE=ghcr.io/${OWNER_LC}/${REPO_LC}:latest
APP_PORT=${APP_PORT}
EOF
  echo ".env yaratildi: $APP_DIR/.env"
else
  echo ".env allaqachon mavjud — tegilmadi."
fi

echo "=== 5/6: GHCR ga login ==="
echo "GitHub Personal Access Token kerak (scope: read:packages)."
echo "Agar image public bo'lsa, bu qadamni o'tkazib yuborsangiz ham bo'ladi."
read -rp "Hozir login qilasizmi? [y/N]: " DO_LOGIN
if [[ "${DO_LOGIN,,}" == "y" ]]; then
  read -rp "GitHub username: " GH_USER
  read -rsp "GitHub PAT (read:packages): " GH_PAT
  echo
  echo "$GH_PAT" | sudo docker login ghcr.io -u "$GH_USER" --password-stdin
fi

echo "=== 6/6: Firewall sozlanmoqda ==="
# Konteyner 127.0.0.1 ga bog'langani uchun 8080 ochilmaydi.
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable

echo
echo "=== Tayyor! ==="
echo "Keyingi qadamlar:"
echo "  1) Domen va SSL uchun:  sudo bash domain-setup.sh"
echo "  2) GitHub repo -> Settings -> Secrets and variables -> Actions da secretlarni qo'shing:"
echo "       SERVER_HOST, SERVER_USER, SERVER_SSH_KEY, SERVER_PORT (ixtiyoriy),"
echo "       GHCR_TOKEN, VITE_API_BASE_URL"
echo "  3) main branchga push qiling — GitHub Actions image build qilib, shu serverga deploy qiladi."
echo
echo "Qo'lda tekshirish uchun:"
echo "  cd $APP_DIR && docker compose pull && docker compose up -d && docker compose ps"
echo
echo "DIQQAT: 'docker' buyrug'ini sudo'siz ishlatish uchun sessiyadan chiqib qayta kiring."
