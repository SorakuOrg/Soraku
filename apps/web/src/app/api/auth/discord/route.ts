import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const { origin, searchParams } = new URL(req.url)
  const next = searchParams.get('next') ?? '/dash/profile/me'

  // Buat response dulu — cookies PKCE akan ditulis langsung ke sini
  const response = NextResponse.redirect(new URL('/login?error=discord_oauth_failed', origin))

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Baca dari request cookies
        getAll: () => req.cookies.getAll(),
        // Tulis ke BOTH request (untuk penggunaan sesi saat ini) dan response
        setAll: (cookiesToSet: { name: string; value: string; options: CookieOptions }[]) => {
          cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value))
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'discord',
    options: {
      redirectTo: `${origin}/api/auth/callback?next=${encodeURIComponent(next)}`,
      scopes: 'identify email guilds',
    },
  })

  if (error || !data.url) {
    console.error('[auth/discord] OAuth error:', error?.message)
    return response // redirect ke login?error=...
  }

  // Redirect ke Discord OAuth URL — PKCE cookies sudah ada di response headers
  response.headers.set('Location', data.url)
  return response
}
