module.exports = {
  name: "ping", aliases: ["latency"], category: "Information",
  description: "Cek latency bot ke Discord", usage: "ping",
  execute: async (message, _args, client) => {
    const sent = await message.reply("🏓 Pinging...")
    const lat  = sent.createdTimestamp - message.createdTimestamp
    await sent.edit({ content: "", embeds: [
      client.embed().setTitle("🏓 Pong!")
        .addFields({ name: "📡 Pesan", value: `${lat}ms`, inline: true }, { name: "💓 WebSocket", value: `${client.ws.ping}ms`, inline: true })
        .setFooter({ text: "Soraku Community" }).setTimestamp()
    ]})
  },
}
