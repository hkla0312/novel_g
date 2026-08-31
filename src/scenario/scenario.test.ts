import { describe, expect, it } from 'vitest'
import { choose, enterNode, getAvailableChoices } from '../engine/gameEngine'
import { validateScenario } from '../engine/validateScenario'
import type { GameSnapshot } from '../types/game'
import { scenario, scenarioNodes } from '.'

const start = (): GameSnapshot => enterNode({
  currentNode: 'prologue', currentTime: 450, flags: {}, knowledge: [], selfMemory: [],
  visitedNodes: [], visitedLocations: [], backlog: [], hidden: { FACT: 0, UNDERSTANDING: 0, SELF: 0 },
}, scenario.prologue)

const continueTo = (state: GameSnapshot, target: string): GameSnapshot => enterNode(state, scenario[target])

const followNextUntil = (state: GameSnapshot, target: string): GameSnapshot => {
  let current = state
  for (let guard = 0; guard < 30 && current.currentNode !== target; guard += 1) {
    const next = scenario[current.currentNode].next
    if (!next) throw new Error(`No automatic path from ${current.currentNode} to ${target}`)
    current = continueTo(current, next)
  }
  return current
}

const pick = (state: GameSnapshot, label: string): GameSnapshot => {
  const node = scenario[state.currentNode]
  const choice = getAvailableChoices(node, state).find((item) => item.label === label)
  if (!choice) throw new Error(`Choice "${label}" unavailable at ${state.currentNode}`)
  return choose(state, choice, scenario)
}

describe('scenario validation', () => {
  it('has no structural errors or unreachable nodes', () => {
    const result = validateScenario(scenarioNodes)
    expect(result.errors).toEqual([])
    expect(result.warnings).toEqual([])
  })
})

describe('vertical slice routes', () => {
  it('reaches the final phone call through hospital and home', () => {
    let state = followNextUntil(start(), 'sister_questions')
    state = pick(state, '隣のおじいさんって誰？')
    state = continueTo(state, 'sister_questions')
    state = pick(state, 'もういい')
    state = pick(state, '病院へ行く')
    state = pick(state, '高齢者に話しかける')
    state = pick(state, '礼を言って病院を出る')
    state = pick(state, '自宅を調べる')
    state = pick(state, '家族写真を見る')
    expect(state.knowledge).toContain('jigaeshi_meaning')
    expect(state.backlog.some((entry) => entry.content.includes('地還しの写真'))).toBe(true)
    state = pick(state, '戻る')
    state = pick(state, '探索を切り上げる')
    state = pick(state, '団地へ戻る')
    state = continueTo(state, 'neighbor_fact')
    state = pick(state, '母さんへ電話する')
    state = continueTo(state, 'vertical_slice_end')
    expect(state.currentNode).toBe('vertical_slice_end')
    expect(state.knowledge).toContain('neighbor_dead')
  })

  it('allows a different order through police and home', () => {
    let state = followNextUntil(start(), 'sister_questions')
    state = pick(state, 'もういい')
    state = pick(state, '警察へ行く')
    state = pick(state, '警察署を出る')
    state = continueTo(state, 'free_action_hub')
    expect(state.flags.police_done).toBe(true)
    state = pick(state, '自宅を調べる')
    state = pick(state, '探索を切り上げる')
    const labels = getAvailableChoices(scenario.free_action_hub, state).map((choice) => choice.label)
    expect(labels).toContain('団地へ戻る')
    state = pick(state, '団地へ戻る')
    state = continueTo(state, 'neighbor_fact')
    state = pick(state, '母さんへ電話する')
    expect(state.currentNode).toBe('final_call')
  })
})

