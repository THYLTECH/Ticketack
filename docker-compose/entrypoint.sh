#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

if [ ! -d "vendor" ]; then
    echo "Dossier vendor manquant, installation des dépendances..."
    composer install --no-progress --no-interaction
fi

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

# 2. Generate application key if absent
if ! grep -q "APP_KEY=base64" .env; then
    echo "Génération de la clé d'application..."
    php artisan key:generate
fi

# 3. Creating symbolic storage link (storage:link)
echo "Création du lien de stockage symbolique..."
php artisan storage:link

# 4. Starting PHP-FPM
echo "Démarrage de l'application !"
exec php-fpm
