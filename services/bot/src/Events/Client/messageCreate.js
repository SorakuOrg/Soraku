const { Guild, Blacklist, Noprefix, IgnoreChan, Afk } = require("../../Schema/db")

module.exports = {
  name: "messageCreate",
  run: async (client, message) => {
    if (message.author.bot || !message.guild) return

    // AFK mention check
    for (const user of message.mentions.users.values()) {
      const afk = await Afk.get(message.guild.id, user.id)
      if (afk) {
        await message.reply({ embeds: [
          client.embed()
            .setDescription(`${client.emoji.warn} **${user.username}** sedang AFK\n💬 **Alasan:** ${afk.reason ?? "-"}\n🕐 Sejak: <t:${Math.floor(new Date(afk.since ?? Date.now()).getTime()/1000)}:R>`)
            .setFooter({ text: "Soraku Community" })
        ]}).catch(() => {})
      }
    }

    // AFK self-remove
    const selfAfk = await Afk.get(message.guild.id, message.author.id)
    if (selfAfk) {
      await Afk.remove(message.guild.id, message.author.id)
      const m = await message.reply({ embeds: [client.embed().setDescription(`✅ Selamat datang kembali **${message.author.username}**! AFK dihapus.`).setFooter({ text: "Soraku Community" })] })
      setTimeout(() => m.delete().catch(() => {}), 5000)
    }

    // Blacklist
    const bl = await Blacklist.get(message.author.id)
    if (bl) return

    // Prefix
    let prefix = client.prefix
    const gData = await Guild.get(message.guild.id)
    if (gData?.prefix) prefix = gData.prefix

    // Noprefix
    const nop = await Noprefix.get(message.author.id)
    const hasNop = nop && (!nop.expires_at || new Date(nop.expires_at) > new Date())

    // Mention = show prefix
    const mention = new RegExp(`^<@!?${client.user.id}>( |)$`)
    if (message.content.match(mention)) {
      return message.reply({ embeds: [client.embed().setDescription(`👋 Halo! Prefix saya: \`${prefix}\`\nKetik \`${prefix}help\` untuk daftar command.`).setFooter({ text: "Soraku Community" })] })
    }

    // Ignore channel check
    const ignored = await IgnoreChan.getAll(message.guild.id)
    if (ignored.some(r => r.channel_id === message.channelId)) return

    const startsWithPrefix = message.content.startsWith(prefix)
    if (!startsWithPrefix && !hasNop) return

    const args    = message.content.slice(startsWithPrefix ? prefix.length : 0).trim().split(/\s+/)
    const cmdName = args.shift()?.toLowerCase()
    if (!cmdName) return

    const command = client.commands.get(cmdName) ?? client.aliases.get(cmdName)
    if (!command) return

    if (command.owner && message.author.id !== client.ownerID) return

    // Cooldown
    if (command.cooldown) {
      const now  = Date.now()
      if (!client.cooldowns.has(command.name)) client.cooldowns.set(command.name, new Map())
      const cds  = client.cooldowns.get(command.name)
      const exp  = (cds.get(message.author.id) ?? 0) + command.cooldown * 1000
      if (now < exp) {
        const left = ((exp - now) / 1000).toFixed(1)
        return message.reply({ embeds: [client.embed().setDescription(`${client.emoji.warn} Tunggu **${left}s** sebelum pakai lagi \`${prefix}${command.name}\`.`).setFooter({ text: "Soraku Community" })] })
      }
      cds.set(message.author.id, now)
    }

    try {
      await command.execute(message, args, client, prefix)
    } catch (err) {
      console.error(`[CMD] ${cmdName}`, err)
      await message.reply({ embeds: [client.embed().setDescription(`${client.emoji.cross} Terjadi kesalahan.`).setFooter({ text: "Soraku Community" })] }).catch(() => {})
    }
  },
}
