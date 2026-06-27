import { useState, useRef, useEffect, useCallback } from 'react'
import { Layout } from '@/components/layout/Layout'
import { MessageList } from '@/components/chat/ChatMessage'
import { ChatInput } from '@/components/chat/ChatInput'
import { ArtifactList, ArtifactViewer } from '@/components/artifacts/ArtifactViewer'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { ToastProvider } from '@/components/ui/Toast'
import { ChatSkeleton } from '@/components/ui/Skeleton'
import { useAgentDiscovery } from '@/hooks/useAgentDiscovery'
import { useTaskSubmission } from '@/hooks/useTaskSubmission'
import { generateId } from '@/lib/utils'
import type { ChatMessage, Artifact, Task } from '@/types/a2a'
import { cn } from '@/lib/utils'

const DEFAULT_AGENT_URL = '/api/host'

function AppContent() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [selectedAgent, setSelectedAgent] = useState(DEFAULT_AGENT_URL)
  const [artifacts, setArtifacts] = useState<Artifact[]>([])
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null)
  const [showArtifacts, setShowArtifacts] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { agents, loading, refresh: refreshAgents } = useAgentDiscovery()
  const { submit, task, isSubmitting } = useTaskSubmission()

  const connected = agents.some(a => a.status === 'online')

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(scrollToBottom, [messages, scrollToBottom])

  useEffect(() => {
    if (task) {
      setMessages(prev => {
        const existing = prev.find(m => m.task?.id === task.id)
        if (existing) {
          return prev.map(m =>
            m.task?.id === task.id
              ? { ...m, content: extractText(task), task, isStreaming: !isTerminal(task) }
              : m
          )
        }
        return prev
      })

      if (task.artifacts.length > 0) {
        setArtifacts(task.artifacts)
      }
    }
  }, [task])

  const handleSend = useCallback(async (prompt: string, file?: File) => {
    if (!prompt && !file) return

    const userMsg: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: prompt + (file ? `\n[Attached: ${file.name}]` : ''),
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMsg])

    await submit(selectedAgent, prompt)
  }, [selectedAgent, submit])

  const handleSelectArtifact = useCallback((artifact: Artifact) => {
    setSelectedArtifact(artifact)
    setShowArtifacts(true)
  }, [])

  const mainContent = loading ? (
    <ChatSkeleton />
  ) : (
    <>
      <MessageList messages={messages} isSubmitting={isSubmitting} />
      <div ref={messagesEndRef} />
      <ChatInput onSend={handleSend} disabled={isSubmitting} />
      {artifacts.length > 0 && (
        <div className="border-t border-border bg-surface">
          <button
            onClick={() => setShowArtifacts(!showArtifacts)}
            className="flex w-full items-center justify-between px-6 py-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            <span>Artifacts ({artifacts.length})</span>
            <svg
              className={cn('h-4 w-4 transition-transform', showArtifacts && 'rotate-180')}
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showArtifacts && (
            <ArtifactList artifacts={artifacts} onSelect={handleSelectArtifact} />
          )}
        </div>
      )}
    </>
  )

  return (
    <Layout
      agents={agents}
      selectedAgent={selectedAgent}
      onSelectAgent={setSelectedAgent}
      onRefresh={refreshAgents}
      connected={connected}
    >
      <div className="flex h-full">
        <div className="flex flex-1 flex-col min-w-0">
          {mainContent}
        </div>
        {showArtifacts && selectedArtifact && (
          <div className="hidden lg:flex w-96 border-l border-border bg-surface overflow-y-auto shrink-0">
            <ArtifactViewer artifact={selectedArtifact} />
          </div>
        )}
      </div>
    </Layout>
  )
}

function extractText(task: Task): string {
  const textPart = task.status.message?.parts.find(p => p.type === 'text')
  return textPart?.text || task.status.reason || 'Processing...'
}

function isTerminal(task: { status: { state: string } }): boolean {
  return ['completed', 'failed', 'cancelled'].includes(task.status.state)
}

export default function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </ErrorBoundary>
  )
}
