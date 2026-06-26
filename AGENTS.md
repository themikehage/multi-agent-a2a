# A2A Multi-Agent System - Agent Instructions

## Mandatory Context Files

Before any work, read these files:
- `about.md` — Project brief and stack
- `steps.md` — Progress checklist (mark `[x]` as completed)
- `AGENTS.md` — This file (agent instructions)

## Workflow

1. Read the 3 critical files
2. Pick the next task from `steps.md`
3. Complete the task
4. Validate (run tests, build Docker, etc.)
5. Commit with conventional message format
6. Update `steps.md`

## Commands

```bash
# Build Docker image
docker build -t a2a-multi-agent .

# Run locally with Qwen
docker run -p 7860:7860 \
  -e DASHSCOPE_API_KEY=your_key \
  -e MODEL_NAME=qwen3.7-plus \
  a2a-multi-agent

# Run locally with default env
docker run -p 7860:7860 --env-file .env.qwen a2a-multi-agent
```

## Code Conventions

- **Python 3.12+** with type hints
- **No comments** in production code
- Follow existing patterns (A2ABaseServer, A2AClient)
- Use `uvicorn.run()` for agent servers
- Gradio for web UI

## Deploy

### Platform
- **Service:** Coolify
- **Deployment type:** Single-container Docker with supervisord
- **Public URL:** Configurable (web-ui on port 7860)

### Environment Variables (required)
- `DASHSCOPE_API_KEY` — Qwen API key
- `MODEL_NAME` — Model name (default: qwen3.7-plus)
- `MODEL_BASE_URL` — API endpoint (default: https://dashscope-intl.aliyuncs.com/compatible-mode/v1)

### Considerations
- Health check: `/health` endpoint on each agent
- Supervisord autorestart handles agent failures
- All agents in single container (ports 8000-8003 internal, 7860 public)
