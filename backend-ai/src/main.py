import os
import json
import redis
import sys
import time

# Configuration via variables d'environnement (Best Practice: 12-factor app)
REDIS_HOST = os.getenv('REDIS_HOST', 'redis')
REDIS_PORT = int(os.getenv('REDIS_PORT', 6379))
QUEUE_NAME = os.getenv('REDIS_QUEUE_NAME', 'ticket_processing_queue')


def process_ticket(payload):
    """
    C'est ici que la logique d'IA (RAG/Inférence) sera implémentée plus tard.
    """
    ticket_id = payload.get('ticket_id')
    title = payload.get('title')

    print(f"🤖 [IA] Analyse du ticket #{ticket_id} : {title}")

    # Simulation d'un temps de traitement (Inférence)
    time.sleep(2)

    print(f"✅ [IA] Analyse terminée pour le ticket #{ticket_id}")


def start_worker():
    print(f"🔌 [IA Orchestrator] Connexion à Redis ({REDIS_HOST}:{REDIS_PORT})...")

    try:
        # Reconnexion automatique gérée par le client Redis
        r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, decode_responses=True)
        r.ping()  # Test de connexion immédiat

        print(f"🚀 [IA Orchestrator] En attente de tâches sur la file : '{QUEUE_NAME}'")

        while True:
            # BLPOP bloque jusqu'à ce qu'un message arrive (évite de spammer le CPU)
            # Timeout 0 = infini
            task = r.blpop(QUEUE_NAME, timeout=0)

            if task:
                # task est un tuple (queue_name, data)
                _, raw_data = task
                try:
                    payload = json.loads(raw_data)
                    process_ticket(payload)
                except json.JSONDecodeError:
                    print(f"❌ Erreur de décodage JSON : {raw_data}")
                except Exception as e:
                    print(f"❌ Erreur lors du traitement : {str(e)}")

    except redis.exceptions.ConnectionError:
        print("❌ Impossible de se connecter à Redis. Nouvelle tentative dans 5 sec...")
        time.sleep(5)
        start_worker()  # Récursif simple pour la démo, en prod on laisserait Docker redémarrer le service
    except KeyboardInterrupt:
        print("\n👋 Arrêt du worker IA.")
        sys.exit(0)


if __name__ == "__main__":
    # Force le flush des prints pour voir les logs Docker instantanément
    sys.stdout.reconfigure(line_buffering=True)
    start_worker()
