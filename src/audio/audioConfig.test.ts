// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest'
import { defaultAudioSettings, loadAudioSettings, saveAudioSettings } from './audioConfig'

describe('audio settings', () => {
  beforeEach(() => localStorage.clear())
  it('persists volume and mute settings', () => {
    expect(loadAudioSettings()).toEqual(defaultAudioSettings)
    saveAudioSettings({ bgmVolume: 28, ambienceVolume: 41, muted: true })
    expect(loadAudioSettings()).toEqual({ bgmVolume: 28, ambienceVolume: 41, muted: true })
  })
})

