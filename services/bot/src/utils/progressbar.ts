export function progressbar(current: number, total: number, size = 15): string {
  const pct  = Math.min(current / total, 1)
  const filled = Math.round(size * pct)
  const bar  = "▓".repeat(filled) + "░".repeat(size - filled)
  return `[${bar}]`
}
