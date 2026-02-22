import { NextResponse } from 'next/server'
import { getDiscordStats } from '@/lib/discord'

export async function GET() {
  try {
    const stats = await getDiscordStats()
    return NextResponse.json(stats)
  } catch {
    return NextResponse.json({ members: 0, online: 0, error: true }, { status: 500 })
  }
}
