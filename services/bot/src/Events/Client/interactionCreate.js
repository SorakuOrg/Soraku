module.exports = {
  name: "interactionCreate",
  run: async (client, interaction) => {
    if (!interaction.isChatInputCommand()) return
    const command = client.slash.get(interaction.commandName)
    if (!command) return
    try {
      await command.execute(interaction, client)
    } catch (err) {
      console.error(`[SLASH] /${interaction.commandName}`, err)
      const msg = { content: `${client.emoji.cross} Terjadi kesalahan.`, ephemeral: true }
      if (interaction.replied || interaction.deferred) await interaction.followUp(msg).catch(() => {})
      else await interaction.reply(msg).catch(() => {})
    }
  },
}
