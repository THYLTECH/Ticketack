import os
import json
import redis
import sys
import time
from jinja2 import Environment, FileSystemLoader
from openai import OpenAI
from pydantic import BaseModel, Field, ValidationError
from typing import List, Optional

# Configuration via environment variables (Best Practice: 12-factor app)
REDIS_HOST = os.getenv('REDIS_HOST', 'redis')
REDIS_PORT = int(os.getenv('REDIS_PORT', 6379))
QUEUE_NAME = os.getenv('REDIS_QUEUE_NAME', 'ticket_processing_queue')

# LiteLLM Configuration
LITELLM_HOST = os.getenv('LITELLM_HOST', 'http://litellm:4000')
MODEL_NAME = "gemma:2b"

# Setup Jinja2
template_dir = os.path.join(os.path.dirname(__file__), 'templates')
env = Environment(loader=FileSystemLoader(template_dir))

# Setup OpenAI Client (pointing to LiteLLM)
client = OpenAI(
    api_key="sk-1234", # Wrapper requires a key, but LiteLLM might not need a real one for Ollama
    base_url=LITELLM_HOST
)


# RAG Configuration
ETL_API_URL = os.getenv('ETL_API_URL', 'http://etl-api:8000')

# Pydantic model to validate the AI output
class TicketAnalysis(BaseModel):
    summary: str = Field(description="Résumé du problème identifié en 1 phrase")
    analysis: str = Field(description="Analyse technique de la cause probable")
    steps: List[str] = Field(description="Liste des étapes de résolution")
    missing_info: Optional[str] = Field(description="Questions à poser au client si incomplet")
    confidence_score: float = Field(description="Score de confiance entre 0.0 et 1.0")
    citations: List[str] = Field(description="IDs des documents utilisés", default_factory=list)


def retrieve_context(query, limit=3):
    """
    Queries the ETL API (endpoint /retrieve_context) to retrieve content.
    """
    try:
        import requests
        print(f"🔍 [RAG] Recherche de contexte pour : '{query[:50]}...'")
        # Call to the dedicated endpoint that returns 'content'
        response = requests.post(f"{ETL_API_URL}/retrieve_context", json={"query": query, "limit": limit}, timeout=5)
        response.raise_for_status()
        results = response.json()
        
        documents = []
        for item in results:
            documents.append({
                "id": str(item['ticket_id']),
                "source": item.get('filename', 'base_connaissance'),
                "content": item.get('content', '')
            })
            
        print(f"✅ [RAG] {len(documents)} documents trouvés.")
        return documents
    except Exception as e:
        print(f"⚠️ [RAG] Erreur lors de la récupération du contexte : {str(e)}")
        return []

def generate_ai_opinion(ticket_id, title, context_text):
    """
    Generates an AI opinion via LiteLLM and validates with Pydantic.
    """
    try:
        # 1. Retrieval of the RAG context
        documents = retrieve_context(context_text)
        
        # 2. Preparation of the prompt
        template = env.get_template('ticket_analysis.j2')
        prompt = template.render(
            title=title, 
            description=context_text,
            documents=documents
        )
        
        print(f"🧠 [IA] Envoi du prompt à LiteLLM ({MODEL_NAME})...")
        
        # 3. LLM call
        response = client.chat.completions.create(
            model=MODEL_NAME,
            messages=[
                {"role": "user", "content": prompt}
            ],
            stream=False,
            temperature=0.2 # More deterministic for JSON
        )
        
        raw_content = response.choices[0].message.content
        
        # 4. Parsing et Validation Pydantic
        try:
            # Cleaning
            clean_content = raw_content.replace('```json', '').replace('```', '').strip()
            
            # Parsing raw JSON
            data = json.loads(clean_content)
            
            # Pydantic
            analysis = TicketAnalysis(**data)
            
            print("✅ [IA] JSON validé par Pydantic.")
            return analysis.model_dump_json(indent=2)
            
        except json.JSONDecodeError:
             print(f"⚠️ [IA] Echec du parsing JSON. Raw: {raw_content[:200]}...")
             return f"Erreur de format JSON: {raw_content}"
        except ValidationError as e:
             print(f"⚠️ [IA] Erreur de validation du schéma : {str(e)}")
             return f"Erreur de schéma: {str(e)}\nRaw: {raw_content}"
        
    except Exception as e:
        print(f"❌ [IA] Erreur système : {str(e)}")
        return f"Erreur système : {str(e)}"

def process_ticket(payload):
    """
    Handles received ticket via Redis (Laravel Event)
    Payload expected: {'ticket_id': ..., 'title': ..., 'description': ..., 'status': ...}
    """
    ticket_id = payload.get('ticket_id')
    title = payload.get('title')
    description = payload.get('description', 'Pas de description fournie.')

    print(f"🤖 [IA] Analyse du ticket #{ticket_id} : {title}")
    
    opinion = generate_ai_opinion(ticket_id, title, description)

    print("="*60)
    print(f"📝 OPINION IA pour le ticket #{ticket_id}")
    print("="*60)
    print(opinion)
    print("="*60)
    print(f"✅ [IA] Analyse terminée pour le ticket #{ticket_id}")


def start_worker():
    print(f"🔌 [IA Orchestrator] Connexion à Redis ({REDIS_HOST}:{REDIS_PORT})...")

    try:
        # Automatic reconnection handled by Redis client
        r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, decode_responses=True)
        r.ping()  # Immediate connection test

        print(f"🚀 [IA Orchestrator] En attente de tâches sur la file : '{QUEUE_NAME}'")

        while True:
            # BLPOP blocks until a message arrives (avoids spamming the CPU)
            # Timeout 0 = infinite
            task = r.blpop(QUEUE_NAME, timeout=0)

            if task:
                # task is a tuple (queue_name, data)
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
        start_worker()  # Simple recursive call for demo
    except KeyboardInterrupt:
        print("\n👋 Arrêt du worker IA.")
        sys.exit(0)


if __name__ == "__main__":
    # Force print flush to see Docker logs immediately
    sys.stdout.reconfigure(line_buffering=True)
    start_worker()
