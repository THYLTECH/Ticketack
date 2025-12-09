# Ticketack

## Prerequisites

> php >= v8.3
> node >= v20
> composer >= 2.6

## 🐳 Docker Installation

The application is fully containerized to ensure a quick start without complex
local configuration.

### 1. Start the application
The following command builds the containers, installs dependencies
(PHP & Node), configures the environment, and initializes the database:

```bash
docker-compose up -d --build
```

> **Note:** The very first launch may take a few minutes while the installation
completes.

Once ready, access the application at:
**[http://localhost:8000](http://localhost:8000)**

**Default credentials:**
* **Email:** `test@example.com`
* **Password:** `password`

### 2. Development (Hot Reload)
If you are modifying JS/CSS files and want to see changes in real-time (Vite):

```bash
docker-compose exec app npm run dev
```

### 3. Stop the application
To stop and remove the containers:

```bash
docker-compose down
```

## 🛠️ Local Installation (once)

### Installation from git

- HTTPS

```bash
git clone https://github.com/THYLTECH/Ticketack.git
```

- SSH
```bash
git clone https://github.com/THYLTECH/Ticketack.git
```

### Download composer dependencies
```bash
composer install
```

### Download node dependencies
```bash
npm install
```

### Create .env
```bash
cp .env.example .env
```

### Configure application key
```bash
php artisan key:generate
```

### Migrate database
```bash
php artisan migrate
```

## Starting project

### Apache server
```bash
php artisan serve
```

### Node server (HMR)
```bash
npm run dev
```

### Queue service
```bash
php artisan queue:work
```

## Projet's workflow

> Every feature needs its own branch, never push on develop itself, always do
PR from a feature branch to the develop and assign one of the technical
engineer for a Code Review. Don't forget to tag improvements, on minor
feature = 0.0.X, X is incremented, the v0.1.0 will mark the end of the starter
kit when the real development of the application will begin.