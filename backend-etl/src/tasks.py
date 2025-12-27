import boto3
import json
import os
import lancedb
import pyarrow as pa
import numpy as np
import logging

# Unstructured imports for OCR and Chunking
from unstructured.partition.auto import partition
from unstructured.chunking.title import chunk_by_title

from .celery_app import app
from .config import (MINIO_ENDPOINT, MINIO_ACCESS_KEY, MINIO_SECRET_KEY,
                     MINIO_SECURE)
from .model import get_model

# Logger setup
logger = logging.getLogger(__name__)

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

# Supported extensions for OCR
SUPPORTED_EXTENSIONS = {'.pdf', '.png', '.jpg', '.jpeg', '.tiff', '.bmp'}


def get_db_connection():
    """Open connection to LanceDB."""
    return lancedb.connect(LANCEDB_PATH)


@app.task(name='tasks.process_file')
def process_file(bucket_name, object_key):
    """
    Download the file from MinIO for local processing.
    Dispatches to JSON processor or OCR processor based on extension.
    """
    print(f"📥 [CELERY] Received task for: {object_key} in {bucket_name}")

    try:
        # Creating a temporary directory for download
        local_path = f"/tmp/{object_key}"
        os.makedirs(os.path.dirname(local_path), exist_ok=True)

        # File downloading
        s3_client.download_file(bucket_name, object_key, local_path)
        print(f"✅ [CELERY] File downloaded successfully: {local_path}")

        # Determine file extension
        _, ext = os.path.splitext(object_key)
        ext = ext.lower()

        if ext == '.json':
            process_json_ticket(local_path, object_key)
        elif ext in SUPPORTED_EXTENSIONS:
            process_document_file(local_path, object_key)
        else:
            print(f"⚠️ [CELERY] Unsupported file type"
                  f"for processing: {object_key}")

        # Cleanup
        if os.path.exists(local_path):
            os.remove(local_path)

        return f"Processed {object_key}"

    except Exception as e:
        print(f"❌ [CELERY] Processing failed: {str(e)}")
        # Ensure cleanup even on error
        if 'local_path' in locals() and os.path.exists(local_path):
            os.remove(local_path)
        raise e


def vectorize_and_store(text_chunk, metadata):
    """
    Shared function to Embed a text chunk and store it in LanceDB.
    """
    if not text_chunk or len(text_chunk.strip()) == 0:
        return

    try:
        model = get_model()  # Get singleton

        # 1. Vectorization (BGE-M3)
        # return_dense=True -> Semantic vector (size 1024 for BGE-M3)
        # return_sparse=True -> Lexical vector (word weights) for hybrid search
        output = model.encode(
            text_chunk,
            return_dense=True,
            return_sparse=True,
            return_colbert_vecs=False
        )

        dense_vec = output['dense_vecs']
        raw_sparse_vec = output['lexical_weights']
        # Convert numpy.float32 to python float for JSON serialization
        sparse_vec = {k: float(v) for k, v in raw_sparse_vec.items()}

        # 2. Prepare Record
        record = [{
            "vector": dense_vec,
            "filename": metadata.get('filename'),
            "ticket_id": metadata.get('ticket_id'),  # Crucial for retrieval
            "chunk_index": metadata.get('chunk_index', 0),
            "source_type": metadata.get('source_type'),
            "text": text_chunk,
            "sparse_json": json.dumps(sparse_vec, ensure_ascii=False)
        }]

        # 3. Insert into LanceDB
        db = get_db_connection()
        table_name = "tickets"

        if table_name not in db.table_names():
            # Create table if it doesn't exist
            # (schema inferred from first record)
            tbl = db.create_table(table_name, data=record)
            print(f"🆕 [LANCEDB] Created table '{table_name}'")
        else:
            tbl = db.open_table(table_name)
            tbl.add(record)

    except Exception as e:
        print(f"❌ [LANCEDB] Error storing chunk: {e}")
        raise e


def process_json_ticket(file_path, object_key):
    """
    Reads the JSON, prepares the text.
    If text is too long, it chunks it. Then vectorizes.
    """
    print("🤖 Starting JSON ticket processing...")

    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    title = data.get('title', '')
    description = data.get('description', '')
    solution = data.get('solution', '')
    ticket_id = data.get('ticket_id', 'unknown')

    # Complete text representing the document
    full_text = (f"Title: {title}\n\nProblem: {description}\n\n"
                 f"Solution: {solution}").strip()

    if not full_text:
        print("⚠️ JSON ticket is empty, skipping.")
        return

    # Basic logic: If text is huge, we might want to chunk it too.
    # For now, we treat it as one block unless it's extremely large.
    # We can use Unstructured's partition_text logic if needed,
    # but here we pass the whole block to vectorize_and_store.

    print(f"🧠 Vectorizing JSON content for Ticket {ticket_id}...")

    metadata = {
        "filename": object_key,
        "ticket_id": ticket_id,
        "chunk_index": 0,
        "source_type": "json"
    }

    vectorize_and_store(full_text, metadata)
    print(f"💾 [LANCEDB] JSON Ticket {ticket_id} stored.")


def process_document_file(file_path, object_key):
    """
    Uses Unstructured to OCR and Chunk PDF/Images.
    """
    print(f"👁️ Starting OCR processing for: {object_key}")

    try:
        # 1. OCR / Partitioning
        # strategy="hi_res" forces OCR for images/scanned PDFs
        # languages=["fra"] helps Tesseract with French content
        elements = partition(
            filename=file_path,
            strategy="hi_res",
            languages=["fra"],
            include_page_breaks=False
        )

        # 2. Smart Chunking
        # Groups text by title, keeping semantic context together.
        chunks = chunk_by_title(
            elements,
            max_characters=1000,
            new_after_n_chars=800,
            combine_text_under_n_chars=200
        )

        if not chunks:
            print(f"⚠️ No text extracted from {object_key}")
            return

        print(f"🧩 Document split into {len(chunks)} chunks.")

        # 3. Vectorize and Store each chunk
        # Extract ticket_id from filename (e.g., "5123_attached_img.pdf")
        filename_base = os.path.basename(object_key)
        ticket_id = filename_base.split('_', 1)[0]

        for i, chunk in enumerate(chunks):
            metadata = {
                "filename": object_key,
                "ticket_id": ticket_id,
                "chunk_index": i,
                "source_type": "file"
            }

            vectorize_and_store(chunk.text, metadata)

        print(f"💾 [LANCEDB] Document {object_key} fully indexed.")

    except Exception as e:
        print(f"❌ [OCR] Error processing document: {e}")
        raise e
