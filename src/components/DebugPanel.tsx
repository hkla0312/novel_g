import { useState } from 'react'
import { scenarioNodes } from '../scenario'
import { useGameStore } from '../store/gameStore'
import { formatTime } from '../utils/time'

const debugEnabled = import.meta.env.DEV || import.meta.env.VITE_ENABLE_DEBUG === 'true'

export function DebugPanel() {
  const [open, setOpen] = useState(false)
  const state = useGameStore()
  const [key, setKey] = useState('')
  if (!debugEnabled) return null
  if (!open) return <button className="debug-toggle" onClick={() => setOpen(true)}>DEBUG</button>
  return <aside className="debug-panel">
    <header><strong>DEBUG</strong><button onClick={() => setOpen(false)}>閉じる</button></header>
    <label>node<select value={state.currentNode} onChange={(event) => state.jumpToNode(event.target.value)}>{scenarioNodes.map((node) => <option key={node.id}>{node.id}</option>)}</select></label>
    <label>time ({formatTime(state.currentTime)})<input type="number" value={state.currentTime} onChange={(event) => state.setCurrentTime(Number(event.target.value))} /></label>
    <div className="debug-add"><input value={key} onChange={(event) => setKey(event.target.value)} placeholder="flag / knowledge key" /><button onClick={() => { if (key) state.setFlag(key, true) }}>+flag</button><button onClick={() => { if (key) state.setKnowledge(key, true) }}>+knowledge</button></div>
    <DebugValues label="flags" values={Object.entries(state.flags).filter(([, value]) => value).map(([name]) => name)} onRemove={(name) => state.setFlag(name, false)} />
    <DebugValues label="knowledge" values={state.knowledge} onRemove={(name) => state.setKnowledge(name, false)} />
    <DebugValues label="selfMemory" values={state.selfMemory} />
    <DebugValues label="visitedNodes" values={state.visitedNodes} />
    <DebugValues label="visitedLocations" values={state.visitedLocations} />
  </aside>
}

function DebugValues({ label, values, onRemove }: { label: string; values: string[]; onRemove?: (key: string) => void }) {
  return <details><summary>{label} ({values.length})</summary><div className="debug-values">{values.map((value) => <button key={value} disabled={!onRemove} onClick={() => onRemove?.(value)}>{value}{onRemove ? ' ×' : ''}</button>)}</div></details>
}

