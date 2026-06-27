export enum TaskState {
  SUBMITTED = 'submitted',
  WORKING = 'working',
  INPUT_REQUIRED = 'input-required',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export enum PartType {
  TEXT = 'text',
  FILE = 'file',
  DATA = 'data',
}

export interface TextPart {
  type: PartType.TEXT
  text: string
}

export interface FilePart {
  type: PartType.FILE
  file_name: string
  mime_type: string
  content: string
}

export interface DataPart {
  type: PartType.DATA
  data: Record<string, unknown>
}

export type Part = TextPart | FilePart | DataPart

export interface Message {
  parts: Part[]
}

export interface TaskStatus {
  state: TaskState
  message?: Message
  reason?: string
}

export enum ArtifactType {
  DOCUMENT = 'DOCUMENT',
  VISUALIZATION = 'VISUALIZATION',
  DATA = 'DATA',
  PLAN = 'PLAN',
  OTHER = 'OTHER',
}

export interface Artifact {
  id: string
  type: ArtifactType
  name: string
  description: string
  content: unknown
}

export interface Task {
  id: string
  status: TaskStatus
  artifacts: Artifact[]
  metadata: Record<string, unknown>
}

export interface Skill {
  id: string
  name: string
  description: string
}

export interface Capabilities {
  streaming: boolean
  pushNotifications: boolean
}

export interface AgentCard {
  name: string
  description: string
  url: string
  version: string
  capabilities: Capabilities
  defaultInputModes: string[]
  defaultOutputModes: string[]
  skills: Skill[]
}

export type AgentType = 'host' | 'data' | 'planning' | 'creative'

export interface AgentInfo {
  type: AgentType
  url: string
  card?: AgentCard
  status: AgentConnectionStatus
  lastError?: string
}

export type AgentConnectionStatus = 'online' | 'offline' | 'connecting' | 'error'

export interface ChatMessage {
  id: string
  role: 'user' | 'agent' | 'system'
  content: string
  timestamp: Date
  agentType?: AgentType
  task?: Task
  isStreaming?: boolean
}

export interface ToastMessage {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  description?: string
  duration?: number
}
