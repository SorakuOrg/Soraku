const COLORS = {
  ready: "\x1b[32m", cmd: "\x1b[36m", error: "\x1b[31m",
  warn:  "\x1b[33m", info: "\x1b[34m",
}
function log(msg, type = "info") {
  const color = COLORS[type] || "\x1b[37m"
  const ts = new Date().toLocaleTimeString("id-ID")
  console.log(`${color}[${type.toUpperCase()}]\x1b[0m ${ts} » ${msg}`)
}
module.exports = { log }
