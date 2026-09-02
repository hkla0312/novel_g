import type { ScenarioNode } from '../types/scenario'
import { loadAudioSettings, saveAudioSettings, type AudioSettings } from './audioConfig'

export type TrackId = 'prologue-night' | 'main-investigation' | 'end-bad' | 'end-normal' | 'end-true' | 'end-secret'
const sources: Record<TrackId, string> = {
  'prologue-night': 'https://opengameart.org/sites/default/files/ambient_horror.ogg',
  'main-investigation': 'https://opengameart.org/sites/default/files/The%20Surreal%20Truth.mp3',
  'end-bad': 'https://opengameart.org/sites/default/files/Infestation%20in%20the%20Control%20Room.mp3',
  'end-normal': 'https://opengameart.org/sites/default/files/Final%20Captain%27s%20Log.mp3',
  'end-true': 'https://opengameart.org/sites/default/files/The%20Depths%20of%20Hell.mp3',
  'end-secret': 'https://opengameart.org/sites/default/files/Cage%20of%20the%20Cryptid.mp3',
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
    const tick = (now: number) => { const p = Math.max(0, Math.min(1, (now - start) / Math.max(1, ms))); audio.volume = Math.max(0, Math.min(1, base * (from + (to - from) * p))); if (p < 1) requestAnimationFrame(tick) }
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

