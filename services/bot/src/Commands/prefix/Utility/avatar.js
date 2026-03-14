const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")

module.exports = {
  name: "avatar", aliases: ["av", "pfp", "pp"], category: "Utility",
  description: "Lihat avatar user", usage: "avatar [@user]",
  execute: async (message, _args, client) => {
    const t   = message.mentions.users.first() ?? message.author
    const url = t.displayAvatarURL({ size: 1024 })
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setLabel("Buka di Browser").setStyle(ButtonStyle.Link).setURL(url)
    )
    await message.reply({ embeds: [
      client.embed().setTitle(`🖼️ Avatar — ${t.username}`)
        .setImage(url).setFooter({ text: "Soraku Community" }).setTimestamp()
    ], components: [row] })
  },
}
