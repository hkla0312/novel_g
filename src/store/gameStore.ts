import { create } from 'zustand'
import { choose, enterNode, getAvailableChoices, getNextNodeId, getNodeText } from '../engine/gameEngine'
import { scenario } from '../scenario'
import type { GameSnapshot } from '../types/game'
import type { Choice } from '../types/scenario'
import { loadGame, saveGame } from './saveStorage'
import { hasPreviousTrueClear, recordTrueClear } from './progressStorage'
import { playtestLogger } from '../playtest/playtestLogger'

const initialBase = (): GameSnapshot => ({
  currentNode: 'prologue',
  currentTime: 450,
  flags: { true_cleared_previous: hasPreviousTrueClear() }, knowledge: [], selfMemory: [], visitedNodes: [], visitedLocations: [], backlog: [],
  hidden: { FACT: 0, UNDERSTANDING: 0, SELF: 0 },
})

export const createInitialSnapshot = (): GameSnapshot => enterNode(initialBase(), scenario.prologue)

type GameStore = GameSnapshot & {
  chooseChoice: (choice: Choice) => void
  continueNode: () => void
  restart: () => void
  saveToSlot: (slot: number) => void
  loadFromSlot: (slot: number) => boolean
  jumpToNode: (id: string) => boolean
  setCurrentTime: (minutes: number) => void
  setFlag: (key: string, value: boolean) => void
  setKnowledge: (key: string, value: boolean) => void
}

const snapshotFrom = (state: GameStore): GameSnapshot => ({
  currentNode: state.currentNode, currentTime: state.currentTime, flags: state.flags,
  knowledge: state.knowledge, selfMemory: state.selfMemory, visitedNodes: state.visitedNodes,
  visitedLocations: state.visitedLocations, backlog: state.backlog, hidden: state.hidden,
})

export const useGameStore = create<GameStore>((set, get) => ({
  ...createInitialSnapshot(),
  chooseChoice: (choice) => set((state) => {
    const before = snapshotFrom(state)
    const nextState = choose(before, choice, scenario)
    playtestLogger.transition(before, nextState, choice, getAvailableChoices(scenario[before.currentNode], before))
    if (nextState.currentNode === 'true_end') recordTrueClear()
    return nextState
  }),
  continueNode: () => set((state) => {
    const node = scenario[state.currentNode]
    if (!node) return state
    const next = getNextNodeId(node, snapshotFrom(state))
    if (!next) return state
    const target = scenario[next]
    if (!target) return state
    const before = snapshotFrom(state)
    const nextState = enterNode(before, target)
    playtestLogger.transition(before, nextState)
    if (nextState.currentNode === 'true_end') recordTrueClear()
    return nextState
  }),
  restart: () => set(createInitialSnapshot()),
  saveToSlot: (slot) => { saveGame(slot, snapshotFrom(get())) },
  loadFromSlot: (slot) => {
    const data = loadGame(slot)
    if (!data || !scenario[data.snapshot.currentNode]) return false
    set({ ...data.snapshot, flags: { ...data.snapshot.flags, true_cleared_previous: data.snapshot.flags.true_cleared_previous || hasPreviousTrueClear() } })
    return true
  },
  jumpToNode: (id) => {
    const node = scenario[id]
    if (!node) return false
    set((state) => enterNode(snapshotFrom(state), node))
    return true
  },
  setCurrentTime: (minutes) => set({ currentTime: Math.max(0, Math.floor(minutes)) }),
  setFlag: (key, value) => set((state) => ({ flags: { ...state.flags, [key]: value } })),
  setKnowledge: (key, value) => set((state) => ({ knowledge: value
    ? (state.knowledge.includes(key) ? state.knowledge : [...state.knowledge, key])
    : state.knowledge.filter((item) => item !== key) })),
}))

export const selectCurrentNode = (state: GameStore) => scenario[state.currentNode]
export const selectCurrentText = (state: GameStore) => getNodeText(scenario[state.currentNode], snapshotFrom(state))
export const selectChoices = (state: GameStore) => getAvailableChoices(scenario[state.currentNode], snapshotFrom(state))

