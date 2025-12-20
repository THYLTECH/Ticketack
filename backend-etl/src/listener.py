import json
import redis
from .config import REDIS_HOST, REDIS_PORT, REDIS_QUEUE_KEY
from .tasks import process_file


def start_listening():
    r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, decode_responses=True)
    # Force flush to make sure the print appears in Docker logs
    print(f"👀 [LISTENER] Starting... Waiting on '{REDIS_QUEUE_KEY}'",
          flush=True)

    while True:
        try:
            # BLPOP returns a tuple (key, value)
            _, raw_data = r.blpop(REDIS_QUEUE_KEY)

            print(f"⚡ [LISTENER] Received raw data: {raw_data[:50]}...",
                  flush=True)

            event_data = json.loads(raw_data)
            records = []

            # Case 1: MinIO access format (List of objects containing "Event")
            if isinstance(event_data, list):
                for item in event_data:
                    if 'Event' in item:
                        records.extend(item['Event'])

            # Cas 2: Format S3 Standard (Dict contenant "Records")
            elif isinstance(event_data, dict) and 'Records' in event_data:
                records = event_data['Records']

            if not records:
                print("⚠️ [LISTENER] No records found in the event.",
                      flush=True)
                continue

            for record in records:
                # Standard S3 event structure
                s3_info = record.get('s3', {})
                bucket_name = s3_info.get('bucket', {}).get('name')
                object_key = s3_info.get('object', {}).get('key')

                if bucket_name and object_key:
                    # URL decoding (ex: "my+file.pdf" -> "my file.pdf")
                    # MinIO often sends spaces as '+'
                    from urllib.parse import unquote_plus
                    object_key = unquote_plus(object_key)

                    print(f"🚀 [LISTENER] Sending to Celery: {object_key}",
                          flush=True)
                    process_file.delay(bucket_name, object_key)
                else:
                    print(f"⚠️ [LISTENER] Missing data in record: {record}",
                          flush=True)

        except Exception as e:
            print(f"❌ [LISTENER] Error: {str(e)}", flush=True)


if __name__ == "__main__":
    start_listening()
