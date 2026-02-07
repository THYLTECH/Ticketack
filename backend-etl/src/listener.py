import json
import redis
from .config import REDIS_HOST, REDIS_PORT, REDIS_QUEUE_KEY
from .tasks import process_file, delete_ticket_data, delete_file_vector


def start_listening():
    r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, decode_responses=True)
    # Force flush to make sure the print appears in Docker logs
    print(f"👀 [LISTENER] Starting... Waiting on '{REDIS_QUEUE_KEY}'",
          flush=True)

    while True:
        try:
            # BLPOP returns a tuple (key, value)
            _, raw_data = r.blpop(REDIS_QUEUE_KEY)

            # Simple check to debug
            # print(f"⚡ Received: {raw_data[:100]}...", flush=True)

            event_data = json.loads(raw_data)

            # --- CASE A: Laravel App Event (Custom) ---
            if 'source' in event_data and event_data['source'] == 'laravel_app':
                action = event_data.get('action')
                payload = event_data.get('payload', {})

                print(f"🔔 [APP EVENT] Action: {action}", flush=True)

                if action == 'delete_ticket':
                    # Use .delay() for async execution
                    delete_ticket_data.delay(payload.get('ticket_id'))

                elif action == 'delete_file':
                    delete_file_vector.delay(payload.get('filename'))

                else:
                    print(f"⚠️ Unknown app action: {action}", flush=True)

                continue

                # --- CASE B: MinIO S3 Event (Standard) ---
            records = []
            if isinstance(event_data, list):  # MinIO Access format
                for item in event_data:
                    if 'Event' in item:
                        records.extend(item['Event'])
            elif isinstance(event_data, dict) and 'Records' in event_data:  # S3 format
                records = event_data['Records']

            for record in records:
                eventName = record.get('eventName', '')

                # We only care about ObjectCreated (Put) events here.
                # Deletions are handled by the Laravel App Event above.
                if 'ObjectCreated' in eventName:
                    s3_info = record.get('s3', {})
                    bucket_name = s3_info.get('bucket', {}).get('name')
                    object_key = s3_info.get('object', {}).get('key')

                if bucket_name and object_key:
                    # URL decoding (ex: "my+file.pdf" -> "my file.pdf")
                    # MinIO often sends spaces as '+'
                    from urllib.parse import unquote_plus
                    object_key = unquote_plus(object_key)

                    print(f"🚀 [S3 EVENT] Processing upload: {object_key}", flush=True)
                    process_file.delay(bucket_name, object_key)

        except json.JSONDecodeError:
            print("❌ [LISTENER] JSON Decode Error", flush=True)
        except Exception as e:
            print(f"❌ [LISTENER] Critical Error: {e}", flush=True)


if __name__ == "__main__":
    start_listening()
