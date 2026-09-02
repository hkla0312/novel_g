import { useEffect, useState } from 'react'
import { BacklogModal } from './components/BacklogModal'
import { ArchiveModal } from './components/ArchiveModal'
import { DebugPanel } from './components/DebugPanel'
import { SaveLoadModal } from './components/SaveLoadModal'
import { getAvailableChoices, getNextNodeId, getNodeText } from './engine/gameEngine'
import { scenario } from './scenario'
import { useGameStore } from './store/gameStore'
import { formatTime } from './utils/time'
import { ConfigModal } from './components/ConfigModal'
import { EndingModal } from './components/EndingModal'
import { PlaytestPanel } from './components/PlaytestPanel'
import { audioManager } from './audio/AudioManager'

type Overlay = 'backlog' | 'archive' | 'ending' | 'save' | 'load' | 'config' | null

export default function App() {
  const [overlay, setOverlay] = useState<Overlay>(null)
  const game = useGameStore()
  const node = scenario[game.currentNode]
  const text = getNodeText(node, game)
  const choices = getAvailableChoices(node, game)
  const next = getNextNodeId(node, game)
  const { currentTime, chooseChoice, continueNode, restart } = game
  useEffect(() => { audioManager.applyNode(node) }, [node])
  useEffect(() => {
    const unlock = () => audioManager.unlock()
    window.addEventListener('pointerdown', unlock, { once: true }); window.addEventListener('keydown', unlock, { once: true })
    return () => { window.removeEventListener('pointerdown', unlock); window.removeEventListener('keydown', unlock) }
  }, [])

  const confirmRestart = () => {
    if (window.confirm('保存していない進行状況は失われます。最初から始めますか？')) { audioManager.stopAll(); restart() }
  }

  return <div className="app-shell">
    <header className="topbar">
      <div><span className="eyebrow">AKANO YUME</span><h1>アカノユメ</h1></div>
      <time className="current-time" aria-label={`現在時刻 ${formatTime(currentTime)}`}>{formatTime(currentTime)}</time>
    </header>

    <main className="story" aria-live="polite">
      <div className="story-page" key={node?.id}>
        {node?.title && <h2 className="chapter-title">{node.title}</h2>}
        <div className="prose">{text.map((paragraph, index) => <p key={`${node?.id}-${index}`}>{paragraph}</p>)}</div>

        <div className="choices" aria-label="選択肢">
          {choices.map((choice) => <button key={`${choice.label}-${choice.next}`} onClick={() => chooseChoice(choice)}>{choice.label}</button>)}
          {next && <button onClick={continueNode}>続きを読む</button>}
          {node?.terminal && <button onClick={confirmRestart}>最初から読む</button>}
        </div>
      </div>
    </main>

    <nav className="toolbar" aria-label="ゲームメニュー">
      <button onClick={() => setOverlay('backlog')}>バックログ</button>
      <button onClick={() => setOverlay('archive')}>ARCHIVE</button>
      <button onClick={() => setOverlay('ending')}>ENDING</button>
      <button onClick={() => setOverlay('save')}>SAVE</button>
      <button onClick={() => setOverlay('load')}>LOAD</button>
      <button onClick={() => setOverlay('config')}>CONFIG</button>
      <button onClick={confirmRestart}>最初から</button>
    </nav>

    {overlay === 'backlog' && <BacklogModal onClose={() => setOverlay(null)} />}
    {overlay === 'archive' && <ArchiveModal onClose={() => setOverlay(null)} />}
    {overlay === 'ending' && <EndingModal onClose={() => setOverlay(null)} />}
    {(overlay === 'save' || overlay === 'load') && <SaveLoadModal mode={overlay} onClose={() => setOverlay(null)} />}
    {overlay === 'config' && <ConfigModal onClose={() => setOverlay(null)} />}
    <PlaytestPanel game={game} />
    <DebugPanel />
  </div>
}

