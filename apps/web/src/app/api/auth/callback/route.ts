import { createClient } from '@/lib/supabase/server'
import { adminDb } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Discord IDs yang otomatis dapat role OWNER
// Ditambah via ENV: OWNER_DISCORD_IDS=id1,id2 (opsional)
const OWNER_DISCORD_IDS = new Set([
  '1020644780075659356', // Riu
  ...(process.env.OWNER_DISCORD_IDS ?? '').split(',').map(s => s.trim()).filter(Boolean),
])

// GET /api/auth/callback
// Dipanggil Supabase setelah OAuth Discord/Google berhasil
export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dash/profile/me'

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=no_code`)
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error || !data.user) {
    console.error('[auth/callback] exchange error:', error?.message)
    return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
  }

  const user = data.user
  const meta = user.user_metadata ?? {}

  // Tentukan role berdasarkan Discord ID
  const discordId = meta.provider_id ?? meta.sub ?? ''
  const isOwner   = OWNER_DISCORD_IDS.has(discordId)

  // Username dari Discord/Google metadata
  const username    = meta.user_name ?? meta.preferred_username ?? meta.name?.toLowerCase().replace(/\s+/g, '_') ?? null
  const displayname = meta.full_name ?? meta.name ?? meta.user_name ?? null
  const avatarurl   = meta.avatar_url ?? meta.picture ?? null

  try {
    // Cek apakah user sudah ada di DB
    const { data: existing } = await adminDb()
      .from('users')
      .select('id, role')
      .eq('id', user.id)
      .maybeSingle()

    if (existing) {
      // User sudah ada — update hanya jika perlu naik jadi OWNER
      if (isOwner && existing.role !== 'OWNER') {
        await adminDb()
          .from('users')
          .update({ role: 'OWNER', updatedat: new Date().toISOString() })
          .eq('id', user.id)
      }
    } else {
      // User baru — insert dengan role yang sesuai
      await adminDb()
        .from('users')
        .upsert({
          id:          user.id,
          username:    username?.slice(0, 30) ?? null,
          displayname: displayname?.slice(0, 50) ?? null,
          avatarurl,
          role:        isOwner ? 'OWNER' : 'USER',
          createdat:   new Date().toISOString(),
          updatedat:   new Date().toISOString(),
        }, { onConflict: 'id' })
    }
  } catch (dbErr) {
    // Jangan block user dari login meski DB error
    console.error('[auth/callback] DB upsert error:', dbErr)
  }

  return NextResponse.redirect(`${origin}${next}`)
}
