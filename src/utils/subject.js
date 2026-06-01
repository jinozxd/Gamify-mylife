import { getLevelInfo } from './leveling'
import { difficultyOf } from './gamify'

// Derive progress / level stats for a single subject from its lessons.
// Subject XP uses the *base* difficulty value (không tính bonus streak/combo)
// nên tiến trình của môn luôn ổn định, không dao động theo phong độ.
export function subjectStats(subject) {
  const total = subject.lessons.length
  const doneLessons = subject.lessons.filter((l) => l.done)
  const done = doneLessons.length
  const xp = doneLessons.reduce(
    (n, l) => n + difficultyOf(l.difficulty).baseXP,
    0
  )
  const progress = total === 0 ? 0 : done / total
  const completed = total > 0 && done === total
  return {
    total,
    done,
    xp,
    progress,
    completed,
    level: getLevelInfo(xp).level,
  }
}
