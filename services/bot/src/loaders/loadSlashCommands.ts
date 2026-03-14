import { readdirSync } from "fs"
import { join } from "path"
import type { SorakuClient } from "../structures/SorakuClient"

export default function loadSlashCommands(client: SorakuClient) {
  const base = join(__dirname, "../slashCommands")
  let total = 0
  for (const category of readdirSync(base)) {
    const files = readdirSync(join(base, category)).filter(f => f.endsWith(".js"))
    for (const file of files) {
      const cmd = require(join(base, category, file))
      if (!cmd.name || !cmd.description) continue
      client.slashCommands.set(cmd.name, cmd)
      total++
    }
  }
  console.log(`[bot] ✓ ${total} slash commands loaded`)
}
