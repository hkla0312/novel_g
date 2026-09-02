// @vitest-environment jsdom

import { flushSync } from 'react-dom'
import { createRoot } from 'react-dom/client'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('initial application render', () => {
  it('mounts the interactive title, prologue and continue control', () => {
    const container = document.createElement('div')
    document.body.append(container)
    const root = createRoot(container)
    flushSync(() => root.render(<App />))
    expect(container.textContent).toContain('アカノユメ')
    expect(container.textContent).toContain('PROLOGUE')
    expect(container.querySelector('button')?.textContent).toContain('続きを読む')
    expect(container.textContent).toContain('ARCHIVE')
    expect(container.textContent).toContain('ENDING')
    flushSync(() => root.unmount())
  })
})

