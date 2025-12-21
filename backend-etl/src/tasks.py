import boto3
import json
import os
import lancedb
import pyarrow as pa
import numpy as np
from .celery_app import app
from .config import MINIO_ENDPOINT, MINIO_ACCESS_KEY, MINIO_SECRET_KEY, MINIO_SECURE
from .model import get_model

# LanceDB configuration (path defined in Docker Compose)
LANCEDB_PATH = os.getenv('LANCEDB_PATH', '/data/lancedb')

# S3 client (MinIO)
s3_client = boto3.client(
    's3',
    endpoint_url=f"http://{MINIO_ENDPOINT}",
    aws_access_key_id=MINIO_ACCESS_KEY,
    aws_secret_access_key=MINIO_SECRET_KEY,
    use_ssl=MINIO_SECURE
)

def get_db_connection():
    """Open connection to LanceDB."""
    return lancedb.connect(LANCEDB_PATH)

@app.task(name='tasks.process_file')
def process_file(bucket_name, object_key):
    """
    Download the file from MinIO for local processing.
    """
    print(f"📥 [CELERY] Received task for: {object_key} in {bucket_name}")

    try:
        # Creating a temporary directory for download
        local_path = f"/tmp/{object_key}"
        os.makedirs(os.path.dirname(local_path), exist_ok=True)

        # File downloading
        s3_client.download_file(bucket_name, object_key, local_path)

        print(f"✅ [CELERY] File downloaded successfully: {local_path}")

        if object_key.endswith('.json'):
            process_json_ticket(local_path, object_key)
        else:
            print(f"⚠️ [CELERY] OCR processing not implemented for:"
                  f"{object_key}")


        # Cleanup
        if os.path.exists(local_path):
            os.remove(local_path)

        return f"Processed {object_key}"

    except Exception as e:
        print(f"❌ [CELERY] Failed downloading: {str(e)}")
        raise e


def process_json_ticket(file_path, object_key):
    """
    Reads the JSON, prepares the text, and triggers BGE-M3 vectorization.
    """
    print("🤖 Starting JSON ticket processing...")

    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # 1. Prepare text for embedding
    title = data.get('title', '')
    description = data.get('description', '')
    solution = data.get('solution', '')

    # Complete text representing the document
    text_to_embed = f"{title}\n{description}\n{solution}\n".strip()
    if not text_to_embed:
        print("⚠️ JSON ticket is empty, skipping vectorization.")
        return

    # 2. Vectorization (BGE-M3)
    model = get_model()  # Get singleton

    # return_dense=True -> Semantic vector (size 1024 for BGE-M3)
    # return_sparse=True -> Lexical vector (word weights) for hybrid search
    print("🧠 Generating embeddings with BGE-M3...")
    output = model.encode(text_to_embed, return_dense=True, return_sparse=True,
                          return_colbert_vecs=False)

    dense_vec = output['dense_vecs']
    raw_sparse_vec = output['lexical_weights']
    # Convert numpy.float32 to python float for JSON serialization
    sparse_vec = {k: float(v) for k, v in raw_sparse_vec.items()}

    # 3. Insert into LanceDB
    print("💾 Inserting ticket into LanceDB...")
    db = get_db_connection()

    # We store the sparse vector as a JSON string for now
    record = [{
        "vector": dense_vec,
        "filename": object_key,
        "ticket_id": data.get('ticket_id', 0),  # Added specific field
        "title": title,
        "text": text_to_embed,
        "sparse_json": json.dumps(sparse_vec, ensure_ascii=False)
    }]

    try:
        table_name = "tickets"

        if table_name not in db.table_names():
            print(f"🆕 [LANCEDB] Creating table '{table_name}'...")
            tbl = db.create_table(table_name, data=record)
        else:
            tbl = db.open_table(table_name)
            tbl.add(record)

        print(f"💾 [LANCEDB] Ticket successfully inserted"
              f"(Table: {table_name})")
        print(f"   ↳ File: {object_key}")
        print(f"   ↳ Total Rows: {len(tbl)}")

    except Exception as e:
        print(f"❌ [LANCEDB] Error inserting record: {e}")
        raise e
