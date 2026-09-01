// @vitest-environment jsdom

import { beforeEach, describe, expect, it } from 'vitest'
import { hasPreviousTrueClear, recordTrueClear } from './progressStorage'

describe('clear history', () => {
  beforeEach(() => localStorage.clear())

  it('unlocks next-play content only after a recorded TRUE clear', () => {
    expect(hasPreviousTrueClear()).toBe(false)
    recordTrueClear()
    expect(hasPreviousTrueClear()).toBe(true)
  })
})

