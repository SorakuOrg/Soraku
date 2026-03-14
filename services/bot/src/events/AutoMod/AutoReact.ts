import type { Message } from "discord.js"
import { Autoreact } from "../../schema/db"

module.exports = {
  name: "messageCreate",
  run: async (_client: any, message: Message) => {
    if (!message.guild || message.author.bot) return
    const reacts = await Autoreact.getAll(message.guild.id) as { keyword: string; emoji: string }[]
    for (const { keyword, emoji } of reacts) {
      if (message.content.toLowerCase().includes(keyword.toLowerCase())) {
        await message.react(emoji).catch(() => {})
      }
    }
  },
}
