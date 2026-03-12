export const dynamic = 'force-dynamic'

import { adminDb } from '@/lib/supabase/admin'
import { getSession } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { z } from 'zod'

// GET /api/debug-save — diagnostik PATCH profile
// HAPUS setelah selesai debug!
export async function GET() {
  const result: Record<string, unknown> = {}

  try {
    // 1. ENV check
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_KEY ?? ''
    result.env = {
      supabase_url:     !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      service_key_set:  !!serviceKey,
      // Penting: service key harus dimulai "eyJ" (JWT), bukan "postgresql://"
      key_prefix:       serviceKey.substring(0, 10) + '...',
      key_is_jwt:       serviceKey.startsWith('eyJ'),
    }

    // 2. Session
    const session = await getSession()
    result.session = session ? {
      id:       session.id.substring(0, 8) + '…',
      username: session.username,
      role:     session.role,
    } : null

    if (!session) return NextResponse.json({ ...result, step: 'no_session' })

    // 3. DB SELECT test
    const { data: selectData, error: selectErr } = await adminDb()
      .from('users')
      .select('id, username, displayname, role')
      .eq('id', session.id)
      .maybeSingle()

    result.db_select = selectErr
      ? { ok: false, error: selectErr.message, code: selectErr.code }
      : { ok: true, username: selectData?.username }

    // 4. DB UPDATE test (touch updatedat saja)
    if (!selectErr) {
      const { error: updateErr } = await adminDb()
        .from('users')
        .update({ updatedat: new Date().toISOString() })
        .eq('id', session.id)

      result.db_update = updateErr
        ? { ok: false, error: updateErr.message, code: updateErr.code, hint: updateErr.hint }
        : { ok: true }
    }

    // 5. Zod URL validation test
    const schema = z.string().url().optional().or(z.literal(''))
    const testUrl = 'https://cdn.discordapp.com/avatars/1020644780075659356/48b2f766b196fccc53050b73c29bc9aa.png'
    result.zod_discord_url = schema.safeParse(testUrl)

  } catch (e) {
    result.exception = String(e)
  }

  return NextResponse.json(result)
}
