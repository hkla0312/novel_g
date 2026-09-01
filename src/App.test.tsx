import { renderToString } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('initial application render', () => {
  it('renders the title, prologue and continue control', () => {
    const html = renderToString(<App />)
    expect(html).toContain('アカノユメ')
    expect(html).toContain('PROLOGUE')
    expect(html).toContain('続きを読む')
  })
})

