import boto3
import os
import json
from .celery_app import app
from .config import (MINIO_ENDPOINT, MINIO_ACCESS_KEY, MINIO_SECRET_KEY,
                     MINIO_SECURE)

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

        # --- Here would be the place to add OCR and Vectorization later ---
        # If it's context.json -> Direct BGE-M3 Vectorization
        # If it's a PDF -> Unstructured OCR -> Vectorization

        # Change me later:
        if object_key.endswith('.json'):
            print(f"🔍 [CELERY] Reading file if it is .json")
            with open(local_path, 'r') as f:
                data = json.load(f)
                print(f"📄 [CELERY] JSON Content Preview:"
                      f"{str(data)[:100]}...")


        # Cleanup
        os.remove(local_path)

        return f"Processed {object_key}"

    except Exception as e:
        print(f"❌ [CELERY] Failed downloading: {str(e)}")
        raise e
