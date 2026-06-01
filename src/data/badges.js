// Badge / achievement definitions. Each badge has a `check(state)` predicate
// evaluated after every state change. Once unlocked, a badge stays unlocked.

function completedLessons(state) {
  return state.subjects.reduce(
    (n, s) => n + s.lessons.filter((l) => l.done).length,
    0
  )
}

function fullyCompletedSubjects(state) {
  return state.subjects.filter(
    (s) => s.lessons.length > 0 && s.lessons.every((l) => l.done)
  ).length
}

export const BADGES = [
  {
    id: 'first-subject',
    icon: '🗺️',
    name: 'Tân Binh',
    desc: 'Thêm vùng đất (môn học) đầu tiên.',
    check: (s) => s.subjects.length >= 1,
  },
  {
    id: 'first-lesson',
    icon: '⚔️',
    name: 'Nhát Chém Đầu Tiên',
    desc: 'Hoàn thành bài học đầu tiên.',
    check: (s) => completedLessons(s) >= 1,
  },
  {
    id: 'ten-lessons',
    icon: '📚',
    name: 'Ham Học',
    desc: 'Hoàn thành 10 bài học.',
    check: (s) => completedLessons(s) >= 10,
  },
  {
    id: 'fifty-lessons',
    icon: '🧠',
    name: 'Bộ Óc Thép',
    desc: 'Hoàn thành 50 bài học.',
    check: (s) => completedLessons(s) >= 50,
  },
  {
    id: 'streak-3',
    icon: '✨',
    name: 'Nhen Nhóm',
    desc: 'Học liên tục 3 ngày.',
    check: (s) => s.hero.streak >= 3,
  },
  {
    id: 'streak-7',
    icon: '🔥',
    name: 'Lửa Bền',
    desc: 'Học liên tục 7 ngày.',
    check: (s) => s.hero.streak >= 7,
  },
  {
    id: 'streak-30',
    icon: '🌋',
    name: 'Ngọn Lửa Bất Diệt',
    desc: 'Học liên tục 30 ngày.',
    check: (s) => s.hero.streak >= 30,
  },
  {
    id: 'complete-subject',
    icon: '🏆',
    name: 'Bậc Thầy',
    desc: 'Chinh phục trọn vẹn một môn học.',
    check: (s) => fullyCompletedSubjects(s) >= 1,
  },
  {
    id: 'three-subjects',
    icon: '👑',
    name: 'Vua Tri Thức',
    desc: 'Chinh phục trọn vẹn 3 môn học.',
    check: (s) => fullyCompletedSubjects(s) >= 3,
  },
  {
    id: 'level-10',
    icon: '🐉',
    name: 'Thợ Săn Rồng',
    desc: 'Đạt tổng cấp độ 10.',
    check: (s, levelInfo) => levelInfo.level >= 10,
  },
]
