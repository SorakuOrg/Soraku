const { SorakuUser } = require("../../Schema/db")

const ROLES = {
  DONATUR: process.env.ROLE_DONATUR,
  VIP:     process.env.ROLE_VIP,
  VVIP:    process.env.ROLE_VVIP,
}

module.exports = {
  name: "guildMemberUpdate",
  run: async (_client, oldMember, newMember) => {
    const oldR = [...(oldMember.roles?.cache?.keys() ?? [])]
    const newR = [...newMember.roles.cache.keys()]
    if (oldR.length === newR.length && newR.every(r => oldR.includes(r))) return

    let tier = null
    if (ROLES.VVIP && newR.includes(ROLES.VVIP))        tier = "VVIP"
    else if (ROLES.VIP && newR.includes(ROLES.VIP))     tier = "VIP"
    else if (ROLES.DONATUR && newR.includes(ROLES.DONATUR)) tier = "DONATUR"

    await SorakuUser.syncRole(newMember.user.id, tier).catch(console.error)
  },
}
