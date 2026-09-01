import { describe, expect, it } from 'vitest'
import { getArchiveEntries } from '../archive/archiveEngine'
import { scenarioNodes } from '../scenario'
import { validateScenario } from '../engine/validateScenario'
import { simulateMany, simulateRun } from './runner'

describe('AI simulation environment', () => {
  it('is deterministic for a seed and never reaches SECRET on a first run', () => {
    const first = simulateRun(1, 'ordinary', 42, false)
    const replay = simulateRun(1, 'ordinary', 42, false)
    expect(first.choices).toEqual(replay.choices)
    expect(first.ending).not.toBe('SECRET')
  })

  it('keeps ARCHIVE derived from acquired state', () => {
    const run = simulateRun(1, 'completionist', 1234, false)
    expect(run.archiveEntries).toEqual(getArchiveEntries(run.finalState).map((entry) => entry.id))
  })

  it('has no structural errors, softlock in a sample, or first-run SECRET leak', () => {
    expect(validateScenario(scenarioNodes)).toEqual({ errors: [], warnings: [] })
    const runs = simulateMany(400, 9001, 40)
    expect(runs.filter((run) => run.ending === 'SOFTLOCK')).toEqual([])
    expect(runs.filter((run) => !run.previousTrueClear && run.ending === 'SECRET')).toEqual([])
  })
})

