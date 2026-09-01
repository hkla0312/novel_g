export type AudioSettings = { bgmVolume: number; ambienceVolume: number; muted: boolean }

const KEY = 'akano-yume:audio-settings'
export const defaultAudioSettings: AudioSettings = { bgmVolume: 35, ambienceVolume: 45, muted: false }

export const loadAudioSettings = (): AudioSettings => {
  if (typeof localStorage === 'undefined') return defaultAudioSettings
  try {
    const value = JSON.parse(localStorage.getItem(KEY) ?? '') as Partial<AudioSettings>
    return {
      bgmVolume: Math.min(100, Math.max(0, Number(value.bgmVolume ?? 35))),
      ambienceVolume: Math.min(100, Math.max(0, Number(value.ambienceVolume ?? 45))),
      muted: value.muted === true,
    }
  } catch { return defaultAudioSettings }
}

export const saveAudioSettings = (settings: AudioSettings): void => {
  if (typeof localStorage !== 'undefined') localStorage.setItem(KEY, JSON.stringify(settings))
}


