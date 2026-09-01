import { getArchiveEntries } from '../archive/archiveEngine'
import { choose, enterNode, getAvailableChoices, getNextNodeId } from '../engine/gameEngine'
import { scenario } from '../scenario'
import type { GameSnapshot } from '../types/game'
import { choiceWeight, inferHypothesis, personas } from './personas'
import type { Ending, PersonaId, SimulationRun, ThoughtLog } from './types'

const terminalEnding = (id: string): Ending => id === 'bad_end' ? 'BAD' : id === 'normal_end' ? 'NORMAL' : id === 'secret_end' ? 'SECRET' : id.startsWith('true_end') ? 'TRUE' : 'SOFTLOCK'

const random = (seed: number): (() => number) => {
  let value = seed >>> 0
  return () => {
    value += 0x6D2B79F5
    let next = value
    next = Math.imul(next ^ (next >>> 15), next | 1)
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61)
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296
  }
}

const initial = (previousTrueClear: boolean): GameSnapshot => enterNode({
  currentNode: 'prologue', currentTime: 450, flags: { true_cleared_previous: previousTrueClear },
  knowledge: [], selfMemory: [], visitedNodes: [], visitedLocations: [], backlog: [],
  hidden: { FACT: 0, UNDERSTANDING: 0, SELF: 0 },
}, scenario.prologue)

const weightedPick = <T>(items: T[], weights: number[], rng: () => number): T => {
  const total = weights.reduce((sum, value) => sum + value, 0)
  let point = rng() * total
  for (let index = 0; index < items.length; index += 1) {
    point -= weights[index] ?? 0
    if (point <= 0) return items[index]!
  }
  return items.at(-1)!
}

const majorNodes = new Set(['sister_questions', 'danchi_return', 'neighbor_home_hub', 'neighbor_old_paper', 'library_hub', 'author_reveal', 'brother_call', 'mother_returns_evening', 'mother_go_together'])

export const simulateRun = (runId: number, persona: PersonaId, seed: number, previousTrueClear = false): SimulationRun => {
  const rng = random(seed)
  let state = initial(previousTrueClear)
  const choices: SimulationRun['choices'] = []
  const thoughtLog: ThoughtLog[] = []
  const choiceVisits = new Map<string, number>()
  let knowledgeAt1600: string[] = []

  for (let step = 0; step < 600; step += 1) {
    const node = scenario[state.currentNode]
    if (!node) break
    if (state.currentTime >= 960 && knowledgeAt1600.length === 0) knowledgeAt1600 = [...state.knowledge]
    if (node.terminal || state.currentNode === 'true_end_close') break
    const available = getAvailableChoices(node, state)
    if (available.length > 0) {
      if (majorNodes.has(node.id)) thoughtLog.push({ step, node: node.id, ...inferHypothesis(state) })
      const weights = available.map((choice) => choiceWeight(persona, choice, state, choiceVisits.get(`${node.id}:${choice.label}`) ?? 0))
      const picked = weightedPick(available, weights, rng)
      const key = `${node.id}:${picked.label}`
      choiceVisits.set(key, (choiceVisits.get(key) ?? 0) + 1)
      choices.push({ node: node.id, label: picked.label, time: state.currentTime })
      state = choose(state, picked, scenario)
      continue
    }
    const next = getNextNodeId(node, state)
    if (!next || !scenario[next]) break
    state = enterNode(state, scenario[next])
  }
  if (knowledgeAt1600.length === 0) knowledgeAt1600 = [...state.knowledge]
  return {
    runId, seed, persona, previousTrueClear, ending: terminalEnding(state.currentNode), endNode: state.currentNode,
    endTime: state.currentTime, choices, visitedLocations: state.visitedLocations, visitedNodes: state.visitedNodes,
    knowledge: state.knowledge, selfMemory: state.selfMemory,
    archiveEntries: getArchiveEntries(state).map((entry) => entry.id), knowledgeAt1600, thoughtLog, finalState: state,
  }
}

export const simulateMany = (count: number, baseSeed = 20260901, includeSecondRuns = 500): SimulationRun[] => {
  const runs: SimulationRun[] = []
  for (let index = 0; index < count; index += 1) {
    const persona = personas[index % personas.length]!
    runs.push(simulateRun(index + 1, persona, baseSeed + index * 7919, index >= count - includeSecondRuns))
  }
  return runs
}

