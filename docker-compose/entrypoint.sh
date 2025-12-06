#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# 1. .env file management
if [ ! -f ".env" ]; then
    echo "Fichier .env non trouvé, création à partir de .env.example..."
    cp .env.example .env
    # Automatically replace variables for Docker
    sed -i 's/DB_CONNECTION=sqlite/DB_CONNECTION=mysql/g' .env
    sed -i 's/# DB_HOST=127.0.0.1/DB_HOST=db/g' .env
    sed -i 's/# DB_DATABASE=laravel/DB_DATABASE=ticketack/g' .env
    sed -i 's/# DB_USERNAME=root/DB_USERNAME=ticketack/g' .env
    sed -i 's/# DB_PASSWORD=/DB_PASSWORD=secret/g' .env
fi

# 2. Install PHP dependencies
echo "Installation des dépendances Composer..."
composer install --no-interaction --optimize-autoloader

# 3. Generate application key if absent
if ! grep -q "APP_KEY=base64" .env; then
    echo "Génération de la clé d'application..."
    php artisan key:generate
fi

# 4. Install JS dependencies and build
echo "Installation des dépendances NPM..."
npm install
echo "Build des assets frontend..."
npm run build

# 5. Wait until the database is ready
echo "Attente de la base de données..."
sleep 10

# 6. Migrations
echo "Exécution des migrations..."
php artisan migrate --force

# 7. Starting PHP-FPM
echo "Démarrage de l'application !"
exec php-fpm