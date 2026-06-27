import { Card } from '@/components/ui/Card'
import type { Artifact, ArtifactType } from '@/types/a2a'
import { cn } from '@/lib/utils'

interface ArtifactListProps {
  artifacts: Artifact[]
  onSelect: (artifact: Artifact) => void
}

const artifactIcons: Record<ArtifactType, string> = {
  DOCUMENT: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  VISUALIZATION: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  DATA: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4',
  PLAN: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',
  OTHER: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
}

const artifactColors: Record<ArtifactType, string> = {
  DOCUMENT: 'text-accent bg-accent/10',
  VISUALIZATION: 'text-accent-secondary bg-accent-secondary/10',
  DATA: 'text-success bg-success/10',
  PLAN: 'text-warning bg-warning/10',
  OTHER: 'text-text-secondary bg-surface-elevated',
}

export function ArtifactList({ artifacts, onSelect }: ArtifactListProps) {
  if (artifacts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <p className="text-sm text-text-secondary">No artifacts yet</p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-border">
      {artifacts.map(artifact => (
        <button
          key={artifact.id}
          onClick={() => onSelect(artifact)}
          className="flex w-full items-center gap-4 px-4 py-3 text-left transition-colors hover:bg-surface-elevated"
        >
          <div className={cn(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
            artifactColors[artifact.type]
          )}>
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={artifactIcons[artifact.type]} />
            </svg>
          </div>

          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium text-text-primary">
              {artifact.name}
            </p>
            {artifact.description && (
              <p className="truncate text-xs text-text-secondary">
                {artifact.description}
              </p>
            )}
          </div>

          <span className="shrink-0 text-xs text-text-secondary">{artifact.type}</span>

          <svg className="h-4 w-4 shrink-0 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      ))}
    </div>
  )
}

interface ArtifactViewerProps {
  artifact: Artifact | null
}

export function ArtifactViewer({ artifact }: ArtifactViewerProps) {
  if (!artifact) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-sm text-text-secondary">Select an artifact to view</p>
      </div>
    )
  }

  return (
    <div>
      <div className="border-b border-border px-4 py-3">
        <h3 className="text-sm font-medium text-text-primary">{artifact.name}</h3>
        <p className="text-xs text-text-secondary">{artifact.description}</p>
      </div>

      <div className="p-4">
        {artifact.type === 'DOCUMENT' ? (
          <div className="prose prose-invert max-w-none">
            <pre className="whitespace-pre-wrap text-sm text-text-primary font-body">
              {typeof artifact.content === 'string' ? artifact.content : JSON.stringify(artifact.content, null, 2)}
            </pre>
          </div>
        ) : artifact.type === 'DATA' ? (
          <Card>
            <pre className="overflow-x-auto text-xs font-mono text-text-secondary">
              {JSON.stringify(artifact.content, null, 2)}
            </pre>
          </Card>
        ) : (
          <Card>
            <pre className="overflow-x-auto text-xs font-mono text-text-secondary">
              {JSON.stringify(artifact.content, null, 2)}
            </pre>
          </Card>
        )}
      </div>
    </div>
  )
}
