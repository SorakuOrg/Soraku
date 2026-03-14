import type { Message } from "discord.js"
import { PermissionFlagsBits } from "discord.js"
import { Antilink } from "../../schema/db"

const LINK_REGEX = /(discord\.gg|discord\.com\/invite|discordapp\.com\/invite)\/\S+/i

module.exports = {
  name: "messageCreate",
  run: async (_client: any, message: Message) => {
    if (!message.guild || message.author.bot) return
    if (!LINK_REGEX.test(message.content)) return
    const cfg = await Antilink.get(message.guild.id) as { is_enabled?: boolean; whitelist_users?: string[]; whitelist_roles?: string[] } | null
    if (!cfg?.is_enabled) return
    if (cfg.whitelist_users?.includes(message.author.id)) return
    const memberRoles = message.member?.roles.cache.map(r => r.id) ?? []
    if (cfg.whitelist_roles?.some(r => memberRoles.includes(r))) return
    if (message.member?.permissions.has(PermissionFlagsBits.ManageMessages)) return
    await message.delete().catch(() => {})
    const warn = await message.channel.send(`${message.author} ${(message.guild.client as any).emoji?.warn ?? "⚠️"} Link Discord tidak diizinkan di server ini.`)
    setTimeout(() => warn.delete().catch(() => {}), 5000)
  },
}
