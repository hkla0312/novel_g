const TRUE_CLEAR_KEY = 'akano-yume:clear:true'
const ENDING_CLEAR_KEY = 'akano-yume:clear:endings'

export type EndingId = 'bad_end' | 'normal_end' | 'true_end' | 'secret_end'

const endingIds: EndingId[] = ['bad_end', 'normal_end', 'true_end', 'secret_end']

export const getClearedEndings = (): EndingId[] => {
  if (typeof localStorage === 'undefined') return []
  let stored: unknown = []
  try { stored = JSON.parse(localStorage.getItem(ENDING_CLEAR_KEY) ?? '[]') }
  catch { stored = [] }
  const cleared = Array.isArray(stored)
    ? endingIds.filter((id) => stored.includes(id))
    : []
  // TRUEの旧クリア記録を、エンディング一覧にも引き継ぐ。
  if (localStorage.getItem(TRUE_CLEAR_KEY) === '1' && !cleared.includes('true_end')) cleared.push('true_end')
  return cleared
}

export const recordEndingClear = (id: EndingId): void => {
  if (typeof localStorage === 'undefined') return
  const next = Array.from(new Set([...getClearedEndings(), id]))
  localStorage.setItem(ENDING_CLEAR_KEY, JSON.stringify(next))
  if (id === 'true_end') localStorage.setItem(TRUE_CLEAR_KEY, '1')
}

export const hasPreviousTrueClear = (): boolean =>
  typeof localStorage !== 'undefined' && localStorage.getItem(TRUE_CLEAR_KEY) === '1'

export const recordTrueClear = (): void => {
  recordEndingClear('true_end')
}

