FROM node:22-alpine AS frontend-build
WORKDIR /app
COPY frontend/package.json frontend/pnpm-lock.yaml frontend/pnpm-workspace.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile --ignore-scripts \
    && cd /app/node_modules/.pnpm/esbuild@0.25.12/node_modules/esbuild && node install.js
COPY frontend/ .
RUN pnpm run build

FROM python:3.12-slim

RUN apt-get update && apt-get install -y \
    supervisor \
    curl \
    nginx \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
COPY supervisord.conf /etc/supervisor/supervisord.conf
COPY start.sh /start.sh
RUN chmod +x /start.sh

COPY --from=frontend-build /app/dist /usr/share/nginx/html
COPY frontend/nginx.conf /etc/nginx/conf.d/a2a.conf
RUN rm -f /etc/nginx/sites-enabled/default

EXPOSE 7860

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -sf http://localhost:7860 || curl -sf http://localhost:8000/health || exit 1

CMD ["/start.sh"]
