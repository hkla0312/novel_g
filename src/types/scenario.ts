export type Condition =
  | { type: 'all'; conditions: Condition[] }
  | { type: 'any'; conditions: Condition[] }
  | { type: 'not'; condition: Condition }
  | { type: 'flag'; key: string; value?: boolean }
  | { type: 'knowledge'; key: string }
  | { type: 'selfMemory'; key: string }
  | { type: 'visitedNode'; id: string }
  | { type: 'visitedLocation'; id: string }
  | { type: 'time'; atOrBefore?: number; atOrAfter?: number }
  | { type: 'hidden'; key: string; atLeast?: number; atMost?: number }
  | { type: 'collectionCount'; collection: 'knowledge' | 'selfMemory' | 'visitedNodes' | 'visitedLocations'; atLeast?: number; atMost?: number }

export type Effect =
  | { type: 'setFlag'; key: string; value: boolean }
  | { type: 'addKnowledge'; key: string }
  | { type: 'addSelfMemory'; key: string }
  | { type: 'visitLocation'; id: string }
  | { type: 'adjustHidden'; key: 'FACT' | 'UNDERSTANDING' | 'SELF' | string; amount: number }

export type Choice = {
  label: string
  next: string
  timeCost?: number
  condition?: Condition
  effects?: Effect[]
}

export type TextVariant = {
  condition: Condition
  text: string[]
}

export type ScenarioNode = {
  id: string
  title?: string
  location?: string
  text: string[]
  variants?: TextVariant[]
  choices?: Choice[]
  timeCost?: number
  effects?: Effect[]
  condition?: Condition
  next?: string
  routes?: Array<{ condition: Condition; next: string }>
  terminal?: boolean
  audio?: {
    bgm?: 'main-investigation' | 'end-bad' | 'end-normal' | 'end-true' | 'end-secret' | null
    ambience?: 'prologue-night' | null
    fadeMs?: number
    bgmVolumeScale?: number
  }
}

