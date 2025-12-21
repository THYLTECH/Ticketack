import boto3
import os
import json
from .celery_app import app
from .config import (MINIO_ENDPOINT, MINIO_ACCESS_KEY, MINIO_SECRET_KEY,
                     MINIO_SECURE)
from .model import get_model

# S3 client (MinIO)
s3_client = boto3.client(
    's3',
    endpoint_url=f"http://{MINIO_ENDPOINT}",
    aws_access_key_id=MINIO_ACCESS_KEY,
    aws_secret_access_key=MINIO_SECRET_KEY,
    use_ssl=MINIO_SECURE
)


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
            process_json_ticket(local_path)
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


def process_json_ticket(file_path):
    """
    Reads the JSON, prepares the text, and triggers BGE-M3 vectorization.
    """
    print("🤖 Starting JSON ticket processing...")

    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # --- Construction of the text to be vectorized ---
    # We concatenate relevant fields for meaning.
    ticket_id = data.get('ticket_id', '')
    title = data.get('title', '')
    description = data.get('description', '')
    solution = data.get('solution', '')
    author = data.get('author', '')
    closed_at = data.get('closed_at', '')

    # Complete text representing the document
    text_to_embed = (f"{ticket_id}\n{title}\n{description}\n{solution}\n"
                     f"{author}\n{closed_at}").strip()

    if not text_to_embed:
        print("⚠️ JSON ticket is empty, skipping vectorization.")
        return

    # --- Vectorisation ---
    model = get_model()  # Get singleton

    # return_dense=True -> Semantic vector (size 1024 for BGE-M3)
    # return_sparse=True -> Lexical vector (word weights) for hybrid search
    output = model.encode(text_to_embed, return_dense=True, return_sparse=True,
                          return_colbert_vecs=False)

    dense_vec = output['dense_vecs']
    sparse_vec = output['lexical_weights']

    # Change me: --- Print for verification (before LanceDB step) ---
    print(f"✨ [BGE-M3] JSON ticket processing completed.")
    print(f"   🔹 Dense Vector Length: {len(dense_vec)}") # Should be 1024
    print(f"   🔹 Dense Vector Sample: {dense_vec[:5]}...")
    print(f"   🔸 Sparse Vector Terms Found: {len(sparse_vec)}")
    print(f"   🔸 Sparse Vector Sample: {dict(list(sparse_vec.items())[:3])}")
