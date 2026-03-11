import { adminDb } from '@/lib/supabase/admin'
import { getSession } from '@/lib/auth'
import { ok, err, UNAUTHORIZED, SERVER_ERROR } from '@/lib/api'
import { NextRequest } from 'next/server'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const UpdateSchema = z.object({
  displayname: z.string().min(1).max(50).optional(),
  username:    z.string().min(3).max(30).regex(/^[a-z0-9_]+$/, 'Username hanya huruf kecil, angka, underscore').optional(),
  bio:         z.string().max(300).optional(),
  coverurl:    z.string().url().optional().or(z.literal('')),
  avatarurl:   z.string().url().optional().or(z.literal('')),
  sociallinks: z.record(z.string(), z.string()).optional(),
  isprivate:   z.boolean().optional(),
})

// GET /api/profile — ambil profile user yang sedang login
export async function GET() {
  const session = await getSession()
  if (!session) return UNAUTHORIZED

  const { data, error } = await adminDb()
    .from('users')
    .select('id, username, displayname, avatarurl, coverurl, bio, role, supporterrole, sociallinks, isprivate, createdat')
    .eq('id', session.id)
    .single()

  if (error) return SERVER_ERROR
  return ok(data)
}

// PATCH /api/profile — update profile user yang sedang login
export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session) return UNAUTHORIZED

    const body   = await req.json()
    const parsed = UpdateSchema.safeParse(body)
    if (!parsed.success) return err(parsed.error.issues[0]?.message ?? 'Input tidak valid')

    const updates = parsed.data

    // Jika ganti username, cek duplikat
    if (updates.username && updates.username !== session.username) {
      const { data: existing } = await adminDb()
        .from('users')
        .select('id')
        .eq('username', updates.username)
        .maybeSingle()
      if (existing) return err('Username sudah dipakai', 409)
    }

    const { data, error } = await adminDb()
      .from('users')
      .update({ ...updates, updatedat: new Date().toISOString() })
      .eq('id', session.id)
      .select('id, username, displayname, avatarurl, coverurl, bio, role, supporterrole, sociallinks, isprivate')
      .single()

    if (error) return SERVER_ERROR
    return ok(data)
  } catch {
    return SERVER_ERROR
  }
}
