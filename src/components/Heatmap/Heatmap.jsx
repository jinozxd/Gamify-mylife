import { useGame } from '../../context/GameContext'
import { lastNDays, dateFromKey } from '../../utils/date'

// GitHub-style activity heatmap of the last ~17 weeks.
const WEEKS = 17
const DAYS = WEEKS * 7

function levelForXP(xp) {
  if (!xp) return 0
  if (xp >= 100) return 4
  if (xp >= 50) return 3
  if (xp >= 25) return 2
  return 1
}

const DOW = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']

export default function Heatmap() {
  const { state } = useGame()
  const days = lastNDays(DAYS)
  const totalXP = days.reduce((n, k) => n + (state.activityLog[k] || 0), 0)
  const activeDays = days.filter((k) => state.activityLog[k]).length

  // Group into columns of 7 (one column == one week).
  const columns = []
  for (let w = 0; w < WEEKS; w++) {
    columns.push(days.slice(w * 7, w * 7 + 7))
  }

  return (
    <section className="panel heatmap-panel">
      <div className="panel__head">
        <h2>🗓️ Nhật Ký Phiêu Lưu</h2>
        <span className="muted">
          {activeDays} ngày học · {totalXP} XP trong {WEEKS} tuần qua
        </span>
      </div>

      <div className="heatmap">
        <div className="heatmap__dow">
          {DOW.map((d, i) => (
            <span key={i} className={i % 2 ? 'show' : 'hide'}>
              {d}
            </span>
          ))}
        </div>
        <div className="heatmap__grid">
          {columns.map((week, wi) => (
            <div key={wi} className="heatmap__col">
              {week.map((key) => {
                const xp = state.activityLog[key] || 0
                const d = dateFromKey(key)
                return (
                  <div
                    key={key}
                    className={`heatmap__cell lvl-${levelForXP(xp)}`}
                    title={`${d.toLocaleDateString('vi-VN')} — ${xp} XP`}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="heatmap__legend">
        <span className="muted">Ít</span>
        {[0, 1, 2, 3, 4].map((l) => (
          <div key={l} className={`heatmap__cell lvl-${l}`} />
        ))}
        <span className="muted">Nhiều</span>
      </div>
    </section>
  )
}
