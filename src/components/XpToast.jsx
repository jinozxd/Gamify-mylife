import { useEffect } from 'react'
import { useGame } from '../context/GameContext'

// Floating "+XP" toast (góc dưới phải) hiện ngay khi hoàn thành một bài,
// kèm chi tiết: XP gốc × hệ số streak × hệ số combo.
export default function XpToast() {
  const { xpToast, dismissXpToast } = useGame()

  useEffect(() => {
    if (!xpToast) return
    const t = setTimeout(dismissXpToast, 2600)
    return () => clearTimeout(t)
  }, [xpToast, dismissXpToast])

  if (!xpToast) return null

  const { xp, base, streakMult, comboMult, combo } = xpToast
  const hasBonus = streakMult > 1 || comboMult > 1

  return (
    // key buộc React tạo lại node mỗi lần → animation chạy lại cho từng bài.
    <div className="xp-toast" key={xpToast.at}>
      <div className="xp-toast__amount">+{xp} XP</div>
      {hasBonus ? (
        <div className="xp-toast__break">
          <span>{base}</span>
          {streakMult > 1 && (
            <span className="xp-toast__mult streak">⚡ ×{streakMult}</span>
          )}
          {comboMult > 1 && (
            <span className="xp-toast__mult combo">🔥 ×{comboMult.toFixed(2)}</span>
          )}
        </div>
      ) : (
        <div className="xp-toast__break muted">bài hoàn thành</div>
      )}
      {combo >= 2 && (
        <div className="xp-toast__combo">COMBO ×{combo}!</div>
      )}
    </div>
  )
}
