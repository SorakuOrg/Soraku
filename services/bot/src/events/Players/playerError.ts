import type { SorakuClient } from "../../structures/SorakuClient"
module.exports = {
  name: "playerError",
  run: async (_client: SorakuClient, player: any, error: Error) => {
    console.error("[PLAYER]", player.guildId, error.message)
    const channel = _client.channels.cache.get(player.textId)
    if (channel && "send" in channel)
      await (channel as any).send({ embeds: [
        new (require("discord.js").EmbedBuilder)().setColor("#ef4444")
          .setDescription("❌ Error saat memutar lagu: "+error.message)
          .setFooter({ text: "Soraku Community" })
      ]}).catch(() => {})
  }
}