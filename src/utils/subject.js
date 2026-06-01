import { getLevelInfo, XP_PER_LESSON } from './leveling'

// Derive progress / level stats for a single subject from its lessons.
export function subjectStats(subject) {
  const total = subject.lessons.length
  const done = subject.lessons.filter((l) => l.done).length
  const xp = done * XP_PER_LESSON
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
