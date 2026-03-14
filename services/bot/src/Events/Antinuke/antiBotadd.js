const { AuditLogEvent, EmbedBuilder } = require("discord.js")
const { Antinuke } = require("../../Schema/db")

module.exports = {
  name: "guildMemberAdd",
  run: async (client, member) => {
    if (!member.user.bot) return
    try {
      const data = await Antinuke.get(member.guild.id)
      if (!data?.is_enabled) return
      const logs = await member.guild.fetchAuditLogs({ type: AuditLogEvent.BotAdd, limit: 1 }).catch(() => null)
      const executor = logs?.entries.first()?.executor
      if (!executor) return
      const trusted = [member.guild.ownerId, client.user.id, ...(data.extra_owners ?? [])]
      if (trusted.includes(executor.id)) return
      const exMember = await member.guild.members.fetch(executor.id).catch(() => null)
      const isWL = (data.whitelist_users ?? []).includes(executor.id) ||
        exMember?.roles.cache.some(r => (data.whitelist_roles ?? []).includes(r.id))
      if (!isWL) {
        await member.kick("Antinuke: Unauthorized bot addition").catch(() => {})
        await member.guild.members.ban(executor.id, { reason: "Antinuke: Unauthorized bot addition" }).catch(() => {})
      }
      const embed = new EmbedBuilder().setColor(isWL ? "#00b0f4" : "#ff0000")
        .setTitle(isWL ? "Whitelisted Bot Add" : "🚨 Unauthorized Bot Add")
        .setDescription(`**${executor.tag}** menambahkan **${member.user.tag}**${isWL ? "\n> Whitelisted." : "\n> Bot dikick, executor dibanned."}`)
        .setFooter({ text: "Soraku Community" }).setTimestamp()
      const ch = data.log_channel_id && member.guild.channels.cache.get(data.log_channel_id)
      if (ch?.send) await ch.send({ embeds: [embed] }).catch(() => {})
    } catch (e) { console.error("[ANTINUKE] guildMemberAdd:", e) }
  },
}
