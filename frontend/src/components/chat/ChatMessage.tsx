import { formatDate, cn } from '@/lib/utils'
import type { ChatMessage } from '@/types/a2a'
import { Spinner } from '@/components/ui/Spinner'

interface ChatMessageProps {
  message: ChatMessage
}

const agentColors: Record<string, string> = {
  host: 'border-accent/30 bg-accent/5',
  data: 'border-accent-secondary/30 bg-accent-secondary/5',
  planning: 'border-warning/30 bg-warning/5',
  creative: 'border-success/30 bg-success/5',
  user: 'border-border bg-surface-elevated',
  system: 'border-border bg-surface',
}

export function ChatMessageBubble({ message }: ChatMessageProps) {
  const isUser = message.role === 'user'
  const isSystem = message.role === 'system'

  return (
    <div className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[80%] rounded-xl border p-4',
          agentColors[message.agentType || message.role],
          isUser && 'rounded-br-sm',
          !isUser && 'rounded-bl-sm'
        )}
      >
        {!isUser && !isSystem && message.agentType && (
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-text-secondary">
            {message.agentType} agent
          </p>
        )}

        <div className="text-sm text-text-primary whitespace-pre-wrap">
          {message.content}
          {message.isStreaming && (
            <span className="ml-1 inline-flex">
              <span className="animate-pulse">▊</span>
            </span>
          )}
        </div>

        <p className="mt-2 text-xs text-text-secondary">
          {formatDate(message.timestamp)}
        </p>
      </div>
    </div>
  )
}

interface MessageListProps {
  messages: ChatMessage[]
  isSubmitting: boolean
}

export function MessageList({ messages, isSubmitting }: MessageListProps) {
  if (messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-surface">
            <svg className="h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-text-primary">A2A Multi-Agent System</h3>
          <p className="mt-2 max-w-md text-sm text-text-secondary">
            Send a message to the Host Agent to automatically route your request, or select a specific agent from the sidebar.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 overflow-y-auto p-6">
      {messages.map(msg => (
        <ChatMessageBubble key={msg.id} message={msg} />
      ))}
      {isSubmitting && (
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <Spinner size="sm" />
          Processing...
        </div>
      )}
    </div>
  )
}
