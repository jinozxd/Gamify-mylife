import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { BADGES } from '../data/badges'
import { getLevelInfo } from '../utils/leveling'
import { computeXP, difficultyOf, nextCombo } from '../utils/gamify'
import { dayDiff, todayKey } from '../utils/date'

const STORAGE_KEY = 'gamify-mylife:v1'

const DEFAULT_STATE = {
  hero: {
    name: 'Nhà Thám Hiểm',
    totalXP: 0,
    streak: 0,
    lastActiveDate: null, // "YYYY-MM-DD" of last day XP was earned
    combo: 0, // số bài đang chuỗi trong phiên
    lastCompletionAt: null, // timestamp ms của bài gần nhất (cho combo)
  },
  subjects: [],
  unlockedBadges: [], // array of badge ids
  activityLog: {}, // { "YYYY-MM-DD": xpEarnedThatDay }
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_STATE
    const parsed = JSON.parse(raw)
    // Shallow-merge so new fields in future versions don't break old saves.
    return {
      ...DEFAULT_STATE,
      ...parsed,
      hero: { ...DEFAULT_STATE.hero, ...(parsed.hero || {}) },
    }
  } catch {
    return DEFAULT_STATE
  }
}

let idCounter = 0
function uid(prefix = 'id') {
  idCounter += 1
  return `${prefix}-${Date.now().toString(36)}-${idCounter}`
}

const GameContext = createContext(null)

export function GameProvider({ children }) {
  const [state, setState] = useState(loadState)
  // Transient celebration banners (level up / new badges).
  const [celebration, setCelebration] = useState(null)
  // Transient "+XP" toast with the breakdown of the last reward.
  const [xpToast, setXpToast] = useState(null)

  // Persist on every change.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* ignore quota errors */
    }
  }, [state])

  const levelInfo = useMemo(() => getLevelInfo(state.hero.totalXP), [
    state.hero.totalXP,
  ])

  // Re-evaluate badges whenever the relevant state changes, and surface any
  // newly unlocked ones as a celebration.
  useEffect(() => {
    const newly = BADGES.filter(
      (b) => !state.unlockedBadges.includes(b.id) && b.check(state, levelInfo)
    ).map((b) => b.id)

    if (newly.length > 0) {
      setState((prev) => ({
        ...prev,
        unlockedBadges: [...prev.unlockedBadges, ...newly],
      }))
      const first = BADGES.find((b) => b.id === newly[0])
      setCelebration({ type: 'badge', badge: first, count: newly.length })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.subjects, state.hero.streak, state.hero.totalXP])

  // --- Helpers -------------------------------------------------------------

  // The streak value AFTER counting study activity on `today`.
  function streakAfter(prevHero, today) {
    const last = prevHero.lastActiveDate
    if (last === today) return prevHero.streak // already active today
    if (last && dayDiff(last, today) === 1) return prevHero.streak + 1
    return 1
  }

  // --- Actions -------------------------------------------------------------

  const actions = {
    setHeroName(name) {
      setState((prev) => ({ ...prev, hero: { ...prev.hero, name } }))
    },

    addSubject({ name, icon, color, description, goal }) {
      const subject = {
        id: uid('subj'),
        name: name.trim() || 'Môn mới',
        icon: icon || '📘',
        color: color || '#7c5cff',
        description: description || '',
        goal: goal || '',
        createdAt: todayKey(),
        lessons: [],
      }
      setState((prev) => ({ ...prev, subjects: [...prev.subjects, subject] }))
      return subject.id
    },

    updateSubject(id, patch) {
      setState((prev) => ({
        ...prev,
        subjects: prev.subjects.map((s) =>
          s.id === id ? { ...s, ...patch } : s
        ),
      }))
    },

    deleteSubject(id) {
      setState((prev) => ({
        ...prev,
        subjects: prev.subjects.filter((s) => s.id !== id),
      }))
    },

    addLesson(subjectId, title, difficulty = 'normal') {
      const t = (title || '').trim()
      if (!t) return
      const diff = difficultyOf(difficulty).id
      setState((prev) => ({
        ...prev,
        subjects: prev.subjects.map((s) =>
          s.id === subjectId
            ? {
                ...s,
                lessons: [
                  ...s.lessons,
                  {
                    id: uid('les'),
                    title: t,
                    done: false,
                    difficulty: diff,
                    xpAwarded: 0,
                  },
                ],
              }
            : s
        ),
      }))
    },

    deleteLesson(subjectId, lessonId) {
      setState((prev) => ({
        ...prev,
        subjects: prev.subjects.map((s) =>
          s.id === subjectId
            ? { ...s, lessons: s.lessons.filter((l) => l.id !== lessonId) }
            : s
        ),
      }))
    },

    toggleLesson(subjectId, lessonId) {
      setState((prev) => {
        const lesson = prev.subjects
          .find((s) => s.id === subjectId)
          ?.lessons.find((l) => l.id === lessonId)
        if (!lesson) return prev

        const becameDone = !lesson.done
        const today = todayKey()
        const now = Date.now()

        // --- Marking DONE: compute streak → combo → bonused XP -------------
        if (becameDone) {
          const streak = streakAfter(prev.hero, today)
          const combo = nextCombo(prev.hero.combo, prev.hero.lastCompletionAt, now)
          const reward = computeXP({
            difficultyId: lesson.difficulty,
            streak,
            combo,
          })

          const totalXP = prev.hero.totalXP + reward.xp
          const beforeLevel = getLevelInfo(prev.hero.totalXP).level
          const afterLevel = getLevelInfo(totalXP).level

          if (afterLevel > beforeLevel) {
            setCelebration({ type: 'level', level: afterLevel })
          }
          setXpToast({ ...reward, combo, streak, at: now })

          return {
            ...prev,
            subjects: prev.subjects.map((s) =>
              s.id !== subjectId
                ? s
                : {
                    ...s,
                    lessons: s.lessons.map((l) =>
                      l.id === lessonId
                        ? { ...l, done: true, xpAwarded: reward.xp }
                        : l
                    ),
                  }
            ),
            hero: {
              ...prev.hero,
              totalXP,
              streak,
              lastActiveDate: today,
              combo,
              lastCompletionAt: now,
            },
            activityLog: {
              ...prev.activityLog,
              [today]: (prev.activityLog[today] || 0) + reward.xp,
            },
          }
        }

        // --- Un-marking: refund exactly what this lesson granted ----------
        const refund = lesson.xpAwarded || difficultyOf(lesson.difficulty).baseXP
        return {
          ...prev,
          subjects: prev.subjects.map((s) =>
            s.id !== subjectId
              ? s
              : {
                  ...s,
                  lessons: s.lessons.map((l) =>
                    l.id === lessonId ? { ...l, done: false, xpAwarded: 0 } : l
                  ),
                }
          ),
          hero: {
            ...prev.hero,
            totalXP: Math.max(0, prev.hero.totalXP - refund),
          },
        }
      })
    },

    resetAll() {
      setState(DEFAULT_STATE)
    },
  }

  const value = {
    state,
    levelInfo,
    actions,
    badges: BADGES,
    celebration,
    dismissCelebration: () => setCelebration(null),
    xpToast,
    dismissXpToast: () => setXpToast(null),
  }

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used within a GameProvider')
  return ctx
}
