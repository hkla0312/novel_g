import type { ReactNode } from 'react'

type Props = { title: string; onClose: () => void; children: ReactNode; wide?: boolean }

export function Modal({ title, onClose, children, wide = false }: Props) {
  return <div className="modal-shade" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
    <section className={`modal ${wide ? 'modal--wide' : ''}`} role="dialog" aria-modal="true" aria-label={title}>
      <header className="modal__header"><h2>{title}</h2><button className="icon-button" onClick={onClose} aria-label="閉じる">×</button></header>
      <div className="modal__body">{children}</div>
    </section>
  </div>
}

