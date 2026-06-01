// Gamified XP rules. The XP earned for completing a lesson is:
//
//   xp = round( baseXP(độ khó) × hệ số streak × hệ số combo )
//
// so the same lesson is worth more when you're on a hot streak and chaining
// completions in one sitting — that's what makes it feel like a game.

// --- Độ khó -----------------------------------------------------------------
export const DIFFICULTIES = {
  normal: { id: 'normal', label: 'Thường', icon: '🟢', baseXP: 10 },
  hard: { id: 'hard', label: 'Khó', icon: '🔶', baseXP: 25 },
  boss: { id: 'boss', label: 'Boss', icon: '🐲', baseXP: 60 },
}

export const DIFFICULTY_LIST = [
  DIFFICULTIES.normal,
  DIFFICULTIES.hard,
  DIFFICULTIES.boss,
]

export function difficultyOf(id) {
  return DIFFICULTIES[id] || DIFFICULTIES.normal
}

// --- Hệ số streak -----------------------------------------------------------
// Chuỗi ngày học càng dài, mọi bài học càng đáng giá.
export function streakMultiplier(streak) {
  if (streak >= 30) return 2
  if (streak >= 14) return 1.75
  if (streak >= 7) return 1.5
  if (streak >= 3) return 1.25
  return 1
}

// --- Combo trong phiên ------------------------------------------------------
// Hoàn thành các bài liên tiếp trong khoảng COMBO_WINDOW_MS sẽ nâng combo,
// mỗi bậc combo cộng thêm COMBO_STEP (tối đa COMBO_CAP bậc).
export const COMBO_WINDOW_MS = 10 * 60 * 1000 // 10 phút
const COMBO_STEP = 0.15
const COMBO_CAP = 8

// combo: số bài đã chuỗi (1 = bài mở màn, chưa có thưởng).
export function comboMultiplier(combo) {
  const bonusSteps = Math.min(Math.max(combo - 1, 0), COMBO_CAP)
  return 1 + bonusSteps * COMBO_STEP
}

// Combo còn "nóng" nếu bài gần nhất nằm trong cửa sổ thời gian.
export function isComboHot(lastCompletionAt, now = Date.now()) {
  return !!lastCompletionAt && now - lastCompletionAt <= COMBO_WINDOW_MS
}

// Tính combo kế tiếp khi vừa hoàn thành một bài.
export function nextCombo(prevCombo, lastCompletionAt, now = Date.now()) {
  return isComboHot(lastCompletionAt, now) ? prevCombo + 1 : 1
}

// --- Tổng hợp ---------------------------------------------------------------
// Trả về { xp, base, streakMult, comboMult } để vừa cộng XP vừa hiện chi tiết.
export function computeXP({ difficultyId, streak, combo }) {
  const base = difficultyOf(difficultyId).baseXP
  const sMult = streakMultiplier(streak)
  const cMult = comboMultiplier(combo)
  return {
    xp: Math.round(base * sMult * cMult),
    base,
    streakMult: sMult,
    comboMult: cMult,
  }
}
