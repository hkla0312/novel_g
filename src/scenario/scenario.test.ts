import { describe, expect, it } from 'vitest'
import { choose, enterNode, getAvailableChoices, getNextNodeId } from '../engine/gameEngine'
import { validateScenario } from '../engine/validateScenario'
import type { GameSnapshot } from '../types/game'
import { scenario, scenarioNodes } from '.'

const start = (): GameSnapshot => enterNode({
  currentNode: 'prologue', currentTime: 450, flags: {}, knowledge: [], selfMemory: [],
  visitedNodes: [], visitedLocations: [], backlog: [], hidden: { FACT: 0, UNDERSTANDING: 0, SELF: 0 },
}, scenario.prologue)

const continueTo = (state: GameSnapshot, target: string): GameSnapshot => enterNode(state, scenario[target])

const followNextUntil = (state: GameSnapshot, target: string): GameSnapshot => {
  let current = state
  for (let guard = 0; guard < 30 && current.currentNode !== target; guard += 1) {
    const next = getNextNodeId(scenario[current.currentNode], current)
    if (!next) throw new Error(`No automatic path from ${current.currentNode} to ${target}`)
    current = continueTo(current, next)
  }
  return current
}

const pick = (state: GameSnapshot, label: string): GameSnapshot => {
  const node = scenario[state.currentNode]
  const choice = getAvailableChoices(node, state).find((item) => item.label === label)
  if (!choice) throw new Error(`Choice "${label}" unavailable at ${state.currentNode}`)
  return choose(state, choice, scenario)
}

describe('scenario validation', () => {
  it('has no structural errors or unreachable nodes', () => {
    const result = validateScenario(scenarioNodes)
    expect(result.errors).toEqual([])
    expect(result.warnings).toEqual([])
  })
})

describe('vertical slice routes', () => {
  it('reaches Mina and the 16:00 event through the management route', () => {
    let state = followNextUntil(start(), 'sister_questions')
    state = pick(state, '隣のおじいさんって誰？')
    state = continueTo(state, 'sister_questions')
    state = pick(state, 'もういい')
    state = pick(state, '病院へ行く')
    state = pick(state, '高齢者に話しかける')
    state = pick(state, '礼を言って病院を出る')
    state = pick(state, '自宅を調べる')
    state = pick(state, '母親の周辺を調べる')
    state = pick(state, '戻る')
    state = pick(state, '家族写真を見る')
    expect(state.knowledge).toContain('jigaeshi_meaning')
    expect(state.backlog.some((entry) => entry.content.includes('地還しの写真'))).toBe(true)
    state = pick(state, '戻る')
    state = pick(state, '昔の自分の部屋を調べる')
    state = pick(state, '戻る')
    state = pick(state, '探索を切り上げる')
    state = pick(state, '団地へ戻る')
    state = continueTo(state, 'neighbor_fact')
    state = pick(state, '母さんへ電話する')
    state = continueTo(state, 'act2_opening')
    state = continueTo(state, 'verification_hub')
    state = pick(state, '団地管理側へ確認する')
    state = pick(state, '団地へ戻る')
    state = pick(state, '確認した情報を持って団地へ戻る')

    state = pick(state, '自宅を再探索する')
    state = pick(state, '母親の部屋をもう一度調べる')
    state = pick(state, '戻る')
    state = pick(state, 'さっきの小箱を調べる')
    expect(state.flags.neighborApartmentKey).toBe(true)
    expect(state.hidden.motherRoomSearchCount).toBe(3)
    state = pick(state, '鍵を持って戻る')
    state = pick(state, '団地の廊下へ戻る')

    state = pick(state, '老人宅へ行く')
    state = continueTo(state, 'neighbor_home_hub')
    state = pick(state, '生活の痕跡を調べる')
    state = pick(state, '部屋を調べ続ける')
    state = pick(state, '食事・介護用品を調べる')
    state = pick(state, '部屋を調べ続ける')
    state = pick(state, '赤いものを調べる')
    state = pick(state, '部屋を調べ続ける')
    state = pick(state, '古い紙を調べる')
    expect(state.knowledge).toContain('akano_yume_document')
    state = pick(state, '紙の内容を記録して戻る')
    state = pick(state, '老人宅を出る')

    state = pick(state, '図書館へ行く')
    state = pick(state, '「地還し」で詳しく探す')
    expect(state.knowledge).toContain('jigaeshi_not_akano_yume')
    state = pick(state, '調査内容を記録する')
    state = pick(state, '図書館を出る')

    state = pick(state, '自宅を再探索する')
    state = pick(state, '家族写真を見直す')
    state = pick(state, '戻る')
    state = pick(state, '昔の自分の部屋を調べる')
    state = pick(state, '戻る')
    state = pick(state, '古いヘッドセットを手に取る')
    expect(state.flags.mina_unlocked).toBe(true)
    state = pick(state, '連絡先を探して戻る')
    state = pick(state, '団地の廊下へ戻る')
    state = pick(state, 'ミナに連絡する')
    state = pick(state, '事情は後で話すと伝える')
    expect(state.flags.mina_contacted).toBe(true)

    while (state.currentTime < 960) {
      state = pick(state, '調査内容を整理する')
      state = continueTo(state, 'act2_hub')
    }
    state = pick(state, '勤務先からの電話に出る')
    state = pick(state, 'それどころではない')
    expect(state.currentNode).toBe('act3_opening')
    expect(state.knowledge).toContain('neighbor_dead')
  })

  it('allows formal police verification and all three mother-room searches after the death reveal', () => {
    let state = followNextUntil(start(), 'sister_questions')
    state = pick(state, 'もういい')
    state = pick(state, '警察へ行く')
    state = pick(state, '警察署を出る')
    state = continueTo(state, 'free_action_hub')
    expect(state.flags.police_done).toBe(true)
    state = pick(state, '自宅を調べる')
    state = pick(state, '探索を切り上げる')
    const labels = getAvailableChoices(scenario.free_action_hub, state).map((choice) => choice.label)
    expect(labels).toContain('団地へ戻る')
    state = pick(state, '団地へ戻る')
    state = continueTo(state, 'neighbor_fact')
    state = pick(state, '母さんへ電話する')
    state = continueTo(state, 'act2_opening')
    state = continueTo(state, 'verification_hub')
    state = pick(state, '警察へ正式な確認を取る')
    state = pick(state, '団地へ戻る')
    state = pick(state, '確認した情報を持って団地へ戻る')
    state = pick(state, '自宅を再探索する')
    state = pick(state, '母親の部屋を調べる')
    state = pick(state, '戻る')
    state = pick(state, '母親の部屋をもう一度調べる')
    expect(state.flags.old_box_noticed).toBe(true)
    state = pick(state, '戻る')
    state = pick(state, 'さっきの小箱を調べる')
    expect(state.flags.neighborApartmentKey).toBe(true)
    expect(state.hidden.motherRoomSearchCount).toBe(3)
  })

  it('hides the jigaeshi term until a broad search finds it', () => {
    let state = enterNode({
      ...start(), currentNode: 'library_hub', flags: {}, knowledge: ['akano_yume_document'],
    }, scenario.library_hub)
    expect(getAvailableChoices(scenario.library_hub, state).map((item) => item.label))
      .not.toContain('「地還し」で詳しく探す')
    state = pick(state, '「昔の地鎮祭」で探す')
    state = pick(state, '検索を続ける')
    expect(getAvailableChoices(scenario.library_hub, state).map((item) => item.label))
      .toContain('「地還し」で詳しく探す')
  })

  it('allows direct jigaeshi search after hearing the term at hospital', () => {
    const state = enterNode({ ...start(), knowledge: ['jigaeshi_meaning'] }, scenario.library_hub)
    expect(getAvailableChoices(scenario.library_hub, state).map((item) => item.label))
      .toContain('「地還し」で詳しく探す')
  })

  it('routes BAD, NORMAL, and TRUE from state combinations rather than a visible score choice', () => {
    const base = start()
    const atJunction = (overrides: Partial<GameSnapshot>): GameSnapshot => ({ ...base, currentNode: 'ending_junction', ...overrides })
    expect(getNextNodeId(scenario.ending_junction, atJunction({}))).toBe('bad_end')
    expect(getNextNodeId(scenario.ending_junction, atJunction({
      flags: { author_revealed: true }, selfMemory: ['loss_father', 'old_web_creation', 'escape_into_local_history'],
    }))).toBe('normal_end')
    expect(getNextNodeId(scenario.ending_junction, atJunction({
      flags: { author_revealed: true, brother_understood: true, mother_accompanied: true, mother_empathy_spoken: true },
      knowledge: ['library_jigaeshi_confirmed', 'neighbor_long_widowhood'],
      selfMemory: ['loss_father', 'old_web_creation', 'escape_into_local_history', 'online_friend_mina'],
      hidden: { FACT: 6, SELF: 5, UNDERSTANDING: 4 },
    }))).toBe('true_end')
  })

  it('unlocks SECRET only after TRUE with the optional Mina and document trail', () => {
    const complete: GameSnapshot = {
      ...start(), currentNode: 'true_end',
      flags: { true_cleared: true, mina_contacted: true, mina_deepened: true, original_pages_recovered: true, brother_understood: true },
      knowledge: ['library_jigaeshi_confirmed', 'neighbor_long_widowhood'],
    }
    expect(getAvailableChoices(scenario.true_end, complete).map((item) => item.label))
      .toContain('数日後、ミナへ連絡する')
    expect(getAvailableChoices(scenario.true_end, { ...complete, flags: { ...complete.flags, mina_deepened: false } }).map((item) => item.label))
      .not.toContain('数日後、ミナへ連絡する')
  })

  it('plays ACT3 through TRUE and SECRET without a softlock', () => {
    let state = enterNode({
      ...start(), currentTime: 960,
      flags: { mina_contacted: true },
      knowledge: ['library_jigaeshi_confirmed', 'akano_yume_document', 'neighbor_long_widowhood'],
      selfMemory: ['loss_father', 'old_web_creation', 'escape_into_local_history', 'online_friend_mina'],
      hidden: { FACT: 5, SELF: 4, UNDERSTANDING: 1 },
    }, scenario.act3_opening)
    state = continueTo(state, 'act3_hub')
    state = pick(state, '地還しと古い紙を比べる')
    state = pick(state, '比較を記録する')
    state = pick(state, 'ミナへ古い紙の写真を送る')
    state = pick(state, 'PCを確かめる')
    state = pick(state, '古いPCを起動する')
    state = followNextUntil(state, 'brother_call')
    state = pick(state, 'どこが間違ってないと思った？')
    state = continueTo(state, 'mother_returns_evening')
    state = pick(state, '一緒に行く')
    state = pick(state, '母さんは、おじいさんを助けたかったんだよな')
    state = continueTo(state, 'ending_junction')
    const ending = getNextNodeId(scenario.ending_junction, state)
    expect(ending).toBe('true_end')
    state = continueTo(state, ending!)
    expect(state.flags.true_cleared).toBe(true)
    state = pick(state, '数日後、ミナへ連絡する')
    expect(state.currentNode).toBe('secret_end')
    expect(scenario.secret_end.terminal).toBe(true)
  })

  it('continues after 16:00 without Mina and reaches a non-secret ending', () => {
    let state = enterNode({
      ...start(), currentTime: 960,
      knowledge: ['akano_yume_document'],
      selfMemory: ['loss_father', 'old_web_creation', 'escape_into_local_history'],
    }, scenario.act3_opening)
    state = continueTo(state, 'act3_hub')
    expect(getAvailableChoices(scenario.act3_hub, state).map((item) => item.label)).not.toContain('ミナへ古い紙の写真を送る')
    state = pick(state, '古いPCを起動する')
    state = followNextUntil(state, 'brother_call')
    state = pick(state, '母さんに何を言われた？')
    state = continueTo(state, 'mother_returns_evening')
    state = pick(state, '止める')
    state = continueTo(state, 'ending_junction')
    expect(getNextNodeId(scenario.ending_junction, state)).toBe('normal_end')
  })
})

