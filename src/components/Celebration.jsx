import { useEffect } from 'react'
import { useGame } from '../context/GameContext'

// Transient toast/banner shown when the hero levels up or unlocks a badge.
export default function Celebration() {
  const { celebration, dismissCelebration } = useGame()

  useEffect(() => {
    if (!celebration) return
    const t = setTimeout(dismissCelebration, 3500)
    return () => clearTimeout(t)
  }, [celebration, dismissCelebration])

  if (!celebration) return null

  const isLevel = celebration.type === 'level'

  return (
    <div className="celebration" onClick={dismissCelebration}>
      <div className="celebration__card">
        {isLevel ? (
          <>
            <div className="celebration__icon">⭐</div>
            <div className="celebration__title">LÊN CẤP!</div>
            <div className="celebration__sub">
              Bạn đã đạt Cấp {celebration.level}
            </div>
          </>
        ) : (
          <>
            <div className="celebration__icon">{celebration.badge?.icon}</div>
            <div className="celebration__title">THÀNH TỰU MỚI!</div>
            <div className="celebration__sub">
              {celebration.badge?.name}
              {celebration.count > 1 && ` +${celebration.count - 1} khác`}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
