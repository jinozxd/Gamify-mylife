import { useState } from 'react'
import { useGame } from '../../context/GameContext'
import SubjectCard from './SubjectCard'
import AddSubjectModal from './AddSubjectModal'

export default function QuestMap({ onOpenSubject }) {
  const { state } = useGame()
  const [adding, setAdding] = useState(false)

  return (
    <section>
      <div className="section-head">
        <div>
          <h2>🗺️ Bản Đồ Chinh Phục</h2>
          <p className="muted">Mỗi môn học là một vùng đất đang chờ cậu khám phá.</p>
        </div>
        <button className="btn btn--primary" onClick={() => setAdding(true)}>
          + Thêm vùng đất
        </button>
      </div>

      {state.subjects.length === 0 ? (
        <div className="empty panel">
          <div className="empty__icon">🧭</div>
          <h3>Bản đồ còn trống</h3>
          <p className="muted">
            Hãy thêm môn học đầu tiên để bắt đầu hành trình lên cấp!
          </p>
          <button className="btn btn--primary" onClick={() => setAdding(true)}>
            + Tạo vùng đất đầu tiên
          </button>
        </div>
      ) : (
        <div className="subject-grid">
          {state.subjects.map((s) => (
            <SubjectCard key={s.id} subject={s} onOpen={onOpenSubject} />
          ))}
        </div>
      )}

      {adding && <AddSubjectModal onClose={() => setAdding(false)} />}
    </section>
  )
}
