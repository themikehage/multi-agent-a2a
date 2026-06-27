import { useState, type ReactNode } from 'react'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import type { AgentInfo } from '@/types/a2a'

interface LayoutProps {
  children: ReactNode
  agents: AgentInfo[]
  selectedAgent: string
  onSelectAgent: (url: string) => void
  onRefresh: () => void
  connected: boolean
}

export function Layout({
  children,
  agents,
  selectedAgent,
  onSelectAgent,
  onRefresh,
  connected,
}: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const closeSidebar = () => setSidebarOpen(false)

  return (
    <div className="flex h-screen flex-col bg-bg">
      <Header
        connected={connected}
        onRefresh={onRefresh}
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          agents={agents}
          selectedAgent={selectedAgent}
          onSelectAgent={(url) => { onSelectAgent(url); closeSidebar() }}
          open={sidebarOpen}
          onClose={closeSidebar}
        />
        <main className="flex-1 overflow-y-auto min-w-0">
          {children}
        </main>
      </div>
    </div>
  )
}
