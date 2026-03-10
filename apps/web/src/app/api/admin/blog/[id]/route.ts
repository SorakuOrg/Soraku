import { adminDb } from '@/lib/supabase/admin'
import { getSession, isStaff } from '@/lib/auth'
import { ok, err, FORBIDDEN, SERVER_ERROR } from '@/lib/api'
import { NextRequest } from 'next/server'
import { z } from 'zod'

type Params = { params: Promise<{ id: string }> }

const PatchSchema = z.object({
  title:       z.string().min(1).optional(),
  excerpt:     z.string().optional(),
  content:     z.string().optional(),
  coverurl:    z.string().url().optional(),
  tags:        z.array(z.string()).optional(),
  ispublished: z.boolean().optional(),
})

// PATCH /api/admin/blog/[id]
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const session = await getSession()
    if (!session || !isStaff(session.role)) return FORBIDDEN
    const { id } = await params
    const body    = await req.json()
    const parsed  = PatchSchema.safeParse(body)
    if (!parsed.success) return err(parsed.error.message)

    const extra = parsed.data.ispublished === true ? { publishedat: new Date().toISOString() } : {}
    const { data, error } = await adminDb().from('posts').update({ ...parsed.data, ...extra }).eq('id', id).select().single()
    if (error) return err(error.message)
    return ok(data)
  } catch { return SERVER_ERROR }
}

// DELETE /api/admin/blog/[id]
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const session = await getSession()
    if (!session || !isStaff(session.role)) return FORBIDDEN
    const { id } = await params
    const { error } = await adminDb().from('posts').delete().eq('id', id)
    if (error) return err(error.message)
    return ok({ deleted: true })
  } catch { return SERVER_ERROR }
}
