const { Autoreact } = require("../../Schema/db")

module.exports = {
  name: "messageCreate",
  run: async (_client, message) => {
    if (!message.guild || message.author.bot) return
    const reacts = await Autoreact.getAll(message.guild.id)
    for (const { keyword, emoji } of reacts) {
      if (message.content.toLowerCase().includes(keyword.toLowerCase())) {
        await message.react(emoji).catch(() => {})
      }
    }
  },
}
