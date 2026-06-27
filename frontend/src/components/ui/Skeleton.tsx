import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-lg bg-surface-elevated',
        className
      )}
    />
  )
}

export function ChatSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {[1, 2].map(i => (
        <div key={i} className={cn('flex', i === 1 ? 'justify-start' : 'justify-end')}>
          <div className={cn(
            'space-y-3',
            i === 1 ? 'pr-20' : 'pl-20'
          )}>
            <Skeleton className="h-4 w-24" />
            <Skeleton className={cn('h-20', i === 1 ? 'w-96' : 'w-80')} />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function SidebarSkeleton() {
  return (
    <div className="flex w-64 flex-col border-r border-border bg-surface p-3">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="flex items-center gap-3 px-3 py-2.5">
          <Skeleton className="h-2.5 w-2.5 rounded-full" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
      ))}
    </div>
  )
}
