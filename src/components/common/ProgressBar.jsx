export default function ProgressBar({ value, color = '#7c5cff', height = 10 }) {
  const pct = Math.max(0, Math.min(1, value)) * 100
  return (
    <div className="progress" style={{ height }}>
      <div
        className="progress__fill"
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  )
}
