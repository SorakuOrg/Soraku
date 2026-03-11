import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// GET /api/auth/discord
// Redirect user ke Discord OAuth via Supabase
export async function GET(req: NextRequest) {
  const { origin, searchParams } = new URL(req.url)
  const next = searchParams.get('next') ?? '/dashboard'

  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'discord',
    options: {
      redirectTo: `${origin}/api/auth/callback?next=${encodeURIComponent(next)}`,
      scopes: 'identify email guilds',
    },
  })

  if (error || !data.url) {
    console.error('[auth/discord] OAuth error:', error?.message)
    return NextResponse.redirect(`${origin}/login?error=discord_oauth_failed`)
  }

  return NextResponse.redirect(data.url)
}
