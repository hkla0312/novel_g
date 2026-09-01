import { useState } from 'react'
import { audioManager } from '../audio/AudioManager'
import { Modal } from './Modal'

export function ConfigModal({ onClose }: { onClose: () => void }) {
  const [settings, setSettings] = useState(audioManager.getSettings())
  const update = (next: typeof settings) => { setSettings(next); audioManager.setSettings(next) }
  return <Modal title="CONFIG" onClose={onClose}>
    <div className="config-list">
      <label>BGM <span>{settings.bgmVolume}</span><input type="range" min="0" max="100" value={settings.bgmVolume} onChange={(e) => update({ ...settings, bgmVolume: Number(e.target.value) })} /></label>
      <label>AMBIENCE / SE <span>{settings.ambienceVolume}</span><input type="range" min="0" max="100" value={settings.ambienceVolume} onChange={(e) => update({ ...settings, ambienceVolume: Number(e.target.value) })} /></label>
      <label className="config-check"><input type="checkbox" checked={settings.muted} onChange={(e) => update({ ...settings, muted: e.target.checked })} /> MUTE</label>
    </div>
  </Modal>
}

