const DISCORD_API = 'https://discord.com/api/v10'
const GUILD_ID = process.env.DISCORD_SERVER_ID || '1116971049045729302'
const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN
const WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL

// Cache for Discord stats
let statsCache: { members: number; online: number; timestamp: number } | null = null
const CACHE_TTL = 60 * 1000 // 60 seconds

export async function getDiscordStats() {
  // Return cache if fresh
  if (statsCache && Date.now() - statsCache.timestamp < CACHE_TTL) {
    return { members: statsCache.members, online: statsCache.online, cached: true }
  }

  try {
    const headers = {
      Authorization: `Bot ${BOT_TOKEN}`,
      'Content-Type': 'application/json',
    }

    // Fetch guild with member counts
    const guildRes = await fetch(
      `${DISCORD_API}/guilds/${GUILD_ID}?with_counts=true`,
      { headers, next: { revalidate: 60 } }
    )

    if (!guildRes.ok) {
      throw new Error(`Discord API error: ${guildRes.status}`)
    }

    const guild = await guildRes.json()

    const stats = {
      members: guild.approximate_member_count || 0,
      online: guild.approximate_presence_count || 0,
      timestamp: Date.now(),
    }

    statsCache = stats

    return { members: stats.members, online: stats.online, cached: false }
  } catch (error) {
    console.error('Discord stats error:', error)
    // Return cached data or fallback
    if (statsCache) {
      return { members: statsCache.members, online: statsCache.online, cached: true }
    }
    return { members: 0, online: 0, cached: false, error: true }
  }
}

export async function sendEventToDiscord(event: {
  title: string
  description: string
  startDate: string
  endDate: string
  bannerImage?: string
}) {
  if (!WEBHOOK_URL) {
    console.warn('Discord webhook URL not configured')
    return null
  }

  try {
    const embed = {
      title: `🎉 ${event.title}`,
      description: event.description,
      color: 0x4fa3d1,
      fields: [
        {
          name: '📅 Mulai',
          value: new Date(event.startDate).toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
          inline: true,
        },
        {
          name: '🏁 Selesai',
          value: new Date(event.endDate).toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
          inline: true,
        },
      ],
      footer: { text: 'Soraku Community' },
      timestamp: new Date().toISOString(),
    }

    if (event.bannerImage) {
      Object.assign(embed, { image: { url: event.bannerImage } })
    }

    const res = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ embeds: [embed] }),
    })

    if (!res.ok) {
      throw new Error(`Webhook error: ${res.status}`)
    }

    return { success: true }
  } catch (error) {
    console.error('Discord webhook error:', error)
    return { success: false, error }
  }
}

export async function getDiscordEvents() {
  if (!BOT_TOKEN) return []

  try {
    const res = await fetch(
      `${DISCORD_API}/guilds/${GUILD_ID}/scheduled-events`,
      {
        headers: { Authorization: `Bot ${BOT_TOKEN}` },
        next: { revalidate: 300 },
      }
    )

    if (!res.ok) return []

    const events = await res.json()
    return events
  } catch {
    return []
  }
}
