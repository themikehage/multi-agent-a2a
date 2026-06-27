import { PartType, TaskState, type AgentCard, type Task } from '@/types/a2a'

export class APIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public code?: string
  ) {
    super(message)
    this.name = 'APIError'
  }
}

export class TimeoutError extends APIError {
  constructor(message = 'Request timed out') {
    super(message, undefined, 'TIMEOUT')
    this.name = 'TimeoutError'
  }
}

export class NetworkError extends APIError {
  constructor(message = 'Network error') {
    super(message, undefined, 'NETWORK')
    this.name = 'NetworkError'
  }
}

export class CircuitOpenError extends APIError {
  constructor(message = 'Service temporarily unavailable') {
    super(message, undefined, 'CIRCUIT_OPEN')
    this.name = 'CircuitOpenError'
  }
}

interface RetryConfig {
  maxRetries: number
  initialDelay: number
  maxDelay: number
  backoffFactor: number
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  initialDelay: 1000,
  maxDelay: 10000,
  backoffFactor: 2,
}

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function calculateDelay(attempt: number, config: RetryConfig): number {
  const delay = config.initialDelay * Math.pow(config.backoffFactor, attempt)
  return Math.min(delay, config.maxDelay)
}

function isRetryable(error: unknown): boolean {
  if (error instanceof NetworkError) return true
  if (error instanceof TimeoutError) return true
  if (error instanceof APIError && error.statusCode) {
    return error.statusCode >= 500 || error.statusCode === 429
  }
  return false
}

export async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  config: RetryConfig = DEFAULT_RETRY_CONFIG
): Promise<T> {
  let lastError: unknown

  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error

      if (attempt === config.maxRetries || !isRetryable(error)) {
        throw error
      }

      const delay = calculateDelay(attempt, config)
      await sleep(delay)
    }
  }

  throw lastError
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let message = response.statusText
    try {
      const errorData = await response.json()
      message = errorData.detail || errorData.message || message
    } catch {
      // Ignore JSON parse errors
    }

    if (response.status === 408 || response.status === 504) {
      throw new TimeoutError(message)
    }

    throw new APIError(message, response.status)
  }

  return response.json()
}

export async function fetchJSON<T>(
  url: string,
  options: RequestInit = {},
  timeout = 60000
): Promise<T> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    return await handleResponse<T>(response)
  } catch (error) {
    if (error instanceof APIError) {
      throw error
    }

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new TimeoutError()
      }
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        throw new NetworkError()
      }
    }

    throw new NetworkError('Unknown network error')
  } finally {
    clearTimeout(timeoutId)
  }
}

export async function discoverAgent(url: string): Promise<AgentCard> {
  return fetchJSON<AgentCard>(`${url}/.well-known/agent.json`)
}

export async function createTask(url: string, prompt: string): Promise<Task> {
  const task: Partial<Task> = {
    id: crypto.randomUUID(),
    status: {
      state: TaskState.SUBMITTED,
      message: {
        parts: [{ type: PartType.TEXT, text: prompt }],
      },
    },
    artifacts: [],
    metadata: {},
  }

  return fetchJSON<Task>(`${url}/tasks`, {
    method: 'POST',
    body: JSON.stringify(task),
  })
}

export async function getTask(url: string, taskId: string): Promise<Task> {
  return fetchJSON<Task>(`${url}/tasks/${taskId}`)
}

export async function cancelTask(url: string, taskId: string): Promise<Task> {
  return fetchJSON<Task>(`${url}/tasks/${taskId}`, { method: 'DELETE' })
}

export async function checkHealth(url: string): Promise<boolean> {
  try {
    await fetchJSON<{ status: string }>(`${url}/health`, {}, 5000)
    return true
  } catch {
    return false
  }
}
