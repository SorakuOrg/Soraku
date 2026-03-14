module.exports = {
  name: "serverinfo", aliases: ["si", "guild"], category: "Utility",
  description: "Info detail server Discord", usage: "serverinfo",
  execute: async (message, _args, client) => {
    const g     = message.guild
    const owner = await g.fetchOwner()
    const text  = g.channels.cache.filter(c => c.type === 0).size
    const voice = g.channels.cache.filter(c => c.type === 2).size
    const embed = client.embed().setTitle(`🏠 ${g.name}`).setThumbnail(g.iconURL())
      .addFields(
        { name: "👑 Owner",    value: owner.user.tag,                           inline: true },
        { name: "👥 Member",   value: g.memberCount.toLocaleString("id-ID"),    inline: true },
        { name: "🎭 Role",     value: String(g.roles.cache.size),               inline: true },
        { name: "💬 Text",     value: String(text),                             inline: true },
        { name: "🔊 Voice",    value: String(voice),                            inline: true },
        { name: "😀 Emoji",    value: String(g.emojis.cache.size),              inline: true },
        { name: "📅 Dibuat",   value: `<t:${Math.floor(g.createdTimestamp/1000)}:D>`, inline: true },
        { name: "🆔 ID",       value: `\`${g.id}\``,                          inline: true },
      )
      .setFooter({ text: "Soraku Community" }).setTimestamp()
    if (g.bannerURL()) embed.setImage(g.bannerURL({ size: 1024 }))
    await message.reply({ embeds: [embed] })
  },
}
