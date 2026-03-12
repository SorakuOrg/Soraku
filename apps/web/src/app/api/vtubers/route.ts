export const dynamic = 'force-dynamic'

import { adminDb } from '@/lib/supabase/admin'
import { ok, err, SERVER_ERROR } from '@/lib/api'
import { NextRequest } from 'next/server'

// GET /api/vtubers?tag=&limit=&page=
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const tag   = searchParams.get('tag')
    const limit = Math.min(Number(searchParams.get('limit') ?? 20), 50)
    const page  = Math.max(Number(searchParams.get('page') ?? 1), 1)
    const from  = (page - 1) * limit

    let q = adminDb()
      .from('vtubers')
      .select('id,slug,name,charactername,avatarurl,coverurl,description,tags,islive,liveurl,subscribercount,isactive', { count: 'exact' })
      .eq('ispublished', true)
      .order('createdat', { ascending: true })
      .range(from, from + limit - 1)

    if (tag) q = q.contains('tags', [tag])

    const { data, error, count } = await q
    if (error) return err(error.message)
    return ok(data ?? [], 200, { total: count ?? 0, page, limit })
  } catch { return SERVER_ERROR() }
}
