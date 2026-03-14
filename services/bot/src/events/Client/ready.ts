import { ActivityType } from "discord.js"
import type { SorakuClient } from "../../structures/SorakuClient"

const ACTIVITIES = (webUrl: string) => [
  { name: `${webUrl.replace("https://", "")} 🌐`, type: ActivityType.Streaming, url: webUrl },
  { name: "komunitas anime Indonesia 🇮🇩",        type: ActivityType.Watching },
  { name: "!help | /help",                         type: ActivityType.Listening },
  { name: "Soraku Community 空",                    type: ActivityType.Streaming, url: webUrl },
  { name: "anime, manga & vtuber bareng~",          type: ActivityType.Watching },
]

module.exports = {
  name: "ready",
  once: true,
  run: async (client: SorakuClient) => {
    const total = client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)
    console.log(`[bot] ✅ ${client.user!.tag} online!`)
    console.log(`[bot] 📡 ${client.guilds.cache.size} servers, ${total} users`)

    let i = 0
    const acts = ACTIVITIES(client.webUrl)
    const rotate = () => {
      const act = acts[i % acts.length]
      client.user!.setPresence({
        status: "online",
        activities: [{ name: act.name, type: act.type, ...(act.url ? { url: act.url } : {}) }],
      })
      i++
    }
    rotate()
    setInterval(rotate, 5 * 60 * 1000)
  },
}
