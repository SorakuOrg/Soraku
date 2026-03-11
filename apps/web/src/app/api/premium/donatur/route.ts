import { adminDb } from '@/lib/supabase/admin'
import { ok, SERVER_ERROR } from '@/lib/api'
import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

// GET /api/premium/donatur?period=all|month
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const period = searchParams.get('period') ?? 'all'

    let query = adminDb()
      .from('donatur')
      .select('id,displayname,amount,tier,message,createdat')
      .eq('ispublic', true)
      .order('amount', { ascending: false })
      .limit(50)

    if (period === 'month') {
      const from = new Date()
      from.setDate(1); from.setHours(0,0,0,0)
      query = query.gte('createdat', from.toISOString())
    }

    const { data, error } = await query
    if (error) return SERVER_ERROR
    return ok(data)
  } catch { return SERVER_ERROR }
}
