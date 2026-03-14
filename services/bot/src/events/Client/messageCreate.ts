import { EmbedBuilder } from "discord.js"
import type { SorakuClient } from "../../structures/SorakuClient"
import { Guild, Blacklist, Noprefix, IgnoreChan, Afk } from "../../schema/db"

module.exports = {
  name: "messageCreate",
  run: async (client: SorakuClient, message: import("discord.js").Message) => {
    if (message.author.bot || !message.guild) return

    // ── AFK mention check ─────────────────────────────────────
    for (const mentioned of message.mentions.users.values()) {
      const afk = await Afk.get(message.guild.id, mentioned.id)
      if (afk) {
        const afkData = afk as { reason?: string; since?: string }
        await message.reply({
          embeds: [
            client.embed()
              .setDescription(`${client.emoji.warn} **${mentioned.username}** sedang AFK\n💬 **Alasan:** ${afkData.reason ?? "-"}\n🕐 Sejak: <t:${Math.floor(new Date(afkData.since ?? Date.now()).getTime() / 1000)}:R>`)
              .setFooter({ text: "Soraku Community" }),
          ],
        }).catch(() => {})
      }
    }

    // ── AFK self-remove ───────────────────────────────────────
    const selfAfk = await Afk.get(message.guild.id, message.author.id)
    if (selfAfk) {
      await Afk.remove(message.guild.id, message.author.id)
      const m = await message.reply({ embeds: [
        client.embed().setDescription(`✅ Selamat datang kembali **${message.author.username}**! AFK dihapus.`)
          .setFooter({ text: "Soraku Community" }),
      ]})
      setTimeout(() => m.delete().catch(() => {}), 5000)
    }

    // ── Blacklist check ───────────────────────────────────────
    const bl = await Blacklist.get(message.author.id)
    if (bl) return

    // ── Prefix resolution ─────────────────────────────────────
    let prefix = client.prefix
    const guildData = await Guild.get(message.guild.id) as { prefix?: string } | null
    if (guildData?.prefix) prefix = guildData.prefix

    // ── Noprefix check ────────────────────────────────────────
    const nop = await Noprefix.get(message.author.id) as { expires_at?: string } | null
    const hasNoprefix = nop && (!nop.expires_at || new Date(nop.expires_at) > new Date())

    const mention = new RegExp(`^<@!?${client.user!.id}>( |)$`)
    if (message.content.match(mention)) {
      return message.reply({ embeds: [
        client.embed()
          .setDescription(`👋 Halo! Prefix saya: \`${prefix}\`\nKetik \`${prefix}help\` untuk daftar command.`)
          .setFooter({ text: "Soraku Community" }),
      ]})
    }

    // ── Ignore channel ────────────────────────────────────────
    const ignored = await IgnoreChan.getAll(message.guild.id) as { channel_id: string }[]
    if (ignored.some(r => r.channel_id === message.channelId)) return

    // ── Command parse ─────────────────────────────────────────
    const startsWithPrefix = message.content.startsWith(prefix)
    if (!startsWithPrefix && !hasNoprefix) return

    const content = startsWithPrefix
      ? message.content.slice(prefix.length).trim()
      : message.content.trim()

    const args    = content.split(/\s+/)
    const cmdName = args.shift()?.toLowerCase()
    if (!cmdName) return

    const command = client.commands.get(cmdName) ?? client.aliases.get(cmdName)
    if (!command) return

    // Owner-only check
    if (command.owner && message.author.id !== client.ownerID) return

    // Cooldown
    if (command.cooldown) {
      const now     = Date.now()
      const cds     = client.cooldowns.get(command.name) ?? client.cooldowns.set(command.name, new Map<string, number>()).get(command.name)!
      const expire  = (cds.get(message.author.id) ?? 0) + command.cooldown * 1000
      if (now < expire) {
        const left = ((expire - now) / 1000).toFixed(1)
        return message.reply({ embeds: [
          client.embed().setDescription(`${client.emoji.warn} Tunggu **${left}s** sebelum pakai lagi \`${prefix}${command.name}\`.`)
            .setFooter({ text: "Soraku Community" }),
        ]})
      }
      cds.set(message.author.id, now)
    }

    // Execute
    try {
      await command.execute(message, args, client, prefix)
    } catch (err) {
      console.error(`[bot] ❌ Prefix cmd error: ${cmdName}`, err)
      await message.reply({ embeds: [
        client.embed().setDescription(`${client.emoji.cross} Terjadi kesalahan. Coba lagi.`)
          .setFooter({ text: "Soraku Community" }),
      ]}).catch(() => {})
    }
  },
}
