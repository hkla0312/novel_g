import type { Condition, ScenarioNode } from '../types/scenario'

export type ValidationResult = { errors: string[]; warnings: string[] }

const validateCondition = (condition: Condition, path: string, errors: string[]): void => {
  if (condition.type === 'all' || condition.type === 'any') {
    if (condition.conditions.length === 0) errors.push(`${path}: ${condition.type} condition is empty`)
    condition.conditions.forEach((child, index) => validateCondition(child, `${path}.${index}`, errors))
  } else if (condition.type === 'not') validateCondition(condition.condition, `${path}.not`, errors)
  else if ('key' in condition && !condition.key.trim()) errors.push(`${path}: condition key is empty`)
  else if ((condition.type === 'visitedNode' || condition.type === 'visitedLocation') && !condition.id.trim()) errors.push(`${path}: condition id is empty`)
  else if (condition.type === 'time' && condition.atOrBefore === undefined && condition.atOrAfter === undefined) errors.push(`${path}: time condition has no bound`)
  else if (condition.type === 'hidden' && !condition.key.trim()) errors.push(`${path}: hidden condition key is empty`)
  else if ((condition.type === 'hidden' || condition.type === 'collectionCount') && condition.atLeast === undefined && condition.atMost === undefined) errors.push(`${path}: numeric condition has no bound`)
}

export const validateScenario = (nodes: ScenarioNode[], startId = 'prologue'): ValidationResult => {
  const errors: string[] = []
  const warnings: string[] = []
  const ids = new Set<string>()
  for (const node of nodes) {
    if (ids.has(node.id)) errors.push(`Duplicate node id: ${node.id}`)
    ids.add(node.id)
    if (node.timeCost !== undefined && (!Number.isFinite(node.timeCost) || node.timeCost < 0)) errors.push(`${node.id}: invalid timeCost`)
    if (node.condition) validateCondition(node.condition, `${node.id}.condition`, errors)
    node.variants?.forEach((variant, index) => validateCondition(variant.condition, `${node.id}.variants.${index}`, errors))
    node.choices?.forEach((choice, index) => {
      if (choice.timeCost !== undefined && (!Number.isFinite(choice.timeCost) || choice.timeCost < 0)) errors.push(`${node.id}.choices.${index}: invalid timeCost`)
      if (choice.condition) validateCondition(choice.condition, `${node.id}.choices.${index}.condition`, errors)
    })
  }
  for (const node of nodes) {
    if (node.next && !ids.has(node.next)) errors.push(`${node.id}: unknown next ${node.next}`)
    node.choices?.forEach((choice) => { if (!ids.has(choice.next)) errors.push(`${node.id}: unknown choice.next ${choice.next}`) })
  }
  const reached = new Set<string>()
  const walk = (id: string): void => {
    if (reached.has(id) || !ids.has(id)) return
    reached.add(id)
    const node = nodes.find((item) => item.id === id)
    if (!node) return
    if (node.next) walk(node.next)
    node.choices?.forEach((choice) => walk(choice.next))
  }
  walk(startId)
  nodes.forEach((node) => { if (!reached.has(node.id)) warnings.push(`Unreachable node: ${node.id}`) })
  return { errors, warnings }
}

