import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { BADGES } from '../data/badges'
import { getLevelInfo, XP_PER_LESSON } from '../utils/leveling'
import { dayDiff, todayKey } from '../utils/date'

const STORAGE_KEY = 'gamify-mylife:v1'

const DEFAULT_STATE = {
  hero: {
    name: 'Nhà Thám Hiểm',
    totalXP: 0,
    streak: 0,
    lastActiveDate: null, // "YYYY-MM-DD" of last day XP was earned
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

  // Register study activity for today: bump streak and log XP for the heatmap.
  function registerActivity(prev, xp) {
    const today = todayKey()
    const last = prev.hero.lastActiveDate
    let streak = prev.hero.streak

    if (last === today) {
      // already active today, keep streak
    } else if (last && dayDiff(last, today) === 1) {
      streak += 1
    } else {
      streak = 1
    }

    return {
      ...prev,
      hero: { ...prev.hero, streak, lastActiveDate: today },
      activityLog: {
        ...prev.activityLog,
        [today]: (prev.activityLog[today] || 0) + xp,
      },
    }
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

    addLesson(subjectId, title) {
      const t = (title || '').trim()
      if (!t) return
      setState((prev) => ({
        ...prev,
        subjects: prev.subjects.map((s) =>
          s.id === subjectId
            ? {
                ...s,
                lessons: [
                  ...s.lessons,
                  { id: uid('les'), title: t, done: false },
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
        let becameDone = false
        let xpDelta = 0

        const subjects = prev.subjects.map((s) => {
          if (s.id !== subjectId) return s
          return {
            ...s,
            lessons: s.lessons.map((l) => {
              if (l.id !== lessonId) return l
              const done = !l.done
              becameDone = done
              xpDelta = done ? XP_PER_LESSON : -XP_PER_LESSON
              return { ...l, done }
            }),
          }
        })

        const totalXP = Math.max(0, prev.hero.totalXP + xpDelta)
        let next = { ...prev, subjects, hero: { ...prev.hero, totalXP } }

        if (becameDone) {
          const beforeLevel = getLevelInfo(prev.hero.totalXP).level
          next = registerActivity(next, XP_PER_LESSON)
          const afterLevel = getLevelInfo(totalXP).level
          if (afterLevel > beforeLevel) {
            setCelebration({ type: 'level', level: afterLevel })
          }
        }
        return next
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
    XP_PER_LESSON,
  }

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used within a GameProvider')
  return ctx
}
