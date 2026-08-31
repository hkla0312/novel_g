import { freeActionNodes } from './freeActions'
import { prologueNodes } from './prologue'
import type { ScenarioNode } from '../types/scenario'

export const scenarioNodes: ScenarioNode[] = [...prologueNodes, ...freeActionNodes]
export const scenario = Object.fromEntries(scenarioNodes.map((node) => [node.id, node]))

