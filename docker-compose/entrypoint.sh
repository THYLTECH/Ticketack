#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# 1. Gestion du fichier .env
if [ ! -f ".env" ]; then
    echo "Fichier .env non trouvé, création à partir de .env.example..."
    cp .env.example .env
    # On remplace les variables pour Docker automatiquement
    sed -i 's/DB_CONNECTION=sqlite/DB_CONNECTION=mysql/g' .env
    sed -i 's/# DB_HOST=127.0.0.1/DB_HOST=db/g' .env
    sed -i 's/# DB_DATABASE=laravel/DB_DATABASE=ticketack/g' .env
    sed -i 's/# DB_USERNAME=root/DB_USERNAME=ticketack/g' .env
    sed -i 's/# DB_PASSWORD=/DB_PASSWORD=secret/g' .env
fi

# 2. Installation des dépendances PHP
echo "Installation des dépendances Composer..."
composer install --no-interaction --optimize-autoloader

# 3. Génération de la clé d'application si absente
if ! grep -q "APP_KEY=base64" .env; then
    echo "Génération de la clé d'application..."
    php artisan key:generate
fi

# 4. Installation des dépendances JS et Build
echo "Installation des dépendances NPM..."
npm install
echo "Build des assets frontend..."
npm run build

# 5. Attente que la base de données soit prête
echo "Attente de la base de données..."

# Boucle d'attente jusqu'à ce que la base de données MySQL soit prête
for i in {1..30}; do
    if mysqladmin ping -h"${DB_HOST:-db}" -u"${DB_USERNAME:-ticketack}" -p"${DB_PASSWORD:-secret}" --silent; then
        echo "La base de données est prête !"
        break
    fi
    echo "La base de données n'est pas encore prête, tentative $i/30..."
    sleep 1
done

# Si la base de données n'est toujours pas prête après 30 tentatives, on quitte avec une erreur
if ! mysqladmin ping -h"${DB_HOST:-db}" -u"${DB_USERNAME:-ticketack}" -p"${DB_PASSWORD:-secret}" --silent; then
    echo "Erreur : la base de données n'est pas accessible après 30 secondes."
    exit 1
fi
# 6. Migrations
echo "Exécution des migrations..."
php artisan migrate --force

# 7. Démarrage de PHP-FPM
echo "Démarrage de l'application !"
exec php-fpm