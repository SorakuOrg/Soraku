export const dynamic = 'force-dynamic'

import { adminDb } from '@/lib/supabase/admin'
import { getSession } from '@/lib/auth'
import { ok, err, UNAUTHORIZED, SERVER_ERROR } from '@/lib/api'
import { NextRequest } from 'next/server'
import { z } from 'zod'

const SELECT = 'id,username,displayname,avatarurl,coverurl,bio,role,supporterrole,sociallinks,isprivate,createdat'

const UpdateSchema = z.object({
  displayname: z.string().min(1).max(50).optional(),
  bio:         z.string().max(300).optional(),
  coverurl:    z.string().url().optional().or(z.literal('')),
  avatarurl:   z.string().url().optional().or(z.literal('')),
  sociallinks: z.record(z.string(), z.string()).optional(),
  isprivate:   z.boolean().optional(),
})

function normalize(data: Record<string, unknown>) {
  return {
    ...data,
    sociallinks: (data.sociallinks as Record<string, string> | null) ?? {},
    isprivate:   data.isprivate   ?? false,
    coverurl:    data.coverurl    ?? null,
    bio:         data.bio         ?? null,
  }
}

// GET /api/profile
export async function GET() {
  try {
    const session = await getSession()
    if (!session) return UNAUTHORIZED

    // maybeSingle() — tidak throw jika row belum ada
    const { data, error } = await adminDb()
      .from('users')
      .select(SELECT)
      .eq('id', session.id)
      .maybeSingle()

    if (error) {
      console.error('[api/profile GET] DB error:', error.message)
      return SERVER_ERROR
    }

    // Row belum ada → auto-upsert dengan data dari OAuth session
    if (!data) {
      const newRow = {
        id:          session.id,
        username:    session.username?.slice(0, 30) ?? null,
        displayname: session.displayname?.slice(0, 50) ?? null,
        avatarurl:   session.avatarurl ?? null,
        coverurl:    null as string | null,
        bio:         null as string | null,
        role:        session.role,
        supporterrole: session.supporterrole ?? null,
        sociallinks: {} as Record<string, string>,
        isprivate:   false,
        isbanned:    false,
        createdat:   new Date().toISOString(),
        updatedat:   new Date().toISOString(),
      }

      const { data: created, error: upsertErr } = await adminDb()
        .from('users')
        .upsert(newRow, { onConflict: 'id' })
        .select(SELECT)
        .maybeSingle()

      if (upsertErr) {
        console.error('[api/profile GET] upsert error:', upsertErr.message, upsertErr.code)
        // Kembalikan data dari session supaya UI tidak blank
        return ok({
          id:           session.id,
          username:     session.username,
          displayname:  session.displayname,
          avatarurl:    session.avatarurl,
          coverurl:     null,
          bio:          null,
          role:         session.role,
          supporterrole: session.supporterrole ?? null,
          sociallinks:  {},
          isprivate:    false,
          createdat:    new Date().toISOString(),
        })
      }

      return ok(normalize(created as Record<string, unknown>))
    }

    return ok(normalize(data as Record<string, unknown>))
  } catch (e) {
    console.error('[api/profile GET] unexpected:', e)
    return SERVER_ERROR
  }
}

// PATCH /api/profile
export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session) return UNAUTHORIZED

    const body   = await req.json()
    const parsed = UpdateSchema.safeParse(body)
    if (!parsed.success) return err(parsed.error.issues[0]?.message ?? 'Input tidak valid')

    // Konversi string kosong → null
    const updates = Object.fromEntries(
      Object.entries(parsed.data).map(([k, v]) => [k, v === '' ? null : v])
    )

    const { data, error } = await adminDb()
      .from('users')
      .update({ ...updates, updatedat: new Date().toISOString() })
      .eq('id', session.id)
      .select(SELECT)
      .maybeSingle()

    if (error) {
      console.error('[api/profile PATCH] DB error:', error.message)
      return SERVER_ERROR
    }
    if (!data) return err('Profil tidak ditemukan', 404)

    return ok(normalize(data as Record<string, unknown>))
  } catch (e) {
    console.error('[api/profile PATCH] unexpected:', e)
    return SERVER_ERROR
  }
}
