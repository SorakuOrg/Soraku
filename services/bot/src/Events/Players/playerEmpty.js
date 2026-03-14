const { Music247 } = require("../../Schema/db")

module.exports = {
  name: "playerEmpty",
  run: async (_client, player) => {
    const cfg = await Music247.get(player.guildId)
    if (cfg) return
    await player.destroy()
  },
}
