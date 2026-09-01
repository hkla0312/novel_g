import { describe, expect, it } from 'vitest'
import { scenario } from '../scenario'

describe('scenario audio assignment', () => {
  it('assigns ambience, silence and one distinct track to each ending', () => {
    expect(scenario.prologue.audio?.ambience).toBe('prologue-night')
    expect(scenario.wake_injury.audio?.bgm).toBe('main-investigation')
    expect(scenario.neighbor_red_objects.audio?.bgm).toBeNull()
    expect(scenario.neighbor_old_paper.audio?.bgm).toBe('main-investigation')
    expect(scenario.bad_end.audio?.bgm).toBe('end-bad')
    expect(scenario.normal_end.audio?.bgm).toBe('end-normal')
    expect(scenario.true_end.audio?.bgm).toBe('end-true')
    expect(scenario.secret_end.audio?.bgm).toBe('end-secret')
  })
})

