import type { Ending, HypothesisId, SimulationRun, SimulationSummary } from './types'
import { personas } from './personas'

const endings = (): Record<Ending, number> => ({ BAD: 0, NORMAL: 0, TRUE: 0, SECRET: 0, SOFTLOCK: 0 })
const percent = (value: number, total: number): number => total === 0 ? 0 : Math.round(value / total * 1000) / 10

const orderKey = (run: SimulationRun): string => {
  const signals: Array<[string, string]> = [
    ['hospital', '病院'], ['police', '警察'], ['neighbor_apartment', '老人宅'], ['library', '図書館'], ['old_room', 'PC'],
  ]
  return signals
    .map(([location, label]) => ({ label, index: run.visitedLocations.indexOf(location) }))
    .filter((item) => item.index >= 0).sort((a, b) => a.index - b.index).map((item) => item.label).join('→') || '主要地点なし'
}

export const analyzeRuns = (runs: SimulationRun[]): SimulationSummary => {
  const endingCounts = endings()
  runs.forEach((run) => { endingCounts[run.ending] += 1 })
  const first = runs.filter((run) => !run.previousTrueClear)
  const second = runs.filter((run) => run.previousTrueClear)
  const firstEndings = endings()
  first.forEach((run) => { firstEndings[run.ending] += 1 })
  const endingPercentFirstRun = Object.fromEntries(Object.entries(firstEndings).map(([key, value]) => [key, percent(value, first.length)])) as Record<Ending, number>
  const rate = (predicate: (run: SimulationRun) => boolean): number => percent(runs.filter(predicate).length, runs.length)
  const hypothesisPredicates: Record<HypothesisId, (run: SimulationRun) => boolean> = {
    H1: (run) => run.visitedNodes.includes('mother_confront'),
    H2: (run) => run.knowledge.includes('neighbor_injury_rumor') || run.knowledge.includes('neighbor_relative_injury_confirmed'),
    H3: (run) => run.knowledge.includes('butsuma_faith_accumulation'),
    H4: (run) => run.knowledge.includes('akano_yume_document') && run.knowledge.includes('brother_red_dream'),
    H5: (run) => run.knowledge.includes('neighbor_injury_faith_possible_link'),
    H6: (run) => run.knowledge.includes('jigaeshi_not_akano_yume'),
    H7: (run) => run.selfMemory.includes('escape_into_local_history'),
    H8: (run) => run.knowledge.includes('source_site_not_akano_yume'),
    H9: (run) => run.knowledge.includes('neighbor_early_recipient_after_wife_loss'),
    H10: (run) => run.knowledge.includes('source_site_not_akano_yume') && run.knowledge.includes('brother_red_dream'),
    H11: (run) => run.knowledge.includes('mother_faith_internalization_path') && run.knowledge.includes('mother_helping_intent'),
  }
  const hypotheses = Object.fromEntries((Object.keys(hypothesisPredicates) as HypothesisId[]).map((key) => [key, rate(hypothesisPredicates[key])])) as Record<HypothesisId, number>
  const orderCounts = new Map<string, number>()
  runs.forEach((run) => orderCounts.set(orderKey(run), (orderCounts.get(orderKey(run)) ?? 0) + 1))
  const personaSummary = {} as SimulationSummary['personas']
  for (const persona of personas) {
    const selected = runs.filter((run) => run.persona === persona)
    const selectedEndings = endings()
    selected.forEach((run) => { selectedEndings[run.ending] += 1 })
    personaSummary[persona] = { runs: selected.length, endings: selectedEndings, averageEndTime: Math.round(selected.reduce((sum, run) => sum + run.endTime, 0) / Math.max(selected.length, 1)) }
  }
  return {
    generatedAt: new Date().toISOString(), runCount: runs.length, firstRunCount: first.length, secondRunCount: second.length,
    endings: endingCounts, endingPercentFirstRun,
    averageEndTime: Math.round(runs.reduce((sum, run) => sum + run.endTime, 0) / runs.length),
    averageKnowledgeAt1600: Math.round(runs.reduce((sum, run) => sum + run.knowledgeAt1600.length, 0) / runs.length * 10) / 10,
    rates: {
      mina: rate((run) => run.finalState.flags.mina_contacted === true), neighborHome: rate((run) => run.visitedLocations.includes('neighbor_apartment')),
      butsuma: rate((run) => run.knowledge.includes('butsuma_faith_accumulation')), jigaeshi: rate((run) => run.knowledge.includes('library_jigaeshi_confirmed')),
      neighborInjury: rate((run) => run.knowledge.includes('neighbor_injury_rumor') || run.knowledge.includes('neighbor_relative_injury_confirmed')),
      brotherInitial: rate((run) => run.knowledge.includes('brother_red_dream')), hospital: rate((run) => run.visitedLocations.includes('hospital')),
      police: rate((run) => run.visitedLocations.includes('police')), library: rate((run) => run.visitedLocations.includes('library')),
      pc: rate((run) => run.finalState.flags.author_revealed === true), secretFirstRun: percent(first.filter((run) => run.ending === 'SECRET').length, first.length),
      secretSecondRun: percent(second.filter((run) => run.ending === 'SECRET').length, second.length),
      oldRoomPaperMemory: rate((run) => run.finalState.flags.old_room_paper_memory_done === true),
      minaUnlocked: rate((run) => run.finalState.flags.mina_unlocked === true),
      hospitalRepeated: rate((run) => run.choices.filter((choice) => choice.label === '病院へ行く').length > 1),
      policeRepeated: rate((run) => run.choices.filter((choice) => choice.label === '警察へ行く').length > 1),
    },
    hypothesisRates: hypotheses,
    softlocks: runs.filter((run) => run.ending === 'SOFTLOCK').map((run) => ({ runId: run.runId, node: run.endNode, time: run.endTime })),
    representativeOrders: [...orderCounts].sort((a, b) => b[1] - a[1]).slice(0, 10).map(([order, count]) => ({ order, count })),
    personas: personaSummary,
  }
}

export const markdownSummary = (summary: SimulationSummary): string => `# アカノユメ AI simulation report\n\nGenerated: ${summary.generatedAt}\n\n## 機械集計\n\n- runs: ${summary.runCount}（初回 ${summary.firstRunCount} / TRUE済み ${summary.secondRunCount}）\n- END: ${Object.entries(summary.endings).map(([key, value]) => `${key} ${value}`).join(' / ')}\n- 初回比率: ${Object.entries(summary.endingPercentFirstRun).map(([key, value]) => `${key} ${value}%`).join(' / ')}\n- 平均終了時刻（経過分）: ${summary.averageEndTime}\n- 16:00時点平均knowledge: ${summary.averageKnowledgeAt1600}\n- softlock: ${summary.softlocks.length}\n\n## 到達率\n\n${Object.entries(summary.rates).map(([key, value]) => `- ${key}: ${value}%`).join('\n')}\n\n## 仮説発生率\n\n${Object.entries(summary.hypothesisRates).map(([key, value]) => `- ${key}: ${value}%`).join('\n')}\n\n## 代表探索順\n\n${summary.representativeOrders.map((item) => `- ${item.order}: ${item.count}`).join('\n')}\n`

