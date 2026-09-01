import { useState } from 'react'
import { BacklogModal } from './components/BacklogModal'
import { DebugPanel } from './components/DebugPanel'
import { SaveLoadModal } from './components/SaveLoadModal'
import { getAvailableChoices, getNodeText } from './engine/gameEngine'
import { scenario } from './scenario'
import { useGameStore } from './store/gameStore'
import { formatTime } from './utils/time'

type Overlay = 'backlog' | 'save' | 'load' | null

export default function App() {
  const [overlay, setOverlay] = useState<Overlay>(null)
  const game = useGameStore()
  const node = scenario[game.currentNode]
  const text = getNodeText(node, game)
  const choices = getAvailableChoices(node, game)
  const { currentTime, chooseChoice, continueNode, restart } = game

  const confirmRestart = () => {
    if (window.confirm('保存していない進行状況は失われます。最初から始めますか？')) restart()
  }

  return <div className="app-shell">
    <header className="topbar">
      <div><span className="eyebrow">AKANO YUME</span><h1>アカノユメ</h1></div>
      <time className="current-time" aria-label={`現在時刻 ${formatTime(currentTime)}`}>{formatTime(currentTime)}</time>
    </header>

    <main className="story" aria-live="polite">
      {node?.title && <h2 className="chapter-title">{node.title}</h2>}
      <div className="prose">{text.map((paragraph, index) => <p key={`${node?.id}-${index}`}>{paragraph}</p>)}</div>

      <div className="choices" aria-label="選択肢">
        {choices.map((choice) => <button key={`${choice.label}-${choice.next}`} onClick={() => chooseChoice(choice)}>{choice.label}</button>)}
        {node?.next && <button onClick={continueNode}>続きを読む</button>}
        {node?.terminal && <button onClick={confirmRestart}>最初から読む</button>}
      </div>
    </main>

    <nav className="toolbar" aria-label="ゲームメニュー">
      <button onClick={() => setOverlay('backlog')}>バックログ</button>
      <button onClick={() => setOverlay('save')}>SAVE</button>
      <button onClick={() => setOverlay('load')}>LOAD</button>
      <button onClick={confirmRestart}>最初から</button>
    </nav>

    {overlay === 'backlog' && <BacklogModal onClose={() => setOverlay(null)} />}
    {(overlay === 'save' || overlay === 'load') && <SaveLoadModal mode={overlay} onClose={() => setOverlay(null)} />}
    <DebugPanel />
  </div>
}

