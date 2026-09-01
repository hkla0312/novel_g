// @vitest-environment jsdom

import { beforeEach, describe, expect, it } from 'vitest'
import type { SaveData } from '../types/game'
import { loadGame, SAVE_DATA_VERSION } from './saveStorage'

describe('save migration', () => {
  beforeEach(() => localStorage.clear())

  it('moves a version 1 ending save to the ACT2 opening', () => {
    const oldSave: SaveData = {
      saveDataVersion: 1,
      savedAt: '2026-01-01T00:00:00.000Z',
      snapshot: {
        currentNode: 'vertical_slice_end', currentTime: 600, flags: {}, knowledge: [], selfMemory: [],
        visitedNodes: [], visitedLocations: [], backlog: [], hidden: { FACT: 0, UNDERSTANDING: 0, SELF: 0 },
      },
    }
    localStorage.setItem('akano-yume:save:1', JSON.stringify(oldSave))
    const migrated = loadGame(1)
    expect(migrated?.saveDataVersion).toBe(SAVE_DATA_VERSION)
    expect(migrated?.snapshot.currentNode).toBe('act2_opening')
  })

  it('moves a version 2 ending save to ACT3', () => {
    const oldSave: SaveData = {
      saveDataVersion: 2,
      savedAt: '2026-01-02T00:00:00.000Z',
      snapshot: {
        currentNode: 'vertical_slice_end', currentTime: 960, flags: {}, knowledge: [], selfMemory: [],
        visitedNodes: [], visitedLocations: [], backlog: [], hidden: { FACT: 3, UNDERSTANDING: 1, SELF: 2 },
      },
    }
    localStorage.setItem('akano-yume:save:1', JSON.stringify(oldSave))
    expect(loadGame(1)?.snapshot.currentNode).toBe('act3_opening')
  })
})

