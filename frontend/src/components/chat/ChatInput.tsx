import { useState, useRef, type FormEvent, type ChangeEvent } from 'react'
import { Button } from '@/components/ui/Button'

interface ChatInputProps {
  onSend: (prompt: string, file?: File) => void
  disabled: boolean
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [prompt, setPrompt] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const trimmed = prompt.trim()
    if (!trimmed && !file) return
    onSend(trimmed, file || undefined)
    setPrompt('')
    setFile(null)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) setFile(f)
  }

  return (
    <form onSubmit={handleSubmit} className="border-t border-border bg-surface p-4">
      {file && (
        <div className="mb-3 flex items-center gap-2 rounded-lg border border-border bg-surface-elevated px-3 py-2">
          <svg className="h-4 w-4 shrink-0 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="flex-1 truncate text-sm text-text-primary">{file.name}</span>
          <span className="text-xs text-text-secondary">
            {(file.size / 1024).toFixed(1)} KB
          </span>
          <button
            type="button"
            onClick={() => { setFile(null); if (fileRef.current) fileRef.current.value = '' }}
            className="rounded p-1 text-text-secondary hover:bg-surface hover:text-text-primary transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <div className="flex items-end gap-3">
        <div className="flex-1 relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your request... (Enter to send, Shift+Enter for new line)"
            rows={1}
            disabled={disabled}
            className="w-full resize-none rounded-lg border border-border bg-bg px-4 py-2.5 text-sm text-text-primary placeholder-text-secondary outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent disabled:opacity-50"
          />
        </div>

        <input
          ref={fileRef}
          type="file"
          onChange={handleFileChange}
          className="hidden"
          accept=".csv,.json,.txt,.xlsx"
        />

        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={disabled}
          className="rounded-lg p-2.5 text-text-secondary hover:bg-surface-elevated hover:text-text-primary transition-colors disabled:opacity-50"
          title="Attach file"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
        </button>

        <Button type="submit" size="md" disabled={disabled || (!prompt.trim() && !file)}>
          {disabled ? (
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          )}
          Send
        </Button>
      </div>
    </form>
  )
}
