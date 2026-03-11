// GET /api/stats — combined stats untuk /about page
// TODO Kaizo: ganti MOCK dengan query real ke Supabase
// - memberCount, onlineCount → dari Discord API (sudah ada di /api/discord/stats)
// - eventCount → SELECT COUNT(*) FROM events
// - onlineWebsite → bisa pakai Supabase Realtime presence channel

import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Discord member count (real)
    const code = process.env.DISCORD_INVITE_CODE ?? "qm3XJvRa6B";
    const res = await fetch(
      `https://discord.com/api/v10/invites/${code}?with_counts=true`,
      { next: { revalidate: 60 } }
    );
    const discord = res.ok ? await res.json() : null;

    return NextResponse.json({
      discord_members:  discord?.approximate_member_count  ?? 500,
      discord_online:   discord?.approximate_presence_count ?? 120,
      event_count:      20,    // TODO Kaizo: SELECT COUNT(*) FROM events
      founded_year:     2023,
      website_online:   Math.floor(Math.random() * 40) + 10, // TODO Sora: Supabase Realtime presence
    });
  } catch {
    return NextResponse.json({
      discord_members: 500,
      discord_online:  120,
      event_count:     20,
      founded_year:    2023,
      website_online:  18,
    });
  }
}
