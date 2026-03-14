const { Welcome, Autorole } = require("../../Schema/db")
const { EmbedBuilder } = require("discord.js")

module.exports = {
  name: "guildMemberAdd",
  run: async (client, member) => {
    // Autorole
    const ar = await Autorole.get(member.guild.id)
    if (ar) {
      const roles = member.user.bot ? (ar.bot_roles ?? []) : (ar.human_roles ?? [])
      for (const id of roles) await member.roles.add(id).catch(() => {})
    }

    // Welcome
    const w = await Welcome.get(member.guild.id)
    if (!w?.is_enabled || !w.channel_id) return
    const channel = member.guild.channels.cache.get(w.channel_id)
    if (!channel?.send) return

    const rep = s => s
      .replace(/{user}/g,    member.user.toString())
      .replace(/{username}/g, member.user.username)
      .replace(/{server}/g,  member.guild.name)
      .replace(/{count}/g,   member.guild.memberCount)

    const embed = new EmbedBuilder().setColor(w.embed_color ?? "#7c3aed")
    if (w.embed_title)  embed.setTitle(rep(w.embed_title))
    if (w.embed_desc)   embed.setDescription(rep(w.embed_desc))
    if (w.embed_image)  embed.setImage(w.embed_image === "{server_icon}" ? member.guild.iconURL() : w.embed_image)
    if (w.embed_thumb)  embed.setThumbnail(w.embed_thumb === "{avatar}" ? member.user.displayAvatarURL() : w.embed_thumb)
    embed.setFooter({ text: "Soraku Community" })

    const opts = { embeds: [embed] }
    if (w.content) opts.content = rep(w.content)

    const msg = await channel.send(opts).catch(() => null)
    if (msg && w.auto_del > 0) setTimeout(() => msg.delete().catch(() => {}), w.auto_del * 1000)
  },
}
