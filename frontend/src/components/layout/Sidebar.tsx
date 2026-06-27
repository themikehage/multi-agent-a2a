import { StatusBadge } from '@/components/ui/StatusBadge'
import { cn } from '@/lib/utils'
import type { AgentInfo } from '@/types/a2a'

interface SidebarProps {
  agents: AgentInfo[]
  selectedAgent: string
  onSelectAgent: (url: string) => void
  open: boolean
  onClose: () => void
}

const agentLabels: Record<string, string> = {
  host: 'Host Agent',
  data: 'Data Agent',
  planning: 'Planning Agent',
  creative: 'Creative Agent',
}

const agentDescriptions: Record<string, string> = {
  host: 'Orchestrates all agents',
  data: 'Data analysis & visualization',
  planning: 'Task planning & timelines',
  creative: 'Content generation',
}

export function Sidebar({ agents, selectedAgent, onSelectAgent, open, onClose }: SidebarProps) {
  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-30 bg-black/50 transition-opacity lg:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={onClose}
      />

      <aside
        className={cn(
          'fixed left-0 top-14 z-40 h-[calc(100vh-3.5rem)] w-64 border-r border-border bg-surface transition-transform duration-200 lg:relative lg:top-0 lg:z-0 lg:h-auto lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Agents</h2>
          <span className="text-xs text-text-secondary">
            {agents.filter(a => a.status === 'online').length}/{agents.length}
          </span>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {agents.map(agent => (
            <button
              key={agent.type}
              onClick={() => onSelectAgent(agent.url)}
              className={cn(
                'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors',
                selectedAgent === agent.url
                  ? 'bg-accent/10 text-accent'
                  : 'text-text-secondary hover:bg-surface-elevated hover:text-text-primary'
              )}
            >
              <StatusBadge status={agent.status} />

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {agentLabels[agent.type]}
                </p>
                <p className="text-xs text-text-secondary truncate">
                  {agentDescriptions[agent.type]}
                </p>
              </div>

              {agent.card && (
                <span className="text-xs text-text-secondary">{agent.card.version}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="border-t border-border p-3">
          <div className="rounded-lg bg-surface-elevated p-3">
            <p className="text-xs text-text-secondary">
              Select an agent to send tasks directly, or use the Host Agent for automatic routing.
            </p>
          </div>
        </div>
      </aside>
    </>
  )
}
