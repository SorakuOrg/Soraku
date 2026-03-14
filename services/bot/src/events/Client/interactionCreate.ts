import type { SorakuClient } from "../../structures/SorakuClient"
import type { ChatInputCommandInteraction } from "discord.js"

module.exports = {
  name: "interactionCreate",
  run: async (client: SorakuClient, interaction: ChatInputCommandInteraction) => {
    if (!interaction.isChatInputCommand()) return
    const command = client.slashCommands.get(interaction.commandName)
    if (!command) return
    try {
      await command.execute(interaction, client)
    } catch (err) {
      console.error(`[bot] ❌ Slash error: /${interaction.commandName}`, err)
      const msg = { content: `${client.emoji.cross} Terjadi kesalahan.`, ephemeral: true }
      if (interaction.replied || interaction.deferred) await interaction.followUp(msg).catch(() => {})
      else await interaction.reply(msg).catch(() => {})
    }
  },
}
