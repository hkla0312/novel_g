// @vitest-environment jsdom

import { beforeEach, describe, expect, it } from 'vitest'
import { getClearedEndings, hasPreviousTrueClear, recordEndingClear, recordTrueClear } from './progressStorage'

describe('clear history', () => {
  beforeEach(() => localStorage.clear())

  it('unlocks next-play content only after a recorded TRUE clear', () => {
    expect(hasPreviousTrueClear()).toBe(false)
    recordTrueClear()
    expect(hasPreviousTrueClear()).toBe(true)
    expect(getClearedEndings()).toContain('true_end')
  })

  it('records each reached ending without clearing earlier records', () => {
    recordEndingClear('bad_end')
    recordEndingClear('normal_end')
    expect(getClearedEndings()).toEqual(['bad_end', 'normal_end'])
  })

  it('imports the legacy TRUE-clear key into the ending list', () => {
    localStorage.setItem('akano-yume:clear:true', '1')
    expect(getClearedEndings()).toEqual(['true_end'])
  })
})

