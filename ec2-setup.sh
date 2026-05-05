#!/bin/bash
# EC2 da bir marta ishga tushiring: bash ec2-setup.sh

set -e

echo "=== Nginx o'rnatilmoqda ==="
sudo apt update -y
sudo apt install -y nginx

echo "=== Papka yaratilmoqda ==="
sudo mkdir -p /var/www/cpos-frontend
sudo chown -R $USER:$USER /var/www/cpos-frontend

echo "=== Nginx config yozilmoqda ==="
sudo tee /etc/nginx/sites-available/cpos-frontend > /dev/null <<'EOF'
server {
    listen 80;
    server_name _;

    root /var/www/cpos-frontend;
    index index.html;

    # Vue Router uchun (history mode)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Static fayllar keshi
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml;
}
EOF

echo "=== Nginx yoqilmoqda ==="
sudo ln -sf /etc/nginx/sites-available/cpos-frontend /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl enable nginx
sudo systemctl start nginx

echo "=== Tayyor! EC2 IP manzilingizni brauzerda oching ==="
