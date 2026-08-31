import { formatTime } from '../utils/time'
import { useGameStore } from '../store/gameStore'
import { Modal } from './Modal'

export function BacklogModal({ onClose }: { onClose: () => void }) {
  const backlog = useGameStore((state) => state.backlog)
  return <Modal title="バックログ" onClose={onClose} wide>
    <ol className="backlog">
      {backlog.map((entry) => <li key={entry.id} className={`backlog__entry backlog__entry--${entry.kind}`}>
        <time>{formatTime(entry.time)}</time><span>{entry.kind === 'choice' ? `選択：${entry.content}` : entry.content}</span>
      </li>)}
    </ol>
  </Modal>
}

