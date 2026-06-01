// Date helpers. We key activity by local calendar day "YYYY-MM-DD".

export function todayKey(d = new Date()) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function dateFromKey(key) {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

// Whole-day difference: dayDiff('2026-06-01', '2026-06-03') === 2
export function dayDiff(fromKey, toKey) {
  const a = dateFromKey(fromKey)
  const b = dateFromKey(toKey)
  return Math.round((b - a) / (1000 * 60 * 60 * 24))
}

// Returns the last `days` day-keys ending today (oldest first).
export function lastNDays(days, end = new Date()) {
  const out = []
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(end)
    d.setDate(end.getDate() - i)
    out.push(todayKey(d))
  }
  return out
}
