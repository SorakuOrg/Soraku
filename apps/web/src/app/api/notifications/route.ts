import { adminDb } from '@/lib/supabase/admin'
import { getSession } from '@/lib/auth'
import { ok, err, UNAUTHORIZED, SERVER_ERROR } from '@/lib/api'
import { NextRequest } from 'next/server'
import { z } from 'zod'

const MarkReadSchema = z.object({
  ids: z.array(z.string().uuid()).min(1),
})

// GET /api/notifications — list notif user (polling 30s dari client)
export async function GET() {
  try {
    const session = await getSession()
    if (!session) return UNAUTHORIZED

    const { data, error } = await adminDb()
      .from('notifications')
      .select('id,type,title,body,href,isread,createdat')
      .eq('userid', session.id)
      .order('createdat', { ascending: false })
      .limit(30)

    if (error) return SERVER_ERROR
    return ok(data, 200, undefined)
  } catch { return SERVER_ERROR }
}

// PATCH /api/notifications — mark as read
export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session) return UNAUTHORIZED

    const body   = await req.json()
    const parsed = MarkReadSchema.safeParse(body)
    if (!parsed.success) return err(parsed.error.message)

    const { error } = await adminDb()
      .from('notifications')
      .update({ isread: true })
      .eq('userid', session.id)
      .in('id', parsed.data.ids)

    if (error) return err(error.message)
    return ok({ updated: true })
  } catch { return SERVER_ERROR }
}
