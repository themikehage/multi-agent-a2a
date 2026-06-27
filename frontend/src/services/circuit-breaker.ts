import { CircuitOpenError } from './api'

type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN'

interface CircuitBreakerConfig {
  failureThreshold: number
  resetTimeout: number
  monitoringPeriod: number
}

const DEFAULT_CONFIG: CircuitBreakerConfig = {
  failureThreshold: 3,
  resetTimeout: 30000,
  monitoringPeriod: 60000,
}

export class CircuitBreaker {
  private state: CircuitState = 'CLOSED'
  private failureCount = 0
  private nextAttempt = 0

  constructor(
    private name: string,
    private config: CircuitBreakerConfig = DEFAULT_CONFIG
  ) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() >= this.nextAttempt) {
        this.state = 'HALF_OPEN'
      } else {
        throw new CircuitOpenError(`${this.name} circuit is open`)
      }
    }

    try {
      const result = await fn()
      this.onSuccess()
      return result
    } catch (error) {
      this.onFailure()
      throw error
    }
  }

  private onSuccess(): void {
    this.failureCount = 0
    this.state = 'CLOSED'
  }

  private onFailure(): void {
    this.failureCount++

    if (this.state === 'HALF_OPEN' || this.failureCount >= this.config.failureThreshold) {
      this.state = 'OPEN'
      this.nextAttempt = Date.now() + this.config.resetTimeout
    }
  }

  getState(): CircuitState {
    return this.state
  }

  getFailureCount(): number {
    return this.failureCount
  }

  reset(): void {
    this.state = 'CLOSED'
    this.failureCount = 0
    this.nextAttempt = 0
  }
}

const circuitBreakers = new Map<string, CircuitBreaker>()

export function getCircuitBreaker(name: string): CircuitBreaker {
  if (!circuitBreakers.has(name)) {
    circuitBreakers.set(name, new CircuitBreaker(name))
  }
  return circuitBreakers.get(name)!
}

export function resetAllCircuitBreakers(): void {
  circuitBreakers.forEach(cb => cb.reset())
}
