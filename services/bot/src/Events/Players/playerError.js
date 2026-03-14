const { EmbedBuilder } = require("discord.js")

module.exports = {
  name: "playerError",
  run: async (client, player, error) => {
    console.error("[PLAYER]", player.guildId, error.message)
    const ch = client.channels.cache.get(player.textId)
    if (ch?.send) await ch.send({ embeds: [
      new EmbedBuilder().setColor("#ef4444")
        .setDescription("❌ Error: " + error.message)
        .setFooter({ text: "Soraku Community" })
    ]}).catch(() => {})
  },
}
