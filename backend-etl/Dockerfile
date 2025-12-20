FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# No port is exposed because this is a worker that consumes
CMD ["python", "-m", "src.listener"]
