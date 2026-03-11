import { adminDb, createAdminClient } from '@/lib/supabase/admin'
import { getSession, isStaff } from '@/lib/auth'
import { ok, err, UNAUTHORIZED, SERVER_ERROR } from '@/lib/api'
import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

// GET /api/gallery?category=&page=1&limit=20
export async function GET(req: NextRequest) {
  try {
    const session = await getSession()
    const { searchParams } = new URL(req.url)
    const tag    = searchParams.get('tag') ?? searchParams.get('category')
    const limit  = Math.min(Number(searchParams.get('limit') ?? 20), 50)
    const page   = Math.max(Number(searchParams.get('page') ?? 1), 1)
    const offset = (page - 1) * limit

    let query = adminDb()
      .from('gallery')
      .select('id,imageurl,title,description,tags,status,uploadedby,createdat', { count: 'exact' })
      .order('createdat', { ascending: false })
      .range(offset, offset + limit - 1)

    if (!session || !isStaff(session.role)) query = query.eq('status', 'approved')
    if (tag) query = query.contains('tags', [tag])

    const { data, error, count } = await query
    if (error) return SERVER_ERROR
    return ok(data, 200, { total: count ?? 0, page, limit })
  } catch { return SERVER_ERROR }
}
