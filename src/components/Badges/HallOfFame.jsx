import { useGame } from '../../context/GameContext'

export default function HallOfFame() {
  const { state, badges } = useGame()
  const unlocked = new Set(state.unlockedBadges)

  return (
    <section className="panel">
      <div className="panel__head">
        <h2>🏆 Sảnh Vinh Danh</h2>
        <span className="muted">
          {unlocked.size}/{badges.length} thành tựu
        </span>
      </div>

      <div className="badge-grid">
        {badges.map((b) => {
          const has = unlocked.has(b.id)
          return (
            <div
              key={b.id}
              className={`badge ${has ? 'badge--on' : 'badge--off'}`}
              title={b.desc}
            >
              <div className="badge__icon">{has ? b.icon : '🔒'}</div>
              <div className="badge__name">{b.name}</div>
              <div className="badge__desc">{b.desc}</div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
