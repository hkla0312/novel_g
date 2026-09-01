import type { GameSnapshot } from '../types/game'

export type PlaytestEvent = {
  type: 'choice' | 'continue' | 'acquisition' | 'location' | 'milestone' | 'ending'
  realElapsedMs: number
  gameTime: number
  nodeId: string
  data: Record<string, unknown>
}
export type PlaytestAnswer = { point: string; question: string; answer: string; confidence?: number; realElapsedMs: number }
export type PlaytestSession = {
  schemaVersion: 1; sessionId: string; gameVersion: string; startedAt: string
  events: PlaytestEvent[]; answers: PlaytestAnswer[]; endingSurvey?: Record<string, string | number>
  finalSnapshot?: GameSnapshot
}


