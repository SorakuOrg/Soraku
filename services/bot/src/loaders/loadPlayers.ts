import type { SorakuClient } from "../structures/SorakuClient"
import { readdirSync } from "fs"
import { join } from "path"

export default function loadPlayers(client: SorakuClient) {
  if (!client.manager) return
  const base = join(__dirname, "../events/Players")
  let total = 0
  for (const file of readdirSync(base).filter(f => f.endsWith(".js"))) {
    const event = require(join(base, file))
    if (!event?.name) continue
    client.manager.on(event.name, (...args: unknown[]) => event.run(client, ...args))
    total++
  }
  console.log(`[bot] ✓ ${total} player events loaded`)
}
