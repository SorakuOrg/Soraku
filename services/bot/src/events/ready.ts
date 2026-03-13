import { type Client, ActivityType } from "discord.js"

const WEB_URL    = process.env.SORAKU_WEB_URL ?? "https://www.soraku.id"
const STREAM_URL = "https://www.soraku.id" // harus URL valid untuk ActivityType.Streaming

// Rich Presence activities — rotate setiap 5 menit
// ActivityType.Streaming memunculkan link "soraku.id" yang bisa diklik di profile bot
const ACTIVITIES = [
  {
    name: "Soraku Community 空",
    type: ActivityType.Streaming,
    url:  STREAM_URL,                    // ← ini yang bikin clickable di Discord
  },
  {
    name: "komunitas anime Indonesia 🇮🇩",
    type: ActivityType.Watching,
  },
  {
    name: "/link · /profile · /about",
    type: ActivityType.Listening,
  },
  {
    name: "soraku.id — Belajar & Berkembang",
    type: ActivityType.Streaming,
    url:  STREAM_URL,
  },
  {
    name: "anime, manga & vtuber bareng~",
    type: ActivityType.Watching,
  },
]

export function handleReady(client: Client<true>) {
  const tag      = client.user.tag
  const guildCount = client.guilds.cache.size
  console.log(`[bot] ✅ Online sebagai ${tag}`)
  console.log(`[bot] 📡 Terhubung ke ${guildCount} server`)
  console.log(`[bot] 🌐 Web: ${WEB_URL}`)

  let index = 0

  const setActivity = () => {
    const act = ACTIVITIES[index % ACTIVITIES.length]
    client.user.setPresence({
      status: "online",
      activities: [{
        name: act.name,
        type: act.type,
        ...(act.url ? { url: act.url } : {}),
      }],
    })
    index++
  }

  setActivity()
  setInterval(setActivity, 5 * 60 * 1000) // ganti setiap 5 menit
}
