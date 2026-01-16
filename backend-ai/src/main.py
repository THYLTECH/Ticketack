import os
import json
import redis
import sys
import time
from jinja2 import Environment, FileSystemLoader
from openai import OpenAI
from pydantic import BaseModel, Field, ValidationError
from typing import List, Optional

import pymysql
import hashlib

# Configuration via environment variables (Best Practice: 12-factor app)
REDIS_HOST = os.getenv('REDIS_HOST', 'redis')
REDIS_PORT = int(os.getenv('REDIS_PORT', 6379))
QUEUE_NAME = os.getenv('REDIS_QUEUE_NAME', 'ticket_processing_queue')

# DB Configuration
DB_HOST = os.getenv('DB_HOST', 'db')
DB_PORT = int(os.getenv('DB_PORT', 3306))
DB_USER = os.getenv('DB_USER', 'ticketack')
DB_PASSWORD = os.getenv('DB_PASSWORD', 'secret')
DB_DATABASE = os.getenv('DB_DATABASE', 'ticketack')

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

class AnalysisStep(BaseModel):
    description: str = Field(description="Titre ou action principale de l'étape")
    details: Optional[str] = Field(description="Détails techniques ou commande à exécuter", default="")
    confidence_score: Optional[float] = Field(description="Confiance spécifique pour cette étape", default=None)

class TicketAnalysis(BaseModel):
    summary: str = Field(description="Résumé du problème identifié en 1 phrase")
    analysis: str = Field(description="Analyse technique de la cause probable")
    steps: List[AnalysisStep] = Field(description="Liste structurée des étapes de résolution")
    missing_info: Optional[str] = Field(description="Questions à poser au client si incomplet")
    confidence_score: float = Field(description="Score de confiance global entre 0.0 et 1.0")
    citations: List[str] = Field(description="IDs des documents utilisés", default_factory=list)


def get_db_connection():
    return pymysql.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_DATABASE,
        port=DB_PORT,
        cursorclass=pymysql.cursors.DictCursor,
        autocommit=True
    )

def save_suggestion_to_db(ticket_id, analysis_json, prompt_text, documents, model_name, temp=0.2):
    try:
        # Calculate prompt hash
        prompt_hash = hashlib.sha256(prompt_text.encode('utf-8')).hexdigest()
        
        # Prepare snapshot
        model_snapshot = json.dumps({
            "model": model_name,
            "temperature": temp
        })
        
        # Prepare retrieved chunks
        chunks_snapshot = json.dumps(documents)
        
        # Parse analysis to get confidence and time (simulation for time)
        # Note: analysis_json is already a JSON string from model_dump_json
        analysis_data = json.loads(analysis_json)
        confidence = analysis_data.get('confidence_score', 0.5)
        
        connection = get_db_connection()
        with connection.cursor() as cursor:
            sql = """
            INSERT INTO ai_suggestions 
            (ticket_id, model_config_snapshot, prompt_hash, generated_content, retrieved_chunks, confidence_score, processing_time_ms, created_at, updated_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s, NOW(), NOW())
            """
            cursor.execute(sql, (
                ticket_id,
                model_snapshot,
                prompt_hash,
                analysis_json,
                chunks_snapshot,
                confidence,
                0 # Processing time not tracked strictly yet
            ))
        connection.close()
        print(f"💾 [IA] Suggestion sauvegardée en BDD pour le ticket #{ticket_id}.")
        return True
    except Exception as e:
        print(f"❌ [IA] Erreur sauvegarde BDD : {str(e)}")
        return False

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

def generate_ai_opinion(ticket_id, title, context_text, user_feedback=None, previous_suggestion=None):
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
            documents=documents,
            user_feedback=user_feedback,
            previous_suggestion=previous_suggestion
        )
        
        print(f"🧠 [IA] Envoi du prompt à LiteLLM ({MODEL_NAME})...")
        
        temperature = 0.2
        
        # 3. LLM call
        response = client.chat.completions.create(
            model=MODEL_NAME,
            messages=[
                {"role": "user", "content": prompt}
            ],
            stream=False,
            temperature=temperature
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
            
            final_json = analysis.model_dump_json(indent=2)
            
            # 5. Save to DB
            save_suggestion_to_db(ticket_id, final_json, prompt, documents, MODEL_NAME, temperature)
            
            return final_json
            
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

    user_feedback = payload.get('user_feedback')
    previous_suggestion = payload.get('previous_suggestion')

    print(f"🤖 [IA] Analyse du ticket #{ticket_id} : {title}")
    
    opinion = generate_ai_opinion(ticket_id, title, description, user_feedback, previous_suggestion)

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
