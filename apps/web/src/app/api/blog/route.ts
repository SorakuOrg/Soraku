import { adminDb } from '@/lib/supabase/admin'
import { getSession, isStaff } from '@/lib/auth'
import { ok, SERVER_ERROR } from '@/lib/api'
import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

// GET /api/blog?page=1&limit=12&tag=
export async function GET(req: NextRequest) {
  try {
    const session = await getSession()
    const { searchParams } = new URL(req.url)
    const tag    = searchParams.get('tag')
    const limit  = Math.min(Number(searchParams.get('limit') ?? 12), 50)
    const page   = Math.max(Number(searchParams.get('page') ?? 1), 1)
    const offset = (page - 1) * limit

    let query = adminDb()
      .from('posts')
      .select('id,slug,title,excerpt,coverurl,tags,publishedat,authorid,createdat', { count: 'exact' })
      .order('publishedat', { ascending: false })
      .range(offset, offset + limit - 1)

    if (!session || !isStaff(session.role)) query = query.eq('ispublished', true)
    if (tag) query = query.contains('tags', [tag])

    const { data, error, count } = await query
    if (error) return SERVER_ERROR

    return ok(data, 200, { total: count ?? 0, page, limit })
  } catch { return SERVER_ERROR }
}
