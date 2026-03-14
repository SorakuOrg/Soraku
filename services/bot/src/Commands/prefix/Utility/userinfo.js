module.exports = {
  name: "userinfo", aliases: ["ui", "whois"], category: "Utility",
  description: "Info detail user Discord", usage: "userinfo [@user]",
  execute: async (message, _args, client) => {
    const t     = message.mentions.members?.first() ?? message.member
    const roles = t.roles.cache.filter(r => r.id !== message.guild.id)
      .sort((a, b) => b.position - a.position).map(r => r.toString()).slice(0, 5)
    await message.reply({ embeds: [
      client.embed()
        .setAuthor({ name: t.user.tag, iconURL: t.user.displayAvatarURL() })
        .setThumbnail(t.user.displayAvatarURL({ size: 256 }))
        .addFields(
          { name: "🆔 ID",     value: `\`${t.user.id}\``,                          inline: true },
          { name: "🤖 Bot",    value: t.user.bot ? "Ya" : "Tidak",                   inline: true },
          { name: "📅 Akun",   value: `<t:${Math.floor(t.user.createdTimestamp/1000)}:D>`, inline: true },
          { name: "📥 Join",   value: `<t:${Math.floor(t.joinedTimestamp/1000)}:D>`, inline: true },
          { name: "🎭 Roles",  value: roles.length ? roles.join(", ") : "Tidak ada", inline: false },
        )
        .setFooter({ text: "Soraku Community" }).setTimestamp()
    ]})
  },
}
