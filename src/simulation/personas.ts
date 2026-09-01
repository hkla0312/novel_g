import type { Choice } from '../types/scenario'
import type { GameSnapshot } from '../types/game'
import type { PersonaId, ThoughtLog } from './types'

export const personas: PersonaId[] = [
  'ordinary', 'horror_veteran', 'occult_believer', 'skeptic', 'trust_mother', 'distrust_mother',
  'suspect_neighbor', 'suspect_brother', 'trust_sister', 'safety_first', 'rush_neighbor',
  'internet_first', 'local_history', 'family_first', 'efficient', 'completionist', 'skipper',
  'avoid_scary', 'deep_reader', 'casual',
]

const matches = (choice: Choice, words: string[]): boolean => words.some((word) => choice.label.includes(word))

const preferences: Record<PersonaId, Array<[string[], number]>> = {
  ordinary: [[['病院', '妹', '生活の痕跡'], 1.4]],
  horror_veteran: [[['仏間', '黄ばんだ', '老人宅', '赤い夢'], 2.0]],
  occult_believer: [[['赤い夢', '宗教', '仏間', 'アカノユメ'], 2.2]],
  skeptic: [[['警察', '管理', '正式', '地還し', '比較'], 2.2]],
  trust_mother: [[['妹', '母親', '一緒に行く', '助けたかった'], 1.8], [['警察'], 0.6]],
  distrust_mother: [[['警察', '母親の部屋', '死んでいる'], 2.0]],
  suspect_neighbor: [[['老人', '仏間', '前の事件', '黄ばんだ'], 2.5]],
  suspect_brother: [[['義弟', '旦那', '母さんに何を'], 2.3]],
  trust_sister: [[['妹', 'お前は', '旦那'], 2.0]],
  safety_first: [[['病院', '警察', '正式', '管理'], 2.5]],
  rush_neighbor: [[['母親の部屋', 'もう一度', '小箱', '老人宅'], 3.0]],
  internet_first: [[['昔の自分', 'ヘッドセット', 'ミナ', 'PC'], 2.7]],
  local_history: [[['病院', '地鎮祭', '地還し', '図書館'], 2.8]],
  family_first: [[['妹', '母親', '家族写真', '義弟', '一緒に行く', '助けたかった'], 2.5]],
  efficient: [[['病院', '高齢者', '管理', '小箱', '地還し', 'PC'], 2.1], [['赤い夢', '地域の宗教', '整理'], 0.35]],
  completionist: [[['戻る', '出る', '切り上げる', 'PC'], 0.25]],
  skipper: [[['もういい', '出る', '切り上げる', 'PC', '止める'], 3.0]],
  avoid_scary: [[['仏間', '黄ばんだ', '老人宅'], 0.25], [['病院', '図書館', '妹'], 2.0]],
  deep_reader: [[['前の事件', '仏間の外', '比較', 'どこが', '助けたかった'], 3.0]],
  casual: [[['もういい', '出る', '切り上げる', 'PC'], 1.8]],
}

export const choiceWeight = (persona: PersonaId, choice: Choice, state: GameSnapshot, visits: number): number => {
  let weight = Math.pow(0.035, visits)
  for (const [words, multiplier] of preferences[persona]) if (matches(choice, words)) weight *= multiplier
  if (choice.label.includes('勤務先からの電話')) weight *= 20
  if (choice.label.includes('調査内容を整理') && state.currentTime < 900) weight *= 0.2
  if (choice.label.includes('図書館を出る') && !state.flags.library_jigaeshi_done) weight *= 0.55
  if (choice.label.includes('老人宅を出る') && !state.flags.neighbor_paper_checked) weight *= 0.35
  if (choice.label.includes('団地の廊下へ戻る') && (state.hidden.motherRoomSearchCount ?? 0) < 3) weight *= 0.45
  if (choice.label.includes('古いPCを起動する')) weight *= 1.8
  return Math.max(weight, 0.001)
}

export const inferHypothesis = (state: GameSnapshot): Omit<ThoughtLog, 'step' | 'node'> => {
  const knows = (key: string): boolean => state.knowledge.includes(key)
  if (knows('neighbor_mother_mirror_understood')) return { currentHypothesis: 'H11', confidence: 86, reason: '母の喪失と老人への共感、傷害を分けて考えられる情報が揃った。', nextIntent: '母を傷つけず、行為だけを止められるか確かめたい。' }
  if (knows('source_site_not_akano_yume')) return { currentHypothesis: 'H8', confidence: 91, reason: '旧サイトに名称・血・自傷がなく、後代の文書との差が確認できた。', nextIntent: '言葉が誰を救い、どこで害へ変わったか確かめたい。' }
  if (knows('neighbor_early_recipient_after_wife_loss')) return { currentHypothesis: 'H9', confidence: 78, reason: '妻の死と古い印刷物の年代が近く、老人が発信者より受信者に見える。', nextIntent: '原サイトと転載の差を確認したい。' }
  if (knows('jigaeshi_not_akano_yume')) return { currentHypothesis: 'H6', confidence: 84, reason: '地還しには血も傷も名称もなく、古い紙とは一致しない。', nextIntent: '変質前の文章を探したい。' }
  if (state.selfMemory.includes('escape_into_local_history')) return { currentHypothesis: 'H7', confidence: 69, reason: '自分が地域史をサイトへ書いていた記憶が戻り始めた。', nextIntent: '旧PCのページを確認したい。' }
  if (knows('akano_yume_document') && knows('neighbor_injury_faith_possible_link')) return { currentHypothesis: 'H5', confidence: 77, reason: '傷害の噂と「家の血で分ける」という紙が同じ部屋にある。因果は未確認だ。', nextIntent: '紙の年代と老人の家族史を確かめたい。' }
  if (knows('akano_yume_document') || knows('brother_red_dream')) return { currentHypothesis: 'H4', confidence: 68, reason: '母と義弟に共通する名称と赤い夢が出てきた。', nextIntent: '地域風習と文書が同じものか確かめたい。' }
  if (knows('butsuma_faith_accumulation')) return { currentHypothesis: 'H3', confidence: 82, reason: '普通の居室に対して仏間だけ赤い資料が堆積していた。', nextIntent: '黄ばんだ紙の内容を確認したい。' }
  if (knows('neighbor_injury_rumor') || knows('neighbor_relative_injury_confirmed')) return { currentHypothesis: 'H2', confidence: 74, reason: '老人には親族傷害と退去の情報があり、母の変化とも時期が重なる。', nextIntent: '老人宅と母の介護記録を確認したい。' }
  return { currentHypothesis: 'H1', confidence: 58, reason: '現時点で確かな異常行動は母による傷害だけだ。', nextIntent: '母の変化がいつ始まったか妹へ聞きたい。' }
}

