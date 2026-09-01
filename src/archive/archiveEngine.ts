import { evaluateCondition } from '../engine/conditions'
import type { GameSnapshot } from '../types/game'
import type { Condition } from '../types/scenario'

export type ArchiveCategory = '人物' | '証言' | '場所' | '資料'
export type ArchiveSourceType = '証言' | '噂' | '公的確認' | '物証' | '記憶' | '推測'

type ArchiveFact = {
  text: string
  source: string
  sourceType: ArchiveSourceType
  condition: Condition
}

export type ArchiveEntryDefinition = {
  id: string
  category: ArchiveCategory
  title: string
  visibleWhen: Condition
  facts: ArchiveFact[]
}

export type ArchiveEntry = Omit<ArchiveEntryDefinition, 'facts' | 'visibleWhen'> & { facts: ArchiveFact[] }

const flag = (key: string): Condition => ({ type: 'flag', key })
const knowledge = (key: string): Condition => ({ type: 'knowledge', key })
const visited = (id: string): Condition => ({ type: 'visitedNode', id })
const any = (...conditions: Condition[]): Condition => ({ type: 'any', conditions })

export const archiveDefinitions: ArchiveEntryDefinition[] = [
  {
    id: 'mother', category: '人物', title: '母', visibleWhen: visited('mother_confront'), facts: [
      { text: '俺の腕を傷つけたことを否定していない。「必要だった」「ちゃんと分けた」と話した。', source: '母本人', sourceType: '証言', condition: flag('mother_admitted_injury') },
      { text: '隣の老人の食事、薬、洗濯などを継続的に世話していた。', source: '母の介護メモ', sourceType: '物証', condition: any(knowledge('mother_care_notes'), knowledge('mother_care_was_sincere')) },
      { text: '老人が死亡した後も、本人と会話したと主張している。', source: '母本人', sourceType: '証言', condition: knowledge('mother_claims_postmortem_contact') },
      { text: '老人宅の仏間を最初は気味悪がっていたという。', source: '妹', sourceType: '証言', condition: knowledge('mother_initially_feared_butsuma') },
    ],
  },
  {
    id: 'sister', category: '人物', title: '妹', visibleWhen: visited('sister_first'), facts: [
      { text: '母が今回の傷に関係していると気づいていた。', source: '妹の反応', sourceType: '証言', condition: visited('sister_first') },
      { text: '過去に母から腕を強く掴まれ、軽く噛まれたことがある。毎回ではなかった。', source: '妹', sourceType: '証言', condition: knowledge('sister_previous_incidents') },
    ],
  },
  {
    id: 'brother', category: '人物', title: '義弟', visibleWhen: any(knowledge('husband_knows'), knowledge('brother_red_dream')), facts: [
      { text: '母の介護に何度か付き添い、老人宅に入ったことがある。', source: '妹', sourceType: '証言', condition: knowledge('husband_knows') },
      { text: '最近、赤い夢を見たことがあると話した。', source: '義弟', sourceType: '証言', condition: knowledge('brother_red_dream') },
      { text: '「一人で全部抱えなくていい」という部分に少し救われたと話した。', source: '義弟', sourceType: '証言', condition: knowledge('words_helped_brother') },
    ],
  },
  {
    id: 'neighbor', category: '人物', title: '隣の老人', visibleWhen: any(knowledge('neighbor_profile'), knowledge('neighbor_dead'), knowledge('neighbor_death_datetime')), facts: [
      { text: '主人公が実家を出た後に現在の県営住宅へ入居。独居で、母が生活を支援していた。', source: '妹', sourceType: '証言', condition: knowledge('neighbor_profile') },
      { text: '数日前に死亡したと近隣住民から聞いた。', source: '団地住民', sourceType: '証言', condition: knowledge('neighbor_dead') },
      { text: '死亡は四日前。警察と親族の確認は済んでいる。', source: '住宅管理', sourceType: '公的確認', condition: knowledge('neighbor_death_datetime') },
      { text: '妻を早く亡くし、長期間一人で暮らしていたことがうかがえる。', source: '老人宅の写真', sourceType: '物証', condition: knowledge('neighbor_long_widowhood') },
      { text: 'ある年を境に家族写真や年賀状が途切れている。', source: '老人宅の生活痕', sourceType: '物証', condition: knowledge('neighbor_family_contact_ended') },
    ],
  },
  {
    id: 'mina', category: '人物', title: 'ミナ', visibleWhen: { type: 'selfMemory', key: 'online_friend_mina' }, facts: [
      { text: '約20年前、個人サイトを通じて知り合った女性。直接会ったことはない。', source: '主人公の記憶', sourceType: '記憶', condition: { type: 'selfMemory', key: 'online_friend_mina' } },
      { text: '古い紙は元のページではなく、HTMLの転載後に変更された可能性があると指摘した。', source: 'ミナ', sourceType: '証言', condition: knowledge('copied_html_changed_over_time') },
    ],
  },
  {
    id: 'neighbor_death', category: '証言', title: '老人の死亡', visibleWhen: knowledge('neighbor_dead'), facts: [
      { text: '主人公の帰省数日前に亡くなったという。', source: '団地住民', sourceType: '証言', condition: knowledge('neighbor_dead') },
      { text: '死亡日時と手続き済みであることを確認した。', source: '住宅管理', sourceType: '公的確認', condition: knowledge('neighbor_death_datetime') },
      { text: '死亡は客観的記録でも確認された。', source: '警察', sourceType: '公的確認', condition: knowledge('neighbor_death_official_record') },
    ],
  },
  {
    id: 'neighbor_incident', category: '証言', title: '老人の以前の住居と傷害', visibleWhen: any(knowledge('neighbor_injury_rumor'), knowledge('neighbor_family_trouble_record'), knowledge('neighbor_relative_injury_confirmed')), facts: [
      { text: '以前、孫世代の親族に怪我をさせ、警察が来たらしい。話した住民も詳細は知らない。', source: '団地入口の住民', sourceType: '噂', condition: knowledge('neighbor_injury_rumor') },
      { text: '前住所で親族間のトラブルと警察対応があり、その後に単身転居した記録がある。', source: '住宅管理', sourceType: '公的確認', condition: knowledge('neighbor_family_trouble_record') },
      { text: '孫世代の親族へ怪我を負わせた件で警察対応があった。不起訴となり、その後前住所を退去している。', source: '警察', sourceType: '公的確認', condition: knowledge('neighbor_relative_injury_confirmed') },
    ],
  },
  {
    id: 'mother_postmortem', category: '証言', title: '母の死亡後訪問', visibleWhen: knowledge('mother_claims_postmortem_contact'), facts: [
      { text: '母は老人の死亡後にも「会った」「話した」と主張している。', source: '母本人', sourceType: '証言', condition: knowledge('mother_claims_postmortem_contact') },
      { text: '死亡後に持ち込まれたゼリーや介護用品が老人宅に残っていた。老人が使った証拠はない。', source: '老人宅', sourceType: '物証', condition: knowledge('postmortem_care_items') },
    ],
  },
  {
    id: 'neighbor_home', category: '場所', title: '老人宅', visibleWhen: { type: 'visitedLocation', id: 'neighbor_apartment' }, facts: [
      { text: '台所、居間、寝室は質素な一人暮らしの部屋。薬、古い家電、洗濯物、介護用品が残っている。', source: '現地確認', sourceType: '物証', condition: { type: 'visitedLocation', id: 'neighbor_apartment' } },
    ],
  },
  {
    id: 'butsuma', category: '場所', title: '老人宅の仏間', visibleWhen: knowledge('butsuma_faith_accumulation'), facts: [
      { text: '妻の遺影の周囲に、赤い紙、紐、退色した布、異なる年代の印刷物が堆積している。', source: '現地確認', sourceType: '物証', condition: knowledge('butsuma_faith_accumulation') },
      { text: '信仰を仏間の外へ広げた跡は見つかっていない。', source: '部屋の状態', sourceType: '推測', condition: knowledge('neighbor_faith_contained_after_loss') },
    ],
  },
  {
    id: 'mother_room', category: '場所', title: '母の部屋', visibleWhen: any(knowledge('mother_care_notes'), knowledge('mother_care_was_sincere')), facts: [
      { text: '仕事と日常生活の物に加え、老人の介護記録と用品が保管されている。', source: '自宅探索', sourceType: '物証', condition: any(knowledge('mother_care_notes'), knowledge('mother_care_was_sincere')) },
      { text: '収納の奥の小箱から、用途不明の鍵を発見した。', source: '母の部屋', sourceType: '物証', condition: knowledge('unidentified_old_key') },
    ],
  },
  {
    id: 'old_room', category: '場所', title: '昔の子供部屋', visibleWhen: { type: 'selfMemory', key: 'old_web_creation' }, facts: [
      { text: 'HTML入門書、古いPC、ヘッドセットなどが残っている。主人公は過去に個人サイトを作っていた。', source: '自宅探索', sourceType: '物証', condition: { type: 'selfMemory', key: 'old_web_creation' } },
    ],
  },
  {
    id: 'yellow_a4', category: '資料', title: '黄ばんだA4', visibleWhen: knowledge('akano_yume_document'), facts: [
      { text: '老人宅の仏間に保管されていた。何度も折られ、テープで補修されている。', source: '老人宅・仏間', sourceType: '物証', condition: knowledge('akano_yume_document') },
      { text: '「家の痛みは、家の血で分ける」「一人で持ってはいけない」などの記述がある。', source: '黄ばんだA4', sourceType: '物証', condition: knowledge('akano_yume_document') },
    ],
  },
  {
    id: 'jigaeshi', category: '資料', title: '地還し', visibleWhen: any(knowledge('jigaeshi_meaning'), flag('jigaeshi_term_found'), knowledge('library_jigaeshi_confirmed')), facts: [
      { text: '地域の古い風習らしい。詳細はまだ分からない。', source: '病院待合室／資料中の呼称', sourceType: '証言', condition: any(knowledge('jigaeshi_meaning'), flag('jigaeshi_term_found')) },
      { text: '土地を掘る、建てるなど、大きく変える際に行われた地域習俗。', source: '郷土資料', sourceType: '物証', condition: knowledge('library_jigaeshi_confirmed') },
      { text: '赤土、赤布、赤紙が使われ、「家の難儀は家で分ける」という言葉が伝わっている。', source: '郷土資料', sourceType: '物証', condition: knowledge('library_jigaeshi_confirmed') },
      { text: '血、刃物、自傷を用いた記録は確認できない。', source: '郷土資料', sourceType: '物証', condition: knowledge('traditional_rite_has_no_self_harm') },
    ],
  },
  {
    id: 'old_site', category: '資料', title: '古い個人サイト', visibleWhen: knowledge('original_site_author'), facts: [
      { text: '主人公が子供の頃に作った、地域の風習を記録する個人サイト。', source: '主人公の旧PC', sourceType: '物証', condition: knowledge('original_site_author') },
      { text: 'サイト内に「アカノユメ」という名称はなく、血や自傷に関する記述もない。', source: '主人公の旧PC', sourceType: '物証', condition: knowledge('source_site_not_akano_yume') },
    ],
  },
  {
    id: 'red_dream', category: '資料', title: '赤い夢', visibleWhen: visited('red_dream'), facts: [
      { text: '寝苦しい夜に時々見る夢。子供の頃から何度か見ており、赤い景色が強く残る。', source: '主人公の記憶', sourceType: '記憶', condition: visited('red_dream') },
      { text: '義弟も最近、赤い夢を見たことがあるという。', source: '義弟', sourceType: '証言', condition: knowledge('brother_red_dream') },
      { text: '主人公の夢には、赤土、布、大人の手など、幼少期の地還しの記憶と共通する要素がある。', source: '古いサイトと家族写真', sourceType: '推測', condition: { type: 'all', conditions: [knowledge('library_jigaeshi_confirmed'), knowledge('original_harmless_ritual'), knowledge('possible_childhood_jigaeshi_participation')] } },
      { text: '義弟は地還しの経験を持たず、赤い夢について読んだ後に夢を見始めている。主人公の夢とは背景が異なる。', source: '義弟の証言と旧PC', sourceType: '推測', condition: { type: 'all', conditions: [knowledge('brother_red_dream'), knowledge('source_site_not_akano_yume')] } },
    ],
  },
  {
    id: 'akano_yume', category: '資料', title: 'アカノユメ', visibleWhen: any(knowledge('akano_yume_name_from_brother'), knowledge('akano_yume_document')), facts: [
      { text: '義弟が口にした言葉。詳細は不明。', source: '義弟', sourceType: '証言', condition: knowledge('akano_yume_name_from_brother') },
      { text: '老人宅の仏間に「アカノユメ」と書かれた古い紙があった。', source: '老人宅・仏間', sourceType: '物証', condition: knowledge('akano_yume_document') },
      { text: '同じ名称でも、資料によって内容が少しずつ異なるらしい。', source: 'ミナ', sourceType: '証言', condition: knowledge('copied_html_changed_over_time') },
      { text: '地還しと赤、家族、分けるという要素が似ている。地還し側に血や傷の記録はない。', source: '郷土資料と黄ばんだA4', sourceType: '物証', condition: knowledge('jigaeshi_not_akano_yume') },
      { text: '主人公の古いサイトには似た地域風習の記録があるが、アカノユメという名称は使われていない。', source: '主人公の旧PC', sourceType: '物証', condition: knowledge('source_site_not_akano_yume') },
    ],
  },
]

export const getArchiveEntries = (state: GameSnapshot): ArchiveEntry[] =>
  archiveDefinitions
    .filter((entry) => evaluateCondition(entry.visibleWhen, state))
    .map((entry) => ({
      id: entry.id,
      category: entry.category,
      title: entry.title,
      facts: entry.facts.filter((fact) => evaluateCondition(fact.condition, state)),
    }))
    .filter((entry) => entry.facts.length > 0)

export const archiveCategories: ArchiveCategory[] = ['人物', '証言', '場所', '資料']

