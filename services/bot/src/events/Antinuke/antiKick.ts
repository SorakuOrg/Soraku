import { EmbedBuilder, AuditLogEvent } from "discord.js"
import type { SorakuClient } from "../../structures/SorakuClient"
import { Antinuke } from "../../schema/db"
module.exports = {
  name: "guildMemberRemove",
  run: async (client: SorakuClient, member: any) => {
    if (member.user.bot) return
    try {
      const data = await Antinuke.get(member.guild.id) as any
      if (!data?.is_enabled) return
      const logs = await member.guild.fetchAuditLogs({ type: AuditLogEvent.MemberKick, limit: 1 }).catch(() => null)
      const entry = logs?.entries.first()
      if (!entry || Date.now() - entry.createdTimestamp > 3000) return
      const executor = entry.executor
      if (!executor) return
      const trusted = [member.guild.ownerId, client.user!.id, ...(data.extra_owners ?? [])]
      if (trusted.includes(executor.id)) return
      const exMember = await member.guild.members.fetch(executor.id).catch(() => null)
      const isWL = (data.whitelist_users ?? []).includes(executor.id) ||
        exMember?.roles.cache.some((r: any) => (data.whitelist_roles ?? []).includes(r.id))
      if (!isWL) await member.guild.members.ban(executor.id, { reason: "Antinuke: Unauthorized kick" }).catch(() => {})
      const embed = new EmbedBuilder().setColor(isWL ? "#00b0f4" : "#ff0000")
        .setTitle(isWL ? "Whitelisted Kick" : "🚨 Unauthorized Kick")
        .setDescription("**"+executor.tag+"** kicked **"+member.user.tag+"**"+(isWL?"\n> Whitelisted.":"\n> Executor dibanned."))
        .setFooter({ text: "Soraku Community" }).setTimestamp()
      const ch = data.log_channel_id && member.guild.channels.cache.get(data.log_channel_id)
      if (ch && "send" in ch) await (ch as any).send({ embeds: [embed] }).catch(() => {})
    } catch (e) { console.error("[ANTINUKE] guildMemberRemove:", e) }
  }
}