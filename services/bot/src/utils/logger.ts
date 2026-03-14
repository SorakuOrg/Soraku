const COLORS: Record<string, string> = {
  ready: "\x1b[32m", cmd: "\x1b[36m", error: "\x1b[31m",
  warn:  "\x1b[33m", info: "\x1b[34m",
}

export function log(msg: string, type = "info") {
  const color = COLORS[type] ?? "\x1b[37m"
  const reset = "\x1b[0m"
  const ts    = new Date().toLocaleTimeString("id-ID")
  console.log(`${color}[${type.toUpperCase()}]${reset} ${ts} » ${msg}`)
}
