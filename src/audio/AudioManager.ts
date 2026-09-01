import type { ScenarioNode } from '../types/scenario'
import { loadAudioSettings, saveAudioSettings, type AudioSettings } from './audioConfig'

export type TrackId = 'prologue-night' | 'main-investigation' | 'end-bad' | 'end-normal' | 'end-true' | 'end-secret'
const sources: Record<TrackId, string> = {
  'prologue-night': `${import.meta.env.BASE_URL}audio/prologue-night.mp3`,
  'main-investigation': `${import.meta.env.BASE_URL}audio/main-investigation.mp3`,
  'end-bad': `${import.meta.env.BASE_URL}audio/end-bad.mp3`,
  'end-normal': `${import.meta.env.BASE_URL}audio/end-normal.mp3`,
  'end-true': `${import.meta.env.BASE_URL}audio/end-true.mp3`,
  'end-secret': `${import.meta.env.BASE_URL}audio/end-secret.mp3`,
}

type Channel = { id: TrackId | null; audio: HTMLAudioElement | null; scale: number }

export class AudioManager {
  private bgm: Channel = { id: null, audio: null, scale: 1 }
  private ambience: Channel = { id: null, audio: null, scale: 1 }
  private unlocked = false
  private settings = loadAudioSettings()

  unlock = (): void => { this.unlocked = true; void this.resume() }
  getSettings = (): AudioSettings => ({ ...this.settings })
  setSettings = (next: AudioSettings): void => { this.settings = next; saveAudioSettings(next); this.applyVolumes() }

  private create(id: TrackId): HTMLAudioElement {
    const audio = new Audio(sources[id]); audio.loop = true; audio.preload = 'none'; return audio
  }
  private volume(channel: Channel, kind: 'bgm' | 'ambience'): number {
    if (this.settings.muted) return 0
    return ((kind === 'bgm' ? this.settings.bgmVolume : this.settings.ambienceVolume) / 100) * channel.scale
  }
  private applyVolumes(): void {
    if (this.bgm.audio) this.bgm.audio.volume = this.volume(this.bgm, 'bgm')
    if (this.ambience.audio) this.ambience.audio.volume = this.volume(this.ambience, 'ambience')
  }
  private async resume(): Promise<void> {
    for (const channel of [this.bgm, this.ambience]) if (channel.audio?.paused) await channel.audio.play().catch(() => undefined)
  }
  private play(channel: Channel, id: TrackId, scale = 1): void {
    channel.scale = scale
    if (channel.id === id) { this.applyVolumes(); return }
    channel.audio?.pause()
    channel.id = id; channel.audio = this.create(id); this.applyVolumes()
    if (this.unlocked) void channel.audio.play().catch(() => undefined)
  }
  playBgm = (id: Exclude<TrackId, 'prologue-night'>, scale = 1): void => this.play(this.bgm, id, scale)
  playAmbience = (id: 'prologue-night'): void => this.play(this.ambience, id)
  stopBgm = (): void => { this.bgm.audio?.pause(); this.bgm = { id: null, audio: null, scale: 1 } }
  stopAmbience = (): void => { this.ambience.audio?.pause(); this.ambience = { id: null, audio: null, scale: 1 } }
  stopAll = (): void => { this.stopBgm(); this.stopAmbience() }
  fadeIn = (kind: 'bgm' | 'ambience', ms = 1000): void => this.fade(kind, 0, 1, ms)
  fadeOut = (kind: 'bgm' | 'ambience', ms = 1000): void => this.fade(kind, 1, 0, ms)
  private fade(kind: 'bgm' | 'ambience', from: number, to: number, ms: number): void {
    const channel = kind === 'bgm' ? this.bgm : this.ambience
    if (!channel.audio) return
    const audio = channel.audio; const start = performance.now(); const base = this.volume(channel, kind)
    const tick = (now: number) => { const p = Math.min(1, (now - start) / Math.max(1, ms)); audio.volume = base * (from + (to - from) * p); if (p < 1) requestAnimationFrame(tick) }
    requestAnimationFrame(tick)
  }
  applyNode = (node?: ScenarioNode): void => {
    if (!node) return
    if (!node.audio) {
      if (node.id === 'red_dream') return
      if (this.bgm.id === null || this.bgm.id.startsWith('end-')) this.playBgm('main-investigation', .72)
      if (this.ambience.id) this.stopAmbience()
      return
    }
    const { bgm, ambience, fadeMs = 1200, bgmVolumeScale = 1 } = node.audio
    if (bgm === null) this.fadeOut('bgm', fadeMs); else if (bgm) { this.playBgm(bgm, bgmVolumeScale); this.fadeIn('bgm', fadeMs) }
    if (ambience === null) this.fadeOut('ambience', fadeMs); else if (ambience) { this.playAmbience(ambience); this.fadeIn('ambience', fadeMs) }
  }
  currentTracks = (): { bgm: TrackId | null; ambience: TrackId | null } => ({ bgm: this.bgm.id, ambience: this.ambience.id })
}

export const audioManager = new AudioManager()

