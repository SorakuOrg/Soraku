import type { SorakuClient } from "../../structures/SorakuClient"
import { Music247 } from "../../schema/db"
module.exports = {
  name: "playerEmpty",
  run: async (_client: SorakuClient, player: any) => {
    const cfg247 = await Music247.get(player.guildId) as any
    if (cfg247) return // 24/7 mode — jangan destroy
    await player.destroy()
  }
}