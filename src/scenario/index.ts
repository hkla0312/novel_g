import { freeActionNodes } from './freeActions'
import { prologueNodes } from './prologue'
import { act2Nodes } from './act2'
import type { ScenarioNode } from '../types/scenario'

export const scenarioNodes: ScenarioNode[] = [...prologueNodes, ...freeActionNodes, ...act2Nodes]
export const scenario = Object.fromEntries(scenarioNodes.map((node) => [node.id, node]))

