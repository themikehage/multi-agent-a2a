#!/bin/bash
set -e

export MODEL_BASE_URL=${MODEL_BASE_URL:-https://dashscope-intl.aliyuncs.com/compatible-mode/v1}
export MODEL_NAME=${MODEL_NAME:-qwen3.7-plus}

if [ -z "$DASHSCOPE_API_KEY" ] && [ -z "$MODEL_API_KEY" ]; then
    echo "ERROR: DASHSCOPE_API_KEY or MODEL_API_KEY must be set"
    exit 1
fi

export MODEL_API_KEY=${MODEL_API_KEY:-$DASHSCOPE_API_KEY}

echo "Starting A2A Multi-Agent System..."
echo "  MODEL_NAME: $MODEL_NAME"
echo "  MODEL_BASE_URL: $MODEL_BASE_URL"

exec supervisord -c /etc/supervisor/supervisord.conf
