import { useState, useCallback, useRef } from 'react'
import { TaskState, type Task } from '@/types/a2a'
import { createTask } from '@/services/api'
import { getCircuitBreaker } from '@/services/circuit-breaker'
import { subscribeToTask } from '@/services/websocket'
import { useToast } from '@/components/ui/Toast'

interface TaskSubmissionResult {
  submit: (url: string, prompt: string) => Promise<void>
  cancel: () => void
  task: Task | null
  isSubmitting: boolean
  progress: string
}

const terminalStates: TaskState[] = [TaskState.COMPLETED, TaskState.FAILED, TaskState.CANCELLED]

export function useTaskSubmission(): TaskSubmissionResult {
  const [task, setTask] = useState<Task | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [progress, setProgress] = useState('')
  const cleanupRef = useRef<(() => void) | null>(null)
  const { addToast } = useToast()

  const submit = useCallback(async (url: string, prompt: string) => {
    setIsSubmitting(true)
    setTask(null)
    setProgress('Creating task...')

    try {
      const circuit = getCircuitBreaker('task-submission')
      const created = await circuit.execute(() => createTask(url, prompt))

      setTask(created)
      setProgress('Processing...')

      cleanupRef.current = subscribeToTask(
        url,
        created.id,
        (updated) => {
          setTask(updated)
          setProgress(updated.status.reason || updated.status.state)
          if (terminalStates.includes(updated.status.state)) {
            setIsSubmitting(false)
          }
        },
        (error) => {
          addToast({
            type: 'error',
            title: 'Subscription error',
            description: error.message,
          })
          setIsSubmitting(false)
        },
        () => {
          setIsSubmitting(false)
        }
      )
    } catch (error) {
      setProgress('Failed')
      setIsSubmitting(false)

      const message = error instanceof Error ? error.message : 'Unknown error'
      addToast({
        type: 'error',
        title: 'Task submission failed',
        description: message,
      })
    }
  }, [addToast])

  const cancel = useCallback(() => {
    if (cleanupRef.current) {
      cleanupRef.current()
      cleanupRef.current = null
    }
    setIsSubmitting(false)
    setProgress('Cancelled')
  }, [])

  return { submit, cancel, task, isSubmitting, progress }
}
