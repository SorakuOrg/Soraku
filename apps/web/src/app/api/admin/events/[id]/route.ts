import { adminDb } from '@/lib/supabase/admin'
import { getSession, isStaff } from '@/lib/auth'
import { ok, err, FORBIDDEN, SERVER_ERROR } from '@/lib/api'
import { NextRequest } from 'next/server'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

type Params = { params: Promise<{ id: string }> }

const PatchSchema = z.object({
  title:       z.string().optional(),
  description: z.string().optional(),
  coverurl:    z.string().url().optional(),
  startdate:   z.string().optional(),
  enddate:     z.string().optional(),
  location:    z.string().optional(),
  isonline:    z.boolean().optional(),
  ispublished: z.boolean().optional(),
  tags:        z.array(z.string()).optional(),
})

// PATCH /api/admin/events/[id]
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const session = await getSession()
    if (!session || !isStaff(session.role)) return FORBIDDEN
    const { id } = await params
    const body    = await req.json()
    const parsed  = PatchSchema.safeParse(body)
    if (!parsed.success) return err(parsed.error.message)
    const { data, error } = await adminDb().from('events').update(parsed.data).eq('id', id).select().single()
    if (error) return err(error.message)
    return ok(data)
  } catch { return SERVER_ERROR }
}

// DELETE /api/admin/events/[id]
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const session = await getSession()
    if (!session || !isStaff(session.role)) return FORBIDDEN
    const { id }  = await params
    const { error } = await adminDb().from('events').delete().eq('id', id)
    if (error) return err(error.message)
    return ok({ deleted: true })
  } catch { return SERVER_ERROR }
}
