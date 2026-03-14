import { readdirSync } from "fs"
import { join } from "path"
import type { SorakuClient } from "../structures/SorakuClient"

export default function loadCommands(client: SorakuClient) {
  const base = join(__dirname, "../commands")
  let total = 0
  for (const category of readdirSync(base)) {
    const files = readdirSync(join(base, category)).filter(f => f.endsWith(".js"))
    for (const file of files) {
      const cmd = require(join(base, category, file))
      client.commands.set(cmd.name, cmd)
      if (cmd.aliases) for (const a of cmd.aliases) client.aliases.set(a, cmd)
      total++
    }
  }
  console.log(`[bot] ✓ ${total} prefix commands loaded`)
}
