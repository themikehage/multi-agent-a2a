# A2A Frontend - Agent Instructions

## Mandatory Context Files

Before any work, read these files:
- `frontend/about.md` — Project brief and stack
- `frontend/steps.md` — Progress checklist (mark `[x]` as completed)
- `frontend/AGENTS.md` — This file (agent instructions)

Also read the parent project files for context:
- `about.md` — Overall project brief
- `AGENTS.md` — Parent project instructions

## Workflow

1. Read the critical files
2. Pick the next task from `steps.md`
3. Complete the task
4. Validate: `pnpm run build` must pass
5. Commit with conventional message format
6. Update `steps.md`

## Commands

```bash
# Development
pnpm run dev          # Start dev server on port 5173

# Build
pnpm run build        # Production build to dist/
pnpm run preview      # Preview production build

# Lint & Type Check
pnpm run lint         # ESLint
pnpm exec tsc --noEmit  # TypeScript check
```

## Code Conventions

- **TypeScript strict mode** — no `any` types
- **Tailwind CSS v4** — CSS-based config, no tailwind.config.js
- **No comments** in production code
- **Absolute imports** — use `@/` alias for `src/`
- **Component structure** — one component per file, named exports
- **Framer Motion** — for all animations and transitions
- **Mobile-first responsive** — 375px, 768px, 1280px breakpoints

## Design System

### Colors (Dark Mode Técnico)
- `--color-bg`: #0a0a0f (deep dark background)
- `--color-surface`: #12121a (cards, panels)
- `--color-surface-elevated`: #1a1a26 (hover states)
- `--color-accent`: #6366f1 (indigo - primary actions)
- `--color-accent-secondary`: #22d3ee (cyan - info/streaming)
- `--color-text-primary`: #f1f1f4
- `--color-text-secondary`: #8b8b9e
- `--color-success`: #22c55e (agent online)
- `--color-error`: #ef4444 (errors/offline)
- `--color-warning`: #f59e0b (working/processing)

### Typography
- Display/Body: Inter (Google Fonts)
- Mono: JetBrains Mono (code, IDs, technical data)

### Signature Elements
- Pulsing dots for agent status
- Gradient borders on active elements
- Smooth transitions on state changes

## Architecture

```
frontend/src/
  components/
    layout/       Header, Sidebar, Layout
    chat/         ChatMessage, ChatInput, MessageList
    agents/       AgentCard, AgentStatus
    artifacts/    ArtifactList, ArtifactViewer
    ui/           Button, Card, StatusBadge, Toast, ErrorBoundary
  hooks/          useAgentDiscovery, useTaskSubmission, useToast
  services/       api.ts (HTTP), websocket.ts (WS), errors.ts
  types/          a2a.ts (protocol types)
  lib/            utils.ts (helpers)
```

## Backend API Endpoints

All agents expose the same endpoints (ports 8000-8003):
- `GET /.well-known/agent.json` — Agent discovery
- `POST /tasks` — Create task
- `GET /tasks/{id}` — Get task status
- `WS /tasks/{id}/subscribe` — Stream task updates
- `GET /health` — Health check

Host Agent (port 8000) orchestrates other agents.

## Deploy

### Platform
- **Service:** Docker container with nginx
- **Build output:** `dist/` directory
- **Served at:** Root path (/) alongside agent APIs

### Docker Integration
- Frontend is built in Dockerfile
- nginx serves static files from `dist/`
- API requests proxied to agent ports

### Considerations
- Frontend runs on port 7860 (replaces Gradio)
- Agent APIs remain on internal ports 8000-8003
- nginx handles both static files and API proxying

## Git Commit Style

```
type(scope): description

feat(chat): add streaming message display
feat(agents): add status panel with pulsing indicators
fix(api): handle WebSocket reconnection
style(ui): update button hover states
chore(deps): update framer-motion
```
