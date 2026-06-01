import { useState } from 'react'
import Modal from '../common/Modal'
import { useGame } from '../../context/GameContext'

const ICONS = ['📘', '🧮', '🧪', '🌍', '💻', '🎨', '🎸', '🗣️', '⚗️', '📜', '🩺', '🏋️']
const COLORS = ['#7c5cff', '#ff5c8a', '#ffb14e', '#34d399', '#38bdf8', '#f472b6', '#a78bfa', '#f5c518']

export default function AddSubjectModal({ onClose }) {
  const { actions } = useGame()
  const [name, setName] = useState('')
  const [icon, setIcon] = useState(ICONS[0])
  const [color, setColor] = useState(COLORS[0])
  const [description, setDescription] = useState('')
  const [goal, setGoal] = useState('')

  function submit(e) {
    e.preventDefault()
    if (!name.trim()) return
    actions.addSubject({ name, icon, color, description, goal })
    onClose()
  }

  return (
    <Modal title="🗺️ Khai phá vùng đất mới" onClose={onClose}>
      <form className="form" onSubmit={submit}>
        <label className="field">
          <span>Tên môn học *</span>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="VD: Tiếng Anh, Giải tích, Lịch sử..."
          />
        </label>

        <div className="field">
          <span>Biểu tượng</span>
          <div className="chip-row">
            {ICONS.map((ic) => (
              <button
                type="button"
                key={ic}
                className={`chip ${icon === ic ? 'chip--on' : ''}`}
                onClick={() => setIcon(ic)}
              >
                {ic}
              </button>
            ))}
          </div>
        </div>

        <div className="field">
          <span>Màu sắc</span>
          <div className="chip-row">
            {COLORS.map((c) => (
              <button
                type="button"
                key={c}
                className={`swatch ${color === c ? 'swatch--on' : ''}`}
                style={{ background: c }}
                onClick={() => setColor(c)}
                aria-label={c}
              />
            ))}
          </div>
        </div>

        <label className="field">
          <span>Mô tả (tuỳ chọn)</span>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Vài dòng về môn này..."
          />
        </label>

        <label className="field">
          <span>Mục tiêu (tuỳ chọn)</span>
          <input
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="VD: Đạt 7.0 IELTS, thi cuối kỳ..."
          />
        </label>

        <div className="form__actions">
          <button type="button" className="btn btn--ghost" onClick={onClose}>
            Huỷ
          </button>
          <button type="submit" className="btn btn--primary" disabled={!name.trim()}>
            Tạo vùng đất
          </button>
        </div>
      </form>
    </Modal>
  )
}
