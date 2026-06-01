import ProgressBar from '../common/ProgressBar'
import { subjectStats } from '../../utils/subject'

export default function SubjectCard({ subject, onOpen }) {
  const st = subjectStats(subject)

  return (
    <button
      className="subject-card panel"
      style={{ '--accent': subject.color }}
      onClick={() => onOpen(subject.id)}
    >
      {st.completed && <div className="subject-card__crown">👑</div>}
      <div className="subject-card__top">
        <div className="subject-card__icon">{subject.icon}</div>
        <div className="subject-card__title">
          <h3>{subject.name}</h3>
          <span className="muted">Cấp {st.level} · vùng đất tri thức</span>
        </div>
      </div>

      {subject.description && (
        <p className="subject-card__desc">{subject.description}</p>
      )}

      <div className="subject-card__bar">
        <ProgressBar value={st.progress} color={subject.color} />
        <div className="subject-card__meta muted">
          <span>
            {st.done}/{st.total} bài
          </span>
          <span>{Math.round(st.progress * 100)}%</span>
        </div>
      </div>
    </button>
  )
}
