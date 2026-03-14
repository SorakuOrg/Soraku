module.exports = {
  name: "playerEnd",
  run: async (_client, player) => {
    const msg = player.data.get("message")
    if (msg) await msg.edit({ components: [] }).catch(() => {})
    player.data.delete("message")
  },
}
