const TRUE_CLEAR_KEY = 'akano-yume:clear:true'

export const hasPreviousTrueClear = (): boolean =>
  typeof localStorage !== 'undefined' && localStorage.getItem(TRUE_CLEAR_KEY) === '1'

export const recordTrueClear = (): void => {
  if (typeof localStorage !== 'undefined') localStorage.setItem(TRUE_CLEAR_KEY, '1')
}

