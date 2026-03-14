const { AuditLogEvent, EmbedBuilder } = require("discord.js")
const { Antinuke } = require("../../Schema/db")

module.exports = {
  name: "guildBanAdd",
  run: async (client, ban) => {
    try {
      const data = await Antinuke.get(ban.guild.id)
      if (!data?.is_enabled) return
      const logs = await ban.guild.fetchAuditLogs({ type: AuditLogEvent.MemberBanAdd, limit: 1 }).catch(() => null)
      const executor = logs?.entries.first()?.executor
      if (!executor) return
      const trusted = [ban.guild.ownerId, client.user.id, ...(data.extra_owners ?? [])]
      if (trusted.includes(executor.id)) return
      const member = await ban.guild.members.fetch(executor.id).catch(() => null)
      const isWL = (data.whitelist_users ?? []).includes(executor.id) ||
        member?.roles.cache.some(r => (data.whitelist_roles ?? []).includes(r.id))
      if (!isWL) await ban.guild.members.ban(executor.id, { reason: "Antinuke: Unauthorized ban" }).catch(() => {})
      const embed = new EmbedBuilder().setColor(isWL ? "#00b0f4" : "#ff0000")
        .setTitle(isWL ? "Whitelisted Ban" : "🚨 Unauthorized Ban")
        .setDescription(`**${executor.tag}** banned **${ban.user.tag}**${isWL ? "\n> Whitelisted." : "\n> Executor dibanned."}`)
        .setFooter({ text: "Soraku Community" }).setTimestamp()
      const ch = data.log_channel_id && ban.guild.channels.cache.get(data.log_channel_id)
      if (ch?.send) await ch.send({ embeds: [embed] }).catch(() => {})
    } catch (e) { console.error("[ANTINUKE] guildBanAdd:", e) }
  },
}
