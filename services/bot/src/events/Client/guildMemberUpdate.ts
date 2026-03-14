import type { GuildMember, PartialGuildMember } from "discord.js"
import type { SorakuClient } from "../../structures/SorakuClient"
import { SorakuUser } from "../../schema/db"

const ROLE_IDS = {
  DONATUR: process.env.ROLE_DONATUR,
  VIP:     process.env.ROLE_VIP,
  VVIP:    process.env.ROLE_VVIP,
}

module.exports = {
  name: "guildMemberUpdate",
  run: async (_client: SorakuClient, oldMember: GuildMember | PartialGuildMember, newMember: GuildMember) => {
    const oldRoles = [...(oldMember.roles?.cache?.keys() ?? [])]
    const newRoles = [...newMember.roles.cache.keys()]
    const changed = oldRoles.length !== newRoles.length || newRoles.some(r => !oldRoles.includes(r))
    if (!changed) return

    // Sync supporter tier ke Supabase soraku.users
    let tier: string | null = null
    if (ROLE_IDS.VVIP && newRoles.includes(ROLE_IDS.VVIP))        tier = "VVIP"
    else if (ROLE_IDS.VIP && newRoles.includes(ROLE_IDS.VIP))     tier = "VIP"
    else if (ROLE_IDS.DONATUR && newRoles.includes(ROLE_IDS.DONATUR)) tier = "DONATUR"

    await SorakuUser.syncRole(newMember.user.id, tier).catch(console.error)
    console.log(`[bot] role-sync: ${newMember.user.tag} → ${tier ?? "none"}`)
  },
}
