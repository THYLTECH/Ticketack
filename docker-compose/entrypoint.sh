#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# dependency check
echo "Vérification des dépendances Composer..."
composer install --no-progress --no-interaction

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

# 4. Lancement du serveur de websocket Reverb
echo "Démarrage du serveur de websocket Reverb en arrière-plan..."
php artisan reverb:start --host=0.0.0.0 --port=8080 &
# 5. Starting PHP-FPM
echo "Démarrage de l'application !"
exec php-fpm
