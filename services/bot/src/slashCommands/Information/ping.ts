module.exports = {
  name: "ping", description: "Cek latency bot 🏓",
  execute: async (interaction: any, client: any) => {
    const sent = await interaction.reply({ content: "🏓 Pinging...", fetchReply: true })
    const lat  = sent.createdTimestamp - interaction.createdTimestamp
    await interaction.editReply({ content: "", embeds: [
      client.embed().setTitle("🏓 Pong!")
        .addFields({ name: "📡 Pesan", value: `${lat}ms`, inline: true }, { name: "💓 WS", value: `${client.ws.ping}ms`, inline: true })
        .setFooter({ text: "Soraku Community" }).setTimestamp(),
    ]})
  },
}
