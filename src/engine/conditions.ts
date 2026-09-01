import type { GameSnapshot } from '../types/game'
import type { Condition } from '../types/scenario'

export const evaluateCondition = (condition: Condition | undefined, state: GameSnapshot): boolean => {
  if (!condition) return true
  switch (condition.type) {
    case 'all': return condition.conditions.every((item) => evaluateCondition(item, state))
    case 'any': return condition.conditions.some((item) => evaluateCondition(item, state))
    case 'not': return !evaluateCondition(condition.condition, state)
    case 'flag': return (state.flags[condition.key] ?? false) === (condition.value ?? true)
    case 'knowledge': return state.knowledge.includes(condition.key)
    case 'selfMemory': return state.selfMemory.includes(condition.key)
    case 'visitedNode': return state.visitedNodes.includes(condition.id)
    case 'visitedLocation': return state.visitedLocations.includes(condition.id)
    case 'time':
      return (condition.atOrBefore === undefined || state.currentTime <= condition.atOrBefore)
        && (condition.atOrAfter === undefined || state.currentTime >= condition.atOrAfter)
    case 'hidden': {
      const value = state.hidden[condition.key] ?? 0
      return (condition.atLeast === undefined || value >= condition.atLeast)
        && (condition.atMost === undefined || value <= condition.atMost)
    }
    case 'collectionCount': {
      const value = state[condition.collection].length
      return (condition.atLeast === undefined || value >= condition.atLeast)
        && (condition.atMost === undefined || value <= condition.atMost)
    }
  }
}

