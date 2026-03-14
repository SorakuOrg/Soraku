const { ActivityType } = require("discord.js")

module.exports = {
  name: "ready",
  once: true,
  run: (client) => {
    const total = client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)
    client.logger.log(`${client.user.tag} online! ${client.guilds.cache.size} servers, ${total} users`, "ready")

    const acts = [
      { name: `${client.webUrl.replace("https://", "")} 🌐`, type: ActivityType.Streaming, url: client.webUrl },
      { name: "komunitas anime Indonesia 🇮🇩",               type: ActivityType.Watching },
      { name: `${client.prefix}help | /help`,                type: ActivityType.Listening },
      { name: "Soraku Community 空",                          type: ActivityType.Streaming, url: client.webUrl },
      { name: "anime, manga & vtuber bareng~",               type: ActivityType.Watching },
    ]

    let i = 0
    const rotate = () => {
      const act = acts[i % acts.length]
      client.user.setPresence({
        status: "online",
        activities: [{ name: act.name, type: act.type, ...(act.url ? { url: act.url } : {}) }],
      })
      i++
    }
    rotate()
    setInterval(rotate, 5 * 60 * 1000)
  },
}
