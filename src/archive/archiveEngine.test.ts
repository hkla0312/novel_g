// @vitest-environment jsdom

import { beforeEach, describe, expect, it } from 'vitest'
import type { GameSnapshot, SaveData } from '../types/game'
import { loadGame } from '../store/saveStorage'
import { getArchiveEntries } from './archiveEngine'

const snapshot = (overrides: Partial<GameSnapshot> = {}): GameSnapshot => ({
  currentNode: 'prologue', currentTime: 450, flags: {}, knowledge: [], selfMemory: [],
  visitedNodes: ['prologue'], visitedLocations: [], backlog: [], hidden: { FACT: 0, UNDERSTANDING: 0, SELF: 0 },
  ...overrides,
})

const entry = (state: GameSnapshot, id: string) => getArchiveEntries(state).find((item) => item.id === id)

describe('ARCHIVE derivation', () => {
  beforeEach(() => localStorage.clear())

  it('does not expose uncollected people, terms, or Mina information', () => {
    const entries = getArchiveEntries(snapshot({ visitedNodes: ['prologue', 'red_dream'] }))
    expect(entries.map((item) => item.id)).toEqual(['red_dream'])
    expect(entries.map((item) => item.id)).not.toContain('akano_yume')
    expect(entries.map((item) => item.id)).not.toContain('jigaeshi')
    expect(entries.map((item) => item.id)).not.toContain('mina')
  })

  it('labels the neighbor incident as rumor until objective confirmation exists', () => {
    const rumor = entry(snapshot({ knowledge: ['neighbor_injury_rumor'] }), 'neighbor_incident')
    expect(rumor?.facts).toHaveLength(1)
    expect(rumor?.facts[0].sourceType).toBe('噂')
    expect(rumor?.facts[0].text).toContain('らしい')

    const confirmed = entry(snapshot({ knowledge: ['neighbor_injury_rumor', 'neighbor_family_trouble_record', 'neighbor_relative_injury_confirmed'] }), 'neighbor_incident')
    expect(confirmed?.facts.map((fact) => fact.sourceType)).toContain('公的確認')
    expect(confirmed?.facts.some((fact) => fact.text.includes('不起訴'))).toBe(true)
  })

  it('keeps the injury and A4 evidence separate without declaring a ritual cause', () => {
    const state = snapshot({ knowledge: ['neighbor_relative_injury_confirmed', 'akano_yume_document'] })
    const archive = getArchiveEntries(state)
    expect(archive.map((item) => item.id)).toContain('neighbor_incident')
    expect(archive.map((item) => item.id)).toContain('yellow_a4')
    expect(archive.flatMap((item) => item.facts).map((fact) => fact.text).join('\n')).not.toContain('儀式で孫')
  })

  it('reveals only the acquired level of Jigaeshi and Akano Yume', () => {
    const nameOnly = entry(snapshot({ flags: { jigaeshi_term_found: true } }), 'jigaeshi')
    expect(nameOnly?.facts).toHaveLength(1)
    expect(nameOnly?.facts[0].text).toContain('詳細はまだ')

    const heard = entry(snapshot({ knowledge: ['jigaeshi_meaning'] }), 'jigaeshi')
    expect(heard?.facts).toHaveLength(1)
    expect(heard?.facts[0].text).toContain('詳細はまだ')

    const earlyAkano = entry(snapshot({ knowledge: ['akano_yume_name_from_brother'] }), 'akano_yume')
    expect(earlyAkano?.facts).toHaveLength(1)
    expect(earlyAkano?.facts[0].text).toContain('詳細は不明')
    expect(earlyAkano?.facts[0].text).not.toContain('個人サイト')
  })

  it('never attributes the red dream to Akano Yume', () => {
    const dream = entry(snapshot({
      visitedNodes: ['prologue', 'red_dream'],
      knowledge: ['brother_red_dream', 'library_jigaeshi_confirmed', 'original_harmless_ritual', 'possible_childhood_jigaeshi_participation', 'source_site_not_akano_yume'],
    }), 'red_dream')
    expect(dream?.facts.map((fact) => fact.text).join('\n')).not.toContain('アカノユメが原因')
    expect(dream?.facts.some((fact) => fact.text.includes('幼少期の地還し'))).toBe(true)
  })

  it('does not advance time and derives the same archive after save/load', () => {
    const state = snapshot({ currentTime: 777, knowledge: ['neighbor_dead', 'akano_yume_document'], visitedNodes: ['prologue', 'red_dream'] })
    const before = state.currentTime
    const original = getArchiveEntries(state)
    expect(state.currentTime).toBe(before)

    const oldSave: SaveData = { saveDataVersion: 1, savedAt: '2026-01-01T00:00:00.000Z', snapshot: state }
    localStorage.setItem('akano-yume:save:1', JSON.stringify(oldSave))
    const loaded = loadGame(1)
    expect(loaded).not.toBeNull()
    expect(getArchiveEntries(loaded!.snapshot)).toEqual(original)
  })
})

