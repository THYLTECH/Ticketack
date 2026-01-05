import os

# Redis configuration
REDIS_HOST = os.getenv('REDIS_HOST', 'redis')
REDIS_PORT = os.getenv('REDIS_PORT', '6379')
# Key defined in your mc admin config command: key="minio_events"
REDIS_QUEUE_KEY = 'minio_events'

# Minio configuration
MINIO_ENDPOINT = os.getenv('MINIO_ENDPOINT', 'minio:9000')
MINIO_ACCESS_KEY = os.getenv('MINIO_ROOT_USER', 'sail')
MINIO_SECRET_KEY = os.getenv('MINIO_ROOT_PASSWORD', 'password')
MINIO_BUCKET = 'tickets-raw'
MINIO_SECURE = False # False as it is HTTP network in Docker Compose
