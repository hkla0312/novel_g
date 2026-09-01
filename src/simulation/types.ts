import type { GameSnapshot } from '../types/game'

export type Ending = 'BAD' | 'NORMAL' | 'TRUE' | 'SECRET' | 'SOFTLOCK'

export type PersonaId =
  | 'ordinary' | 'horror_veteran' | 'occult_believer' | 'skeptic' | 'trust_mother'
  | 'distrust_mother' | 'suspect_neighbor' | 'suspect_brother' | 'trust_sister'
  | 'safety_first' | 'rush_neighbor' | 'internet_first' | 'local_history'
  | 'family_first' | 'efficient' | 'completionist' | 'skipper' | 'avoid_scary'
  | 'deep_reader' | 'casual'

export type HypothesisId = 'H1' | 'H2' | 'H3' | 'H4' | 'H5' | 'H6' | 'H7' | 'H8' | 'H9' | 'H10' | 'H11'

export type ThoughtLog = {
  step: number
  node: string
  currentHypothesis: HypothesisId
  confidence: number
  reason: string
  nextIntent: string
}

export type SimulationRun = {
  runId: number
  seed: number
  persona: PersonaId
  previousTrueClear: boolean
  ending: Ending
  endNode: string
  endTime: number
  choices: Array<{ node: string; label: string; time: number }>
  visitedLocations: string[]
  visitedNodes: string[]
  knowledge: string[]
  selfMemory: string[]
  archiveEntries: string[]
  knowledgeAt1600: string[]
  thoughtLog: ThoughtLog[]
  finalState: GameSnapshot
}

export type SimulationSummary = {
  generatedAt: string
  runCount: number
  firstRunCount: number
  secondRunCount: number
  endings: Record<Ending, number>
  endingPercentFirstRun: Record<Ending, number>
  averageEndTime: number
  averageKnowledgeAt1600: number
  rates: Record<string, number>
  hypothesisRates: Record<HypothesisId, number>
  softlocks: Array<{ runId: number; node: string; time: number }>
  representativeOrders: Array<{ order: string; count: number }>
  personas: Record<PersonaId, { runs: number; endings: Record<Ending, number>; averageEndTime: number }>
}

