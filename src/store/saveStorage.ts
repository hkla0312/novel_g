import type { GameSnapshot, SaveData } from '../types/game'

export const SAVE_DATA_VERSION = 1
export const SAVE_SLOTS = [1, 2, 3] as const

const keyFor = (slot: number) => `akano-yume:save:${slot}`

export const saveGame = (slot: number, snapshot: GameSnapshot): SaveData => {
  const data: SaveData = { saveDataVersion: SAVE_DATA_VERSION, savedAt: new Date().toISOString(), snapshot }
  localStorage.setItem(keyFor(slot), JSON.stringify(data))
  return data
}

const migrate = (raw: unknown): SaveData | null => {
  if (!raw || typeof raw !== 'object') return null
  const candidate = raw as Partial<SaveData>
  if (candidate.saveDataVersion === SAVE_DATA_VERSION && candidate.snapshot && candidate.savedAt) return candidate as SaveData
  // Future versions can be upgraded one version at a time here.
  return null
}

export const loadGame = (slot: number): SaveData | null => {
  const raw = localStorage.getItem(keyFor(slot))
  if (!raw) return null
  try { return migrate(JSON.parse(raw) as unknown) } catch { return null }
}

export const getSaveSummaries = (): Array<{ slot: number; data: SaveData | null }> =>
  SAVE_SLOTS.map((slot) => ({ slot, data: loadGame(slot) }))

