import { archiveCategories, getArchiveEntries } from '../archive/archiveEngine'
import { useGameStore } from '../store/gameStore'
import { Modal } from './Modal'

export function ArchiveModal({ onClose }: { onClose: () => void }) {
  const game = useGameStore()
  const entries = getArchiveEntries(game)

  return <Modal title="ARCHIVE" onClose={onClose} wide>
    <p className="archive-intro">これまでに確認した証言と物証のメモ。出典と推測は分けて記録する。</p>
    <div className="archive">
      {archiveCategories.map((category) => {
        const categoryEntries = entries.filter((entry) => entry.category === category)
        if (categoryEntries.length === 0) return null
        return <section className="archive__category" key={category}>
          <h3>{category}</h3>
          <div className="archive__entries">
            {categoryEntries.map((entry) => <details className="archive-entry" key={entry.id}>
              <summary>{entry.title}</summary>
              <ul>
                {entry.facts.map((fact, index) => <li key={`${entry.id}-${index}`}>
                  <p>{fact.text}</p>
                  <small>{fact.sourceType}<span aria-hidden="true"> / </span>SOURCE：{fact.source}</small>
                </li>)}
              </ul>
            </details>)}
          </div>
        </section>
      })}
    </div>
  </Modal>
}

