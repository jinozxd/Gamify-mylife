import { useState } from 'react'
import { useGame } from './context/GameContext'
import HeroHub from './components/HeroHub/HeroHub'
import QuestMap from './components/Subjects/QuestMap'
import SubjectDetail from './components/Subjects/SubjectDetail'
import HallOfFame from './components/Badges/HallOfFame'
import Heatmap from './components/Heatmap/Heatmap'
import Celebration from './components/Celebration'
import XpToast from './components/XpToast'

const NAV = [
  { id: 'hub', label: 'Sảnh Chính', icon: '🏰' },
  { id: 'map', label: 'Bản Đồ Môn', icon: '🗺️' },
  { id: 'badges', label: 'Thành Tựu', icon: '🏆' },
]

export default function App() {
  const { actions } = useGame()
  const [view, setView] = useState('hub')
  const [openSubject, setOpenSubject] = useState(null)

  function openSubjectDetail(id) {
    setOpenSubject(id)
    setView('subject')
  }

  function go(id) {
    setOpenSubject(null)
    setView(id)
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand__star">✦</span>
          <div>
            <div className="brand__title">Gamify My Life</div>
            <div className="brand__sub">RPG Học Tập</div>
          </div>
        </div>

        <nav className="nav">
          {NAV.map((n) => (
            <button
              key={n.id}
              className={`nav__item ${
                view === n.id || (n.id === 'map' && view === 'subject')
                  ? 'nav__item--active'
                  : ''
              }`}
              onClick={() => go(n.id)}
            >
              <span className="nav__icon">{n.icon}</span>
              {n.label}
            </button>
          ))}
        </nav>

        <div className="sidebar__foot">
          <button
            className="reset-link"
            onClick={() => {
              if (window.confirm('Xoá toàn bộ tiến trình và bắt đầu lại?')) {
                actions.resetAll()
                go('hub')
              }
            }}
          >
            ⟲ Bắt đầu lại
          </button>
          <p className="muted tiny">Dữ liệu lưu ngay trên trình duyệt của bạn.</p>
        </div>
      </aside>

      <main className="content">
        {view === 'hub' && (
          <div className="stack">
            <HeroHub />
            <Heatmap />
          </div>
        )}

        {view === 'map' && <QuestMap onOpenSubject={openSubjectDetail} />}

        {view === 'subject' && (
          <SubjectDetail subjectId={openSubject} onBack={() => go('map')} />
        )}

        {view === 'badges' && <HallOfFame />}
      </main>

      <Celebration />
      <XpToast />
    </div>
  )
}
