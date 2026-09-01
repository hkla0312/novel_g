import { evaluateCondition } from './conditions'
import { applyEffects } from './effects'
import type { BacklogEntry, GameSnapshot } from '../types/game'
import type { Choice, ScenarioNode } from '../types/scenario'

export type ScenarioMap = Record<string, ScenarioNode>

export const getNodeText = (node: ScenarioNode, state: GameSnapshot): string[] => {
  const matching = node.variants?.find((variant) => evaluateCondition(variant.condition, state))
  return matching?.text ?? node.text
}

export const getAvailableChoices = (node: ScenarioNode, state: GameSnapshot): Choice[] =>
  (node.choices ?? []).filter((choice) => evaluateCondition(choice.condition, state))

export const getNextNodeId = (node: ScenarioNode, state: GameSnapshot): string | undefined =>
  node.routes?.find((route) => evaluateCondition(route.condition, state))?.next ?? node.next

const makeEntries = (text: string[], time: number): BacklogEntry[] => text.map((content, index) => ({
  id: `${Date.now()}-${index}-${Math.random().toString(36).slice(2)}`,
  kind: 'text',
  content,
  time,
}))

export const enterNode = (state: GameSnapshot, node: ScenarioNode): GameSnapshot => {
  const withVisit: GameSnapshot = {
    ...state,
    currentNode: node.id,
    currentTime: state.currentTime + (node.timeCost ?? 0),
    visitedNodes: state.visitedNodes.includes(node.id) ? state.visitedNodes : [...state.visitedNodes, node.id],
    visitedLocations: node.location && !state.visitedLocations.includes(node.location)
      ? [...state.visitedLocations, node.location]
      : state.visitedLocations,
  }
  const effected = applyEffects(withVisit, node.effects)
  return { ...effected, backlog: [...effected.backlog, ...makeEntries(getNodeText(node, effected), effected.currentTime)] }
}

export const choose = (state: GameSnapshot, choice: Choice, scenario: ScenarioMap): GameSnapshot => {
  const target = scenario[choice.next]
  if (!target) throw new Error(`Unknown scenario node: ${choice.next}`)
  const chosen: BacklogEntry = {
    id: `${Date.now()}-choice-${Math.random().toString(36).slice(2)}`,
    kind: 'choice', content: choice.label, time: state.currentTime,
  }
  const withChoice = applyEffects({
    ...state,
    currentTime: state.currentTime + (choice.timeCost ?? 0),
    backlog: [...state.backlog, chosen],
  }, choice.effects)
  return enterNode(withChoice, target)
}

