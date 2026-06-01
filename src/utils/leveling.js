// XP & Level math for the RPG learning system.
//
// The XP needed to advance FROM a given level grows linearly so that early
// levels feel quick and later ones feel earned.
//   level 1 -> 2 : 100 XP
//   level 2 -> 3 : 150 XP
//   level 3 -> 4 : 200 XP ... (i.e. 100 + 50 * (level - 1))

export function xpToAdvanceFrom(level) {
  return 100 + 50 * (level - 1)
}

// Given a total accumulated XP, return progress info.
// Returns: { level, xpIntoLevel, xpForNext, progress (0..1), totalXP }
export function getLevelInfo(totalXP) {
  let level = 1
  let remaining = Math.max(0, Math.floor(totalXP))

  while (remaining >= xpToAdvanceFrom(level)) {
    remaining -= xpToAdvanceFrom(level)
    level += 1
  }

  const xpForNext = xpToAdvanceFrom(level)
  return {
    level,
    xpIntoLevel: remaining,
    xpForNext,
    progress: xpForNext === 0 ? 0 : remaining / xpForNext,
    totalXP: Math.floor(totalXP),
  }
}

// A fun rank title derived from level, just for flavour.
export function getRankTitle(level) {
  if (level >= 30) return 'Huyền Thoại Sống'
  if (level >= 20) return 'Đại Hiền Triết'
  if (level >= 15) return 'Bậc Thầy Tri Thức'
  if (level >= 10) return 'Hiệp Sĩ Học Giả'
  if (level >= 6) return 'Nhà Thám Hiểm'
  if (level >= 3) return 'Học Đồ'
  return 'Tân Binh'
}
