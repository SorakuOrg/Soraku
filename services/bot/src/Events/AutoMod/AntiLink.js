const { Antilink } = require("../../Schema/db")
const { PermissionFlagsBits } = require("discord.js")
const LINK_REGEX = /(discord\.gg|discord\.com\/invite|discordapp\.com\/invite)\/\S+/i

module.exports = {
  name: "messageCreate",
  run: async (client, message) => {
    if (!message.guild || message.author.bot) return
    if (!LINK_REGEX.test(message.content)) return
    const cfg = await Antilink.get(message.guild.id)
    if (!cfg?.is_enabled) return
    if ((cfg.whitelist_users ?? []).includes(message.author.id)) return
    const memberRoles = message.member?.roles.cache.map(r => r.id) ?? []
    if ((cfg.whitelist_roles ?? []).some(r => memberRoles.includes(r))) return
    if (message.member?.permissions.has(PermissionFlagsBits.ManageMessages)) return
    await message.delete().catch(() => {})
    const warn = await message.channel.send(`${message.author} ${client.emoji.warn} Link Discord tidak diizinkan!`)
    setTimeout(() => warn.delete().catch(() => {}), 5000)
  },
}
