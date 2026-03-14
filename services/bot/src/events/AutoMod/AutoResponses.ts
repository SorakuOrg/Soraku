import type { Message } from "discord.js"
import { Autorespond } from "../../schema/db"

module.exports = {
  name: "messageCreate",
  run: async (_client: any, message: Message) => {
    if (!message.guild || message.author.bot) return
    const responses = await Autorespond.getAll(message.guild.id) as { trigger: string; response: string }[]
    for (const { trigger, response } of responses) {
      if (message.content.toLowerCase().includes(trigger.toLowerCase())) {
        await message.reply(response).catch(() => {})
        break
      }
    }
  },
}
