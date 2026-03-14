function convertTime(ms) {
  if (!ms || isNaN(ms)) return "0:00"
  const s = Math.floor(ms / 1000)
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`
  return `${m}:${String(sec).padStart(2, "0")}`
}

function formatNumber(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M"
  if (n >= 1_000)     return (n / 1_000).toFixed(1) + "K"
  return String(n)
}

function progressbar(current, total, size = 15) {
  const pct    = Math.min(current / total, 1)
  const filled = Math.round(size * pct)
  return "[" + "▓".repeat(filled) + "░".repeat(size - filled) + "]"
}

module.exports = { convertTime, formatNumber, progressbar }
