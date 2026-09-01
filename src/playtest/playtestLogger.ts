import type { Choice } from '../types/scenario'
import type { GameSnapshot } from '../types/game'
import type { PlaytestAnswer, PlaytestEvent, PlaytestSession } from './types'
import { scenario } from '../scenario'
import { getArchiveEntries } from '../archive/archiveEngine'

const KEY = 'akano-yume:human-playtest'
const version = 'v10-playtest-1'
const milestones: Record<string, (state: GameSnapshot) => boolean> = {
  minaUnlocked: (s) => s.flags.mina_unlocked === true, minaContacted: (s) => s.flags.mina_contacted === true,
  neighborDeathKnown: (s) => s.visitedNodes.includes('danchi_death_reveal'), neighborDeathConfirmed: (s) => s.flags.neighbor_death_official === true,
  neighborHome: (s) => s.visitedLocations.includes('neighbor_apartment'), butsuma: (s) => s.knowledge.includes('butsuma_faith_accumulation'),
  a4: (s) => s.knowledge.includes('akano_yume_document'), neighborInjury: (s) => s.knowledge.includes('neighbor_relative_injury_confirmed') || s.knowledge.includes('neighbor_injury_rumor'),
  wifeLoss: (s) => s.knowledge.includes('neighbor_long_widowhood'), jigaeshi: (s) => s.knowledge.includes('library_jigaeshi_confirmed'),
  oldPc: (s) => s.flags.author_revealed === true, brotherInitial: (s) => s.knowledge.includes('brother_red_dream'),
  brotherRevisit: (s) => s.flags.brother_understood === true, motherAccompanied: (s) => s.flags.mother_accompanied === true,
  motherEmpathy: (s) => s.flags.mother_empathy_spoken === true,
}

export const isPlaytestMode = (): boolean => typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('playtest') === '1'

class PlaytestLogger {
  private session: PlaytestSession | null = null
  private started = Date.now()
  constructor() {
    if (!isPlaytestMode()) return
    try { this.session = JSON.parse(localStorage.getItem(KEY) ?? 'null') as PlaytestSession | null } catch { this.session = null }
    if (!this.session) this.session = { schemaVersion: 1, sessionId: crypto.randomUUID(), gameVersion: version, startedAt: new Date().toISOString(), events: [], answers: [] }
    this.started = Date.parse(this.session.startedAt) || Date.now(); this.persist()
  }
  private persist(): void { if (this.session) localStorage.setItem(KEY, JSON.stringify(this.session)) }
  private add(type: PlaytestEvent['type'], nodeId: string, gameTime: number, data: Record<string, unknown>): void {
    this.session?.events.push({ type, nodeId, gameTime, data, realElapsedMs: Date.now() - this.started }); this.persist()
  }
  transition(before: GameSnapshot, after: GameSnapshot, choice?: Choice, shown: Choice[] = []): void {
    if (!this.session) return
    this.add(choice ? 'choice' : 'continue', before.currentNode, before.currentTime, choice ? { shownChoices: shown.map((c) => c.label), selectedChoice: choice.label, next: choice.next } : { next: after.currentNode })
    for (const [kind, oldValues, values] of [['knowledge', before.knowledge, after.knowledge], ['selfMemory', before.selfMemory, after.selfMemory]] as const)
      for (const value of values.filter((item) => !oldValues.includes(item))) this.add('acquisition', after.currentNode, after.currentTime, { kind, value, sourceNode: after.currentNode })
    for (const [key, value] of Object.entries(after.flags)) if (value && before.flags[key] !== true) this.add('acquisition', after.currentNode, after.currentTime, { kind: 'flag', value: key, sourceNode: after.currentNode })
    const oldArchive = getArchiveEntries(before).map((entry) => entry.id)
    for (const entry of getArchiveEntries(after).filter((item) => !oldArchive.includes(item.id))) this.add('acquisition', after.currentNode, after.currentTime, { kind: 'archive', value: entry.id, sourceNode: after.currentNode })
    const beforeLocation = scenario[before.currentNode]?.location
    const afterLocation = scenario[after.currentNode]?.location
    if (afterLocation && beforeLocation !== afterLocation) {
      const visitCount = this.session.events.filter((event) => event.type === 'location' && event.data.location === afterLocation).length + 1
      this.add('location', after.currentNode, after.currentTime, { location: afterLocation, visitCount })
    }
    for (const [name, test] of Object.entries(milestones)) if (!test(before) && test(after)) this.add('milestone', after.currentNode, after.currentTime, { name })
    if (['bad_end', 'normal_end', 'true_end', 'secret_end'].includes(after.currentNode)) { this.add('ending', after.currentNode, after.currentTime, { ending: after.currentNode }); this.session.finalSnapshot = after; this.persist() }
  }
  answer(answer: Omit<PlaytestAnswer, 'realElapsedMs'>): void { this.session?.answers.push({ ...answer, realElapsedMs: Date.now() - this.started }); this.persist() }
  hasAnswer(point: string): boolean { return this.session?.answers.some((answer) => answer.point === point) ?? false }
  survey(values: Record<string, string | number>, snapshot: GameSnapshot): void { if (!this.session) return; this.session.endingSurvey = values; this.session.finalSnapshot = snapshot; this.persist() }
  export(): void {
    if (!this.session) return
    const blob = new Blob([JSON.stringify(this.session, null, 2)], { type: 'application/json' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `${this.session.sessionId}.json`
    document.body.append(a); a.click(); a.remove(); window.setTimeout(() => URL.revokeObjectURL(a.href), 1000)
  }
  reset(): void { localStorage.removeItem(KEY); this.session = null }
}
export const playtestLogger = new PlaytestLogger()

