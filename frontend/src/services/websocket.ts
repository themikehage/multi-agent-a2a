import type { Task } from '@/types/a2a'

export class WebSocketError extends Error {
  constructor(
    message: string,
    public code?: number
  ) {
    super(message)
    this.name = 'WebSocketError'
  }
}

export function createTaskSubscription(
  url: string,
  taskId: string,
  onMessage: (task: Task) => void,
  onError: (error: Error) => void,
  onClose: () => void
): () => void {
  const wsUrl = url.replace(/^http/, 'ws')
  const ws = new WebSocket(`${wsUrl}/tasks/${taskId}/subscribe`)

  ws.onmessage = (event) => {
    try {
      const task = JSON.parse(event.data) as Task
      onMessage(task)
    } catch {
      onError(new WebSocketError('Failed to parse WebSocket message'))
    }
  }

  ws.onerror = () => {
    onError(new WebSocketError('WebSocket connection error'))
  }

  ws.onclose = (event) => {
    if (!event.wasClean) {
      onError(new WebSocketError('WebSocket closed unexpectedly', event.code))
    }
    onClose()
  }

  return () => {
    if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
      ws.close()
    }
  }
}

export function subscribeToTask(
  url: string,
  taskId: string,
  onMessage: (task: Task) => void,
  onError: (error: Error) => void,
  onComplete: () => void,
  timeout = 120000
): () => void {
  let timeoutId: ReturnType<typeof setTimeout>
  let cleanup: (() => void) | null = null

  const startTimeout = () => {
    timeoutId = setTimeout(() => {
      if (cleanup) cleanup()
      onError(new Error('Task subscription timed out'))
      onComplete()
    }, timeout)
  }

  const clearTimer = () => {
    if (timeoutId) clearTimeout(timeoutId)
  }

  cleanup = createTaskSubscription(
    url,
    taskId,
    (task) => {
      clearTimer()
      startTimeout()
      onMessage(task)

      const terminalStates = ['completed', 'failed', 'cancelled']
      if (terminalStates.includes(task.status.state)) {
        clearTimer()
        if (cleanup) cleanup()
        onComplete()
      }
    },
    (error) => {
      clearTimer()
      onError(error)
    },
    () => {
      clearTimer()
      onComplete()
    }
  )

  startTimeout()

  return () => {
    clearTimer()
    if (cleanup) cleanup()
  }
}
