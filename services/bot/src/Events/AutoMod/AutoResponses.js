const { Autorespond } = require("../../Schema/db")

module.exports = {
  name: "messageCreate",
  run: async (_client, message) => {
    if (!message.guild || message.author.bot) return
    const responses = await Autorespond.getAll(message.guild.id)
    for (const { trigger, response } of responses) {
      if (message.content.toLowerCase().includes(trigger.toLowerCase())) {
        await message.reply(response).catch(() => {})
        break
      }
    }
  },
}
