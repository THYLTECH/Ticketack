from celery import Celery
from .config import REDIS_HOST, REDIS_PORT

# Broker definition (Redis) for Celery handling its tasks
broker_url = f'redis://{REDIS_HOST}:{REDIS_PORT}/0'

app = Celery('ticketack_etl', broker=broker_url, include=['src.tasks'])

app.conf.update(
    result_expires=3600,
    worker_prefetch_multiplier=1
)

if __name__ == '__main__':
    app.start()
