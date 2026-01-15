import os
import json
import redis
import sys
import time
from jinja2 import Environment, FileSystemLoader
from openai import OpenAI

# Configuration via variables d'environnement (Best Practice: 12-factor app)
REDIS_HOST = os.getenv('REDIS_HOST', 'redis')
REDIS_PORT = int(os.getenv('REDIS_PORT', 6379))
QUEUE_NAME = os.getenv('REDIS_QUEUE_NAME', 'ticket_processing_queue')

# LiteLLM Configuration
LITELLM_HOST = os.getenv('LITELLM_HOST', 'http://litellm:4000')
MODEL_NAME = "mistral-nemo"

# Setup Jinja2
template_dir = os.path.join(os.path.dirname(__file__), 'templates')
env = Environment(loader=FileSystemLoader(template_dir))

# Setup OpenAI Client (pointing to LiteLLM)
client = OpenAI(
    api_key="sk-1234", # Wrapper requires a key, but LiteLLM might not need a real one for Ollama
    base_url=LITELLM_HOST
)


def generate_ai_opinion(ticket_id, title, context):
    """
    Génère une opinion IA via LiteLLM (Mistral Nemo).
    """
    try:
        template = env.get_template('ticket_analysis.j2')
        prompt = template.render(ticket_id=ticket_id, title=title, context=context)
        
        print(f"🧠 [IA] Envoi du prompt à LiteLLM ({MODEL_NAME})...")
        
        response = client.chat.completions.create(
            model=MODEL_NAME,
            messages=[
                {"role": "user", "content": prompt}
            ],
            stream=False
        )
        
        result = response.choices[0].message.content
        return result
        
    except Exception as e:
        print(f"❌ [IA] Erreur lors de l'appel LiteLLM : {str(e)}")
        return f"Erreur d'analyse : {str(e)}"


def process_ticket(payload):
    """
    Traite le ticket reçu via Redis (Laravel Event).
    Payload expected: {'ticket_id': ..., 'title': ..., 'description': ..., 'status': ...}
    """
    ticket_id = payload.get('ticket_id')
    title = payload.get('title')
    # Context is built from description in this case
    context = payload.get('description', 'Pas de description fournie.')

    print(f"🤖 [IA] Analyse du ticket #{ticket_id} : {title}")
    
    opinion = generate_ai_opinion(ticket_id, title, context)

    print("="*60)
    print(f"📝 OPINION IA pour le ticket #{ticket_id}")
    print("="*60)
    print(opinion)
    print("="*60)
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
        start_worker()  # Récursif simple pour la démo
    except KeyboardInterrupt:
        print("\n👋 Arrêt du worker IA.")
        sys.exit(0)


if __name__ == "__main__":
    # Force le flush des prints pour voir les logs Docker instantanément
    sys.stdout.reconfigure(line_buffering=True)
    start_worker()
