import { useState } from 'react'
import { useGame } from '../../context/GameContext'
import ProgressBar from '../common/ProgressBar'
import { subjectStats } from '../../utils/subject'
import { DIFFICULTY_LIST, difficultyOf } from '../../utils/gamify'

export default function SubjectDetail({ subjectId, onBack }) {
  const { state, actions } = useGame()
  const subject = state.subjects.find((s) => s.id === subjectId)
  const [newLesson, setNewLesson] = useState('')
  const [difficulty, setDifficulty] = useState('normal')

  if (!subject) {
    return (
      <div className="panel empty">
        <p>Không tìm thấy môn học này.</p>
        <button className="btn btn--ghost" onClick={onBack}>
          ← Quay lại bản đồ
        </button>
      </div>
    )
  }

  const st = subjectStats(subject)

  function addLesson(e) {
    e.preventDefault()
    if (!newLesson.trim()) return
    actions.addLesson(subject.id, newLesson, difficulty)
    setNewLesson('')
  }

  function remove() {
    if (window.confirm(`Xoá vùng đất "${subject.name}"? Hành động không thể hoàn tác.`)) {
      actions.deleteSubject(subject.id)
      onBack()
    }
  }

  return (
    <section style={{ '--accent': subject.color }}>
      <button className="btn btn--ghost back-btn" onClick={onBack}>
        ← Bản đồ
      </button>

      <div className="panel subject-hero">
        <div className="subject-hero__icon">{subject.icon}</div>
        <div className="subject-hero__info">
          <h2>
            {subject.name}{' '}
            {st.completed && <span title="Đã chinh phục">👑</span>}
          </h2>
          <span className="muted">
            Cấp {st.level} · {st.done}/{st.total} bài · {st.xp} XP
          </span>
          {subject.goal && (
            <div className="subject-hero__goal">🎯 {subject.goal}</div>
          )}
          <div className="subject-hero__bar">
            <ProgressBar value={st.progress} color={subject.color} height={14} />
          </div>
        </div>
        <button className="icon-btn danger" onClick={remove} title="Xoá môn">
          🗑️
        </button>
      </div>

      {subject.description && (
        <p className="muted subject-detail__desc">{subject.description}</p>
      )}

      <div className="panel">
        <div className="panel__head">
          <h3>⚔️ Danh sách nhiệm vụ</h3>
          <span className="muted">XP nhận = độ khó × streak × combo</span>
        </div>

        <form className="add-lesson-form" onSubmit={addLesson}>
          <div className="add-lesson">
            <input
              value={newLesson}
              onChange={(e) => setNewLesson(e.target.value)}
              placeholder="Thêm bài học / chương mới..."
            />
            <button
              className="btn btn--primary"
              type="submit"
              disabled={!newLesson.trim()}
            >
              + Thêm
            </button>
          </div>
          <div className="diff-picker">
            {DIFFICULTY_LIST.map((d) => (
              <button
                type="button"
                key={d.id}
                className={`diff-chip ${difficulty === d.id ? 'diff-chip--on' : ''}`}
                onClick={() => setDifficulty(d.id)}
                title={`${d.label} · ${d.baseXP} XP gốc`}
              >
                {d.icon} {d.label}
                <span className="diff-chip__xp">{d.baseXP} XP</span>
              </button>
            ))}
          </div>
        </form>

        {subject.lessons.length === 0 ? (
          <p className="muted lesson-empty">
            Chưa có nhiệm vụ nào. Thêm bài học để bắt đầu nhận XP!
          </p>
        ) : (
          <ul className="lesson-list">
            {subject.lessons.map((l) => {
              const d = difficultyOf(l.difficulty)
              return (
                <li
                  key={l.id}
                  className={`lesson ${l.done ? 'lesson--done' : ''}`}
                >
                  <label className="lesson__main">
                    <input
                      type="checkbox"
                      checked={l.done}
                      onChange={() => actions.toggleLesson(subject.id, l.id)}
                    />
                    <span className="lesson__check" aria-hidden />
                    <span className="lesson__title">{l.title}</span>
                  </label>
                  <span
                    className={`lesson__diff diff--${d.id}`}
                    title={`Độ khó: ${d.label}`}
                  >
                    {d.icon}
                    {l.done ? (
                      <b>+{l.xpAwarded || d.baseXP}</b>
                    ) : (
                      <span className="muted">{d.baseXP}</span>
                    )}
                  </span>
                  <button
                    className="icon-btn"
                    onClick={() => actions.deleteLesson(subject.id, l.id)}
                    title="Xoá bài"
                  >
                    ✕
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </section>
  )
}
