import { adminDb } from '@/lib/supabase/admin'
import { getSession, isStaff } from '@/lib/auth'
import { ok, NOT_FOUND, SERVER_ERROR } from '@/lib/api'
import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

type Params = { params: Promise<{ slug: string }> }

// GET /api/events/[slug]
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { slug } = await params
    const session  = await getSession()

    const { data, error } = await adminDb()
      .from('events').select('*').eq('slug', slug).single()

    if (error || !data) return NOT_FOUND
    if (!data.ispublished && (!session || !isStaff(session.role))) return NOT_FOUND
    return ok(data)
  } catch { return SERVER_ERROR }
}
