import type { GuildMember } from "discord.js"
import type { SorakuClient } from "../../structures/SorakuClient"
import { Welcome, Autorole } from "../../schema/db"

module.exports = {
  name: "guildMemberAdd",
  run: async (client: SorakuClient, member: GuildMember) => {
    // Autorole
    const ar = await Autorole.get(member.guild.id) as { human_roles?: string[]; bot_roles?: string[] } | null
    if (ar) {
      const roles = member.user.bot ? (ar.bot_roles ?? []) : (ar.human_roles ?? [])
      for (const roleId of roles) {
        await member.roles.add(roleId).catch(() => {})
      }
    }

    // Welcome
    const w = await Welcome.get(member.guild.id) as {
      is_enabled?: boolean; channel_id?: string; content?: string
      embed_title?: string; embed_desc?: string; embed_color?: string
      embed_image?: string; embed_thumb?: string; embed_footer?: string
      auto_del?: number
    } | null
    if (!w?.is_enabled || !w.channel_id) return

    const channel = member.guild.channels.cache.get(w.channel_id)
    if (!channel || !("send" in channel)) return

    const replace = (s: string) => s
      .replace(/{user}/g, member.user.toString())
      .replace(/{username}/g, member.user.username)
      .replace(/{server}/g, member.guild.name)
      .replace(/{count}/g, member.guild.memberCount.toString())

    const { EmbedBuilder } = await import("discord.js")
    const embed = new EmbedBuilder().setColor((w.embed_color ?? "#7c3aed") as import("discord.js").ColorResolvable)
    if (w.embed_title)  embed.setTitle(replace(w.embed_title))
    if (w.embed_desc)   embed.setDescription(replace(w.embed_desc))
    if (w.embed_image)  embed.setImage(w.embed_image === "{server_icon}" ? member.guild.iconURL() : w.embed_image)
    if (w.embed_thumb)  embed.setThumbnail(w.embed_thumb === "{avatar}" ? member.user.displayAvatarURL() : w.embed_thumb)
    if (w.embed_footer) embed.setFooter({ text: replace(w.embed_footer) })
    embed.setFooter({ text: "Soraku Community" })

    const opts: { content?: string; embeds: typeof embed[] } = { embeds: [embed] }
    if (w.content) opts.content = replace(w.content)

    const msg = await (channel as { send: (o: typeof opts) => Promise<{ delete: () => Promise<void> }> }).send(opts).catch(() => null)
    if (msg && w.auto_del && w.auto_del > 0) {
      setTimeout(() => msg.delete().catch(() => {}), w.auto_del * 1000)
    }
  },
}
