# Utilisation d'une image légère pour commencer
FROM python:3.10-slim

WORKDIR /app

# Installation des dépendances système si nécessaire (ex: git, curl)
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copie des requirements et installation
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copie du code source
COPY src/ ./src/

# Variable d'environnement pour que Python affiche les logs instantanément
ENV PYTHONUNBUFFERED=1

# Commande de lancement
CMD ["python", "src/main.py"]
