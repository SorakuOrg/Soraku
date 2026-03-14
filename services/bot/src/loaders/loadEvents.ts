import { readdirSync, statSync } from "fs"
import { join } from "path"
import type { SorakuClient } from "../structures/SorakuClient"

export default function loadEvents(client: SorakuClient) {
  const base = join(__dirname, "../events")
  let total = 0

  for (const category of readdirSync(base)) {
    const catPath = join(base, category)
    if (!statSync(catPath).isDirectory()) continue
    for (const file of readdirSync(catPath).filter(f => f.endsWith(".js"))) {
      const event = require(join(catPath, file))
      if (!event?.name || event.name.startsWith("_")) continue
      // Support multiple events dengan nama sama (messageCreate dari AutoMod dll)
      if (event.once) client.once(event.name, (...args) => event.run(client, ...args))
      else            client.on(event.name,   (...args) => event.run(client, ...args))
      total++
    }
  }

  console.log(`[bot] ✓ ${total} events loaded`)
}
