import { cn } from '@/lib/utils'
import type { AgentConnectionStatus } from '@/types/a2a'

interface StatusBadgeProps {
  status: AgentConnectionStatus
  label?: string
  pulse?: boolean
}

const statusConfig = {
  online: { color: 'bg-success', label: 'Online' },
  offline: { color: 'bg-error', label: 'Offline' },
  connecting: { color: 'bg-warning', label: 'Connecting' },
  error: { color: 'bg-error', label: 'Error' },
}

export function StatusBadge({ status, label, pulse = true }: StatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <span className="inline-flex items-center gap-2">
      <span className="relative flex h-2.5 w-2.5">
        <span
          className={cn(
            'absolute inline-flex h-full w-full rounded-full opacity-75',
            config.color,
            pulse && status === 'online' && 'animate-ping'
          )}
        />
        <span
          className={cn(
            'relative inline-flex h-2.5 w-2.5 rounded-full',
            config.color
          )}
        />
      </span>
      {label && (
        <span className="text-sm text-text-secondary">{label}</span>
      )}
    </span>
  )
}
