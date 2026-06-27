import { StatusBadge } from '@/components/ui/StatusBadge'

interface HeaderProps {
  connected: boolean
  onRefresh: () => void
  onMenuToggle: () => void
  sidebarOpen: boolean
}

export function Header({ connected, onRefresh, onMenuToggle, sidebarOpen }: HeaderProps) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-surface px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="rounded-lg p-2 text-text-secondary hover:bg-surface-elevated hover:text-text-primary transition-colors lg:hidden"
          title={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {sidebarOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
            </svg>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-sm font-semibold text-text-primary">A2A Agents</h1>
            <p className="text-xs text-text-secondary">Multi-Agent System</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <StatusBadge
          status={connected ? 'online' : 'offline'}
          label={connected ? 'Connected' : 'Disconnected'}
          pulse={connected}
        />
        <button
          onClick={onRefresh}
          className="rounded-lg p-2 text-text-secondary hover:bg-surface-elevated hover:text-text-primary transition-colors"
          title="Refresh agents"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
    </header>
  )
}
