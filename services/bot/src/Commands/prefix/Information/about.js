const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")

module.exports = {
  name: "about", aliases: ["info", "botinfo"], category: "Information",
  description: "Info tentang SorakuBot dan Soraku Community", usage: "about",
  execute: async (message, _args, client) => {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setLabel("Website").setEmoji("🌐").setStyle(ButtonStyle.Link).setURL(client.webUrl),
      new ButtonBuilder().setLabel("Discord").setEmoji("💬").setStyle(ButtonStyle.Link).setURL(client.support),
    )
    await message.reply({ embeds: [
      client.embed().setTitle("🌸 SorakuBot")
        .setDescription("Bot resmi **Soraku Community** — komunitas anime, manga, VTuber & budaya Jepang Indonesia.")
        .setThumbnail(client.user.displayAvatarURL())
        .addFields(
          { name: "👥 Member",  value: message.guild.memberCount.toLocaleString("id-ID"), inline: true },
          { name: "📡 Ping",    value: `${client.ws.ping}ms`, inline: true },
          { name: "🏠 Server",  value: `${client.guilds.cache.size} server`, inline: true },
          { name: "🌐 Website", value: `[soraku.id](${client.webUrl})`, inline: true },
          { name: "👑 Owner",   value: "Riu", inline: true },
        )
        .setFooter({ text: "Soraku Community" }).setTimestamp()
    ], components: [row] })
  },
}
