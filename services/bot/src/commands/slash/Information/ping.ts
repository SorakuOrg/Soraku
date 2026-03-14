import { SlashCommandBuilder, EmbedBuilder, type ChatInputCommandInteraction } from "discord.js"

export const slashPingCommand = {
  data: new SlashCommandBuilder().setName("ping").setDescription("Cek latency bot 🏓"),
  async execute(interaction: ChatInputCommandInteraction) {
    const sent = await interaction.reply({ content: "🏓 Pinging...", fetchReply: true })
    const latency = sent.createdTimestamp - interaction.createdTimestamp
    const embed = new EmbedBuilder()
      .setColor(0x7c3aed).setTitle("🏓 Pong!")
      .addFields(
        { name: "📡 Pesan",     value: `${latency}ms`, inline: true },
        { name: "💓 WebSocket", value: `${interaction.client.ws.ping}ms`, inline: true },
      )
      .setFooter({ text: "Soraku Community" }).setTimestamp()
    await interaction.editReply({ content: "", embeds: [embed] })
  },
}
