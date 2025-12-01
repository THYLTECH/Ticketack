#!/bin/bash

# On s'arrête à la moindre erreur
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
if [ ! -d "node_modules" ]; then
    echo "Installation des dépendances NPM..."
    npm install
    echo "Build des assets frontend..."
    npm run build
fi

# 5. Attente que la base de données soit prête
echo "Attente de la base de données..."
# Petite boucle d'attente basique (ou utiliser wait-for-it)
sleep 10

# 6. Migrations
echo "Exécution des migrations..."
php artisan migrate --force

# 7. Démarrage de PHP-FPM
echo "Démarrage de l'application !"
exec php-fpm