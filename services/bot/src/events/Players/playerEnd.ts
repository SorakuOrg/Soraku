import type { SorakuClient } from "../../structures/SorakuClient"
module.exports = {
  name: "playerEnd",
  run: async (_client: SorakuClient, player: any) => {
    const msg = player.data.get("message")
    if (msg) await msg.edit({ components: [] }).catch(() => {})
    player.data.delete("message")
  }
}