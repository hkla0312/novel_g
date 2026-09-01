import { mkdir, writeFile } from 'node:fs/promises'
import { describe, expect, it } from 'vitest'
import { analyzeRuns, markdownSummary } from './analyze'
import { simulateMany } from './runner'

describe('generate AI playtest report', () => {
  it('runs 10,000 seeded playthroughs and writes reproducible reports', async () => {
    const runs = simulateMany(10_000, 20260901, 500)
    const summary = analyzeRuns(runs)
    const outputDir = 'reports/ai-playtest'
    await mkdir(outputDir, { recursive: true })
    await writeFile(`${outputDir}/summary.json`, `${JSON.stringify(summary, null, 2)}\n`, 'utf8')
    await writeFile(`${outputDir}/summary.md`, markdownSummary(summary), 'utf8')
    await writeFile(`${outputDir}/persona-traces.json`, `${JSON.stringify(runs.slice(0, 30).map((run) => ({
      runId: run.runId, persona: run.persona, ending: run.ending, endTime: run.endTime,
      choices: run.choices, thoughtLog: run.thoughtLog, knowledge: run.knowledge, selfMemory: run.selfMemory,
    })), null, 2)}\n`, 'utf8')
    expect(summary.runCount).toBe(10_000)
    expect(summary.softlocks).toEqual([])
    process.stdout.write(`\n${markdownSummary(summary)}\n`)
  })
})

