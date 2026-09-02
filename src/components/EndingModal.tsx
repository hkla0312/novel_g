import { getClearedEndings, type EndingId } from '../store/progressStorage'
import { Modal } from './Modal'

const endings: { id: EndingId; title: string }[] = [
  { id: 'bad_end', title: 'アカノユメをみた。' },
  { id: 'normal_end', title: '帰宅' },
  { id: 'true_end', title: 'それでも、信じる' },
]

export function EndingModal({ onClose }: { onClose: () => void }) {
  const cleared = new Set(getClearedEndings())
  return <Modal title="ENDING" onClose={onClose}>
    <p className="ending-intro">到達した結末だけが記録されます。</p>
    <ol className="ending-list">
      {endings.map((ending) => <li key={ending.id} className={cleared.has(ending.id) ? 'is-cleared' : undefined}>
        <span>{cleared.has(ending.id) ? ending.title : '？？？？'}</span>
        <small>{cleared.has(ending.id) ? '回収済' : '未回収'}</small>
      </li>)}
      <li className={cleared.has('secret_end') ? 'is-cleared ending-secret' : 'ending-secret'}>
        <span>？？？？</span>
        <small>閲覧条件：{cleared.has('secret_end') ? '回収済' : '未回収'}</small>
      </li>
    </ol>
  </Modal>
}

