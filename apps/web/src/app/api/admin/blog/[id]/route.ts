export const dynamic = 'force-dynamic'

import { adminDb } from '@/lib/supabase/admin'
import { getSession, isStaff } from '@/lib/auth'
import { ok, err, FORBIDDEN, NOT_FOUND, SERVER_ERROR } from '@/lib/api'
import { NextRequest } from 'next/server'
import { z } from 'zod'

type Params = { params: Promise<{ id: string }> }

const PatchSchema = z.object({
  title:       z.string().min(1).optional(),
  slug:        z.string().min(1).optional(),
  excerpt:     z.string().optional(),
  content:     z.string().optional(),
  coverurl:    z.string().url().optional().or(z.literal('')),
  tags:        z.array(z.string()).optional(),
  ispublished: z.boolean().optional(),
})

// GET /api/admin/blog/[id] — ambil satu post by ID untuk prefill form edit
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const session = await getSession()
    if (!session || !isStaff(session.role)) return FORBIDDEN()
    const { id } = await params
    const { data, error } = await adminDb()
      .from('posts')
      .select('*')
      .eq('id', id)
      .maybeSingle()
    if (error) return SERVER_ERROR()
    if (!data) return NOT_FOUND()
    return ok(data)
  } catch { return SERVER_ERROR() }
}

// PATCH /api/admin/blog/[id]
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const session = await getSession()
    if (!session || !isStaff(session.role)) return FORBIDDEN()
    const { id } = await params
    const body    = await req.json()
    const parsed  = PatchSchema.safeParse(body)
    if (!parsed.success) return err(parsed.error.issues[0]?.message ?? 'Input tidak valid')

    const updates: Record<string, unknown> = { ...parsed.data, updatedat: new Date().toISOString() }
    if (parsed.data.ispublished === true) updates.publishedat = new Date().toISOString()
    if (parsed.data.ispublished === false) updates.publishedat = null
    if (updates.coverurl === '') updates.coverurl = null

    const { data, error } = await adminDb()
      .from('posts').update(updates).eq('id', id).select().maybeSingle()
    if (error) return err(error.message)
    if (!data) return NOT_FOUND()
    return ok(data)
  } catch { return SERVER_ERROR() }
}

// DELETE /api/admin/blog/[id]
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const session = await getSession()
    if (!session || !isStaff(session.role)) return FORBIDDEN()
    const { id } = await params
    const { error } = await adminDb().from('posts').delete().eq('id', id)
    if (error) return err(error.message)
    return ok({ deleted: true })
  } catch { return SERVER_ERROR() }
}
