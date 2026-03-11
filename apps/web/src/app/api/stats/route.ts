export const dynamic = 'force-dynamic'

import { adminDb } from '@/lib/supabase/admin'
import { ok } from '@/lib/api'

// GET /api/stats — combined stats untuk /about page
export async function GET() {
  try {
    // Discord member count dari public invite API
    const code    = process.env.DISCORD_INVITE_CODE ?? 'qm3XJvRa6B'
    const discordRes = await fetch(
      `https://discord.com/api/v10/invites/${code}?with_counts=true`,
      { next: { revalidate: 60 } }
    )
    const discord = discordRes.ok ? await discordRes.json() : null

    // Event count dari DB — hanya yang published
    const { count: eventCount } = await adminDb()
      .from('events')
      .select('*', { count: 'exact', head: true })
      .eq('ispublished', true)

    // Member count dari DB
    const { count: memberCount } = await adminDb()
      .from('users')
      .select('*', { count: 'exact', head: true })

    // Post count dari DB
    const { count: postCount } = await adminDb()
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .eq('ispublished', true)

    return ok({
      discord_members:  discord?.approximate_member_count   ?? memberCount ?? 500,
      discord_online:   discord?.approximate_presence_count ?? 0,
      event_count:      eventCount   ?? 0,
      post_count:       postCount    ?? 0,
      member_count:     memberCount  ?? 0,
      founded_year:     2023,
      // website_online: TODO Sora — Supabase Realtime presence
    })
  } catch {
    return ok({
      discord_members: 500,
      discord_online:  0,
      event_count:     0,
      post_count:      0,
      member_count:    0,
      founded_year:    2023,
    })
  }
}
