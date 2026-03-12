export const dynamic = 'force-dynamic'

import { adminDb } from '@/lib/supabase/admin'
import { ok, err, SERVER_ERROR } from '@/lib/api'
import { NextRequest } from 'next/server'

// GET /api/donate?period=all|month&limit=
// Data donatur publik — dipakai di /donate/leaderboard
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const period = searchParams.get('period') ?? 'all'
    const limit  = Math.min(Number(searchParams.get('limit') ?? 50), 100)

    let q = adminDb()
      .from('donatur')
      .select('id,displayname,amount,tier,message,createdat', { count: 'exact' })
      .eq('ispublic', true)
      .order('amount', { ascending: false })
      .limit(limit)

    if (period === 'month') {
      const start = new Date()
      start.setDate(1); start.setHours(0, 0, 0, 0)
      q = q.gte('createdat', start.toISOString())
    }

    const { data, error, count } = await q
    if (error) return err(error.message)
    return ok(data ?? [], 200, { total: count ?? 0 })
  } catch { return SERVER_ERROR() }
}
