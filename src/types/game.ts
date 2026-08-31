export type BacklogEntry = {
  id: string
  kind: 'text' | 'choice'
  content: string
  time: number
}

export type GameSnapshot = {
  currentNode: string
  currentTime: number
  flags: Record<string, boolean>
  knowledge: string[]
  selfMemory: string[]
  visitedNodes: string[]
  visitedLocations: string[]
  backlog: BacklogEntry[]
  hidden: Record<string, number>
}

export type SaveData = {
  saveDataVersion: number
  savedAt: string
  snapshot: GameSnapshot
}

