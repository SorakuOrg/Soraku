import { adminDb } from '@/lib/supabase/admin'
import { getSession, isStaff } from '@/lib/auth'
import { ok, SERVER_ERROR } from '@/lib/api'
import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

// GET /api/events?status=upcoming|past|all
export async function GET(req: NextRequest) {
  try {
    const session = await getSession()
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status') ?? 'upcoming' // upcoming | past | all
    const tag    = searchParams.get('tag')
    const now    = new Date().toISOString()

    let query = adminDb()
      .from('events')
      .select('id,slug,title,description,coverurl,startdate,enddate,location,isonline,ispublished,tags,createdat')
      .order('startdate', { ascending: status !== 'past' })

    if (!session || !isStaff(session.role)) query = query.eq('ispublished', true)
    if (status === 'upcoming') query = query.gte('startdate', now)
    if (status === 'past')     query = query.lt('startdate', now)
    if (tag) query = query.contains('tags', [tag])

    const { data, error } = await query
    if (error) return SERVER_ERROR()
    return ok(data)
  } catch { return SERVER_ERROR() }
}
