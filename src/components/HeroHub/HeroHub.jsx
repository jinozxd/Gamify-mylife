import { useState } from 'react'
import { useGame } from '../../context/GameContext'
import { getRankTitle } from '../../utils/leveling'
import ProgressBar from '../common/ProgressBar'
import { subjectStats } from '../../utils/subject'

export default function HeroHub() {
  const { state, levelInfo, actions } = useGame()
  const [editingName, setEditingName] = useState(false)
  const [nameDraft, setNameDraft] = useState(state.hero.name)

  const totalLessonsDone = state.subjects.reduce(
    (n, s) => n + subjectStats(s).done,
    0
  )
  const conquered = state.subjects.filter((s) => subjectStats(s).completed).length

  function saveName() {
    actions.setHeroName(nameDraft.trim() || 'Nhà Thám Hiểm')
    setEditingName(false)
  }

  return (
    <section className="panel hero-hub">
      <div className="hero-hub__avatar">
        <div className="hero-hub__avatar-emoji">🧙</div>
        <div className="hero-hub__level-badge">Lv {levelInfo.level}</div>
      </div>

      <div className="hero-hub__body">
        <div className="hero-hub__nameline">
          {editingName ? (
            <span className="name-edit">
              <input
                autoFocus
                value={nameDraft}
                onChange={(e) => setNameDraft(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && saveName()}
              />
              <button className="btn btn--primary btn--sm" onClick={saveName}>
                Lưu
              </button>
            </span>
          ) : (
            <h2 onClick={() => { setNameDraft(state.hero.name); setEditingName(true) }}>
              {state.hero.name} <span className="pencil">✎</span>
            </h2>
          )}
        </div>
        <div className="hero-hub__rank">{getRankTitle(levelInfo.level)}</div>

        <div className="hero-hub__xpbar">
          <ProgressBar value={levelInfo.progress} color="#f5c518" height={14} />
          <div className="hero-hub__xp-meta muted">
            <span>
              {levelInfo.xpIntoLevel} / {levelInfo.xpForNext} XP
            </span>
            <span>Tổng {levelInfo.totalXP} XP</span>
          </div>
        </div>

        <div className="stat-row">
          <div className="stat">
            <div className="stat__value">🔥 {state.hero.streak}</div>
            <div className="stat__label">ngày liên tục</div>
          </div>
          <div className="stat">
            <div className="stat__value">📚 {state.subjects.length}</div>
            <div className="stat__label">môn học</div>
          </div>
          <div className="stat">
            <div className="stat__value">✅ {totalLessonsDone}</div>
            <div className="stat__label">bài đã xong</div>
          </div>
          <div className="stat">
            <div className="stat__value">👑 {conquered}</div>
            <div className="stat__label">môn chinh phục</div>
          </div>
          <div className="stat">
            <div className="stat__value">🏆 {state.unlockedBadges.length}</div>
            <div className="stat__label">thành tựu</div>
          </div>
        </div>
      </div>
    </section>
  )
}
