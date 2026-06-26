FROM python:3.12-slim

RUN apt-get update && apt-get install -y \
    supervisor \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
COPY supervisord.conf /etc/supervisor/supervisord.conf
COPY start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 7860

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -sf http://localhost:7860 || curl -sf http://localhost:8000/health || exit 1

CMD ["/start.sh"]
