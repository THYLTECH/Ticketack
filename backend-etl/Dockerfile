FROM python:3.10-slim

WORKDIR /app

# Installing build tools for certain libraries (bge-m3, etc.)
# and headers for zlib
RUN apt-get update && apt-get install -y \
    build-essential \
    gcc \
    zlib1g-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# No port is exposed because this is a worker that consumes
CMD ["python", "-m", "src.listener"]
