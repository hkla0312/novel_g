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
})

