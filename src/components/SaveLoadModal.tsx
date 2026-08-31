import { useState } from 'react'
import { getSaveSummaries } from '../store/saveStorage'
import { useGameStore } from '../store/gameStore'
import { formatTime } from '../utils/time'
import { Modal } from './Modal'

type Props = { mode: 'save' | 'load'; onClose: () => void }

export function SaveLoadModal({ mode, onClose }: Props) {
  const [summaries, setSummaries] = useState(getSaveSummaries)
  const saveToSlot = useGameStore((state) => state.saveToSlot)
  const loadFromSlot = useGameStore((state) => state.loadFromSlot)
  const perform = (slot: number) => {
    if (mode === 'save') {
      saveToSlot(slot)
      setSummaries(getSaveSummaries())
    } else if (loadFromSlot(slot)) onClose()
  }
  return <Modal title={mode === 'save' ? 'セーブ' : 'ロード'} onClose={onClose}>
    <div className="save-list">
      {summaries.map(({ slot, data }) => <button key={slot} className="save-slot" disabled={mode === 'load' && !data} onClick={() => perform(slot)}>
        <strong>SLOT {slot}</strong>
        {data ? <><span>{formatTime(data.snapshot.currentTime)} / {data.snapshot.currentNode}</span><small>{new Date(data.savedAt).toLocaleString('ja-JP')}</small></> : <span>保存データなし</span>}
      </button>)}
    </div>
  </Modal>
}

