/**
 * GET /api/home
 * Semua data homepage dalam satu request: events, blogs, partnerships
 */
import { adminDb } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const [eventsRes, blogsRes, partnershipsRes] = await Promise.all([
      // 3 events terbaru
      adminDb()
        .from('events')
        .select('id,slug,title,description,coverurl,startdate,enddate,isonline,status,createdby')
        .eq('ispublished', true)
        .order('startdate', { ascending: false })
        .limit(3),

      // 3 blog posts terbaru  
      adminDb()
        .from('posts')
        .select('id,slug,title,excerpt,coverurl,publishedat,authorid')
        .eq('ispublished', true)
        .order('publishedat', { ascending: false })
        .limit(3),

      // Semua partnership aktif
      adminDb()
        .from('partnerships')
        .select('id,name,logourl,website,category,description,isactive,sortorder')
        .eq('isactive', true)
        .order('sortorder', { ascending: true }),
    ])

    // Ambil username untuk events author
    const authorIds = new Set([
      ...(eventsRes.data ?? []).map((e: { createdby: string }) => e.createdby).filter(Boolean),
      ...(blogsRes.data ?? []).map((b: { authorid: string }) => b.authorid).filter(Boolean),
    ])

    let authorMap: Record<string, { username: string; displayname: string; avatarurl: string }> = {}
    if (authorIds.size > 0) {
      const { data: authors } = await adminDb()
        .from('users')
        .select('id,username,displayname,avatarurl')
        .in('id', [...authorIds])
      authorMap = Object.fromEntries(
        (authors ?? []).map((a: { id: string; username: string; displayname: string; avatarurl: string }) => [
          a.id, { username: a.username, displayname: a.displayname, avatarurl: a.avatarurl }
        ])
      )
    }

    const events = (eventsRes.data ?? []).map((e: Record<string, unknown>) => ({
      ...e,
      author: authorMap[e.createdby as string] ?? null,
    }))

    const blogs = (blogsRes.data ?? []).map((b: Record<string, unknown>) => ({
      ...b,
      author: authorMap[b.authorid as string] ?? null,
    }))

    return NextResponse.json({
      data: {
        events,
        blogs,
        partnerships: partnershipsRes.data ?? [],
      }
    })
  } catch (e) {
    console.error('[api/home] error:', e)
    return NextResponse.json({ data: { events: [], blogs: [], partnerships: [] } })
  }
}
