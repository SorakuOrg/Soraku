import { type Client, ActivityType } from "discord.js"

// Rotating activity — ganti setiap 5 menit
const ACTIVITIES = [
  { name: "soraku.id 🌐",             type: ActivityType.Watching  },
  { name: "komunitas anime Indonesia", type: ActivityType.Watching  },
  { name: "/link untuk daftar ✨",     type: ActivityType.Listening },
  { name: "Soraku Community 空",       type: ActivityType.Watching  },
  { name: "/about untuk info bot 🤖",  type: ActivityType.Listening },
]

export function handleReady(client: Client<true>) {
  console.log(`[bot] ✅ Online sebagai ${client.user.tag}`)
  console.log(`[bot] 📡 Terhubung ke ${client.guilds.cache.size} server`)

  // Set activity pertama
  let index = 0
  const setActivity = () => {
    const act = ACTIVITIES[index % ACTIVITIES.length]
    client.user.setActivity(act.name, { type: act.type })
    index++
  }

  setActivity()
  // Ganti activity setiap 5 menit
  setInterval(setActivity, 5 * 60 * 1000)
}
