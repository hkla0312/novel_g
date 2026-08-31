import type { GameSnapshot } from '../types/game'
import type { Effect } from '../types/scenario'

const addUnique = (values: string[], value: string) => values.includes(value) ? values : [...values, value]

export const applyEffects = (state: GameSnapshot, effects: Effect[] = []): GameSnapshot =>
  effects.reduce<GameSnapshot>((next, effect) => {
    switch (effect.type) {
      case 'setFlag': return { ...next, flags: { ...next.flags, [effect.key]: effect.value } }
      case 'addKnowledge': return { ...next, knowledge: addUnique(next.knowledge, effect.key) }
      case 'addSelfMemory': return { ...next, selfMemory: addUnique(next.selfMemory, effect.key) }
      case 'visitLocation': return { ...next, visitedLocations: addUnique(next.visitedLocations, effect.id) }
      case 'adjustHidden': return { ...next, hidden: { ...next.hidden, [effect.key]: (next.hidden[effect.key] ?? 0) + effect.amount } }
    }
  }, state)

