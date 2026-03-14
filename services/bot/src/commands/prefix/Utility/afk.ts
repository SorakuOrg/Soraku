import type { Message } from "discord.js"
import { EmbedBuilder } from "discord.js"

// In-memory AFK store (reset saat bot restart — cukup untuk komunitas)
const afkMap = new Map<string, { reason: string; since: number }>()

export function getAfkMap() { return afkMap }

export default {
  name:        "afk",
  aliases:     ["away"],
  description: "Set status AFK — otomatis hilang saat kamu kirim pesan",
  category:    "Utility",
  usage:       "!afk [alasan]",

  async execute(message: Message, args: string[]) {
    const reason = args.join(" ") || "Tidak ada alasan"
    afkMap.set(message.author.id, { reason, since: Date.now() })

    const embed = new EmbedBuilder()
      .setColor(0xf59e0b)
      .setDescription(`✅ **${message.author.username}** kini AFK\n💬 **Alasan:** ${reason}`)
      .setFooter({ text: "Soraku Community" })
    await message.reply({ embeds: [embed] })
  },
}
