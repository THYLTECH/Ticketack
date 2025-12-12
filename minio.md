docker run -it --rm --network ticketack_sail --entrypoint /bin/sh minio/mc
mc mb local/tickets-raw
mc alias set local http://minio:9000 sail password
mc admin config set local notify_redis:1 address="redis:6379" key="minio_events"
mc admin service restart local
mc event add local/tickets-raw arn:minio:sqs::1:redis --event put
