import { useState, useEffect, useCallback } from 'react'
import type { AgentType, AgentInfo } from '@/types/a2a'
import { discoverAgent, checkHealth } from '@/services/api'
import { getCircuitBreaker } from '@/services/circuit-breaker'

const AGENTS: { type: AgentType; url: string }[] = [
  { type: 'host', url: '/api/host' },
  { type: 'data', url: '/api/data' },
  { type: 'planning', url: '/api/planning' },
  { type: 'creative', url: '/api/creative' },
]

interface AgentDiscoveryResult {
  agents: AgentInfo[]
  loading: boolean
  refresh: () => Promise<void>
  getAgent: (type: AgentType) => AgentInfo | undefined
}

export function useAgentDiscovery(pollInterval = 10000): AgentDiscoveryResult {
  const [agents, setAgents] = useState<AgentInfo[]>(
    AGENTS.map(a => ({ type: a.type, url: a.url, status: 'connecting' as const }))
  )
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setAgents(prev => prev.map(a => ({ ...a, status: 'connecting' as const })))

    const results = await Promise.all(
      AGENTS.map(async ({ type, url }): Promise<AgentInfo> => {
        const circuit = getCircuitBreaker(type)

        const isAlive = await circuit.execute(() => checkHealth(url))

        if (!isAlive) {
          return { type, url, status: 'offline' }
        }

        try {
          const card = await circuit.execute(() => discoverAgent(url))
          return { type, url, card, status: 'online' }
        } catch (error) {
          return {
            type, url,
            status: 'online',
            lastError: error instanceof Error ? error.message : 'Discovery failed',
          }
        }
      })
    )

    setAgents(results)
    setLoading(false)
  }, [])

  const getAgent = useCallback(
    (type: AgentType): AgentInfo | undefined =>
      agents.find(a => a.type === type),
    [agents]
  )

  useEffect(() => {
    refresh()
    const interval = setInterval(refresh, pollInterval)
    return () => clearInterval(interval)
  }, [refresh, pollInterval])

  return { agents, loading, refresh, getAgent }
}
