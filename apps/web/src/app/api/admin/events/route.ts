export const dynamic = 'force-dynamic'

import { adminDb } from '@/lib/supabase/admin'
import { getSession, isStaff } from '@/lib/auth'
import { ok, err, FORBIDDEN, SERVER_ERROR } from '@/lib/api'
import { NextRequest } from 'next/server'
import { z } from 'zod'

const EventSchema = z.object({
  slug:        z.string().min(1),
  title:       z.string().min(1),
  description: z.string().optional(),
  coverurl:    z.string().url().optional(),
  startdate:   z.string(),
  enddate:     z.string().optional(),
  location:    z.string().optional(),
  isonline:    z.boolean().default(true),
  ispublished: z.boolean().default(false),
  tags:        z.array(z.string()).default([]),
})

// GET /api/admin/events — list SEMUA event termasuk draft
export async function GET(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session || !isStaff(session.role)) return FORBIDDEN()
    const { searchParams } = new URL(req.url)
    const limit = Math.min(Number(searchParams.get('limit') ?? '100'), 200)
    const { data, error } = await adminDb()
      .from('events')
      .select('id,slug,title,startdate,enddate,isonline,ispublished,tags,createdat')
      .order('startdate', { ascending: false })
      .limit(limit)
    if (error) return SERVER_ERROR()
    return ok(data ?? [])
  } catch { return SERVER_ERROR() }
}

// POST /api/admin/events
export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session || !isStaff(session.role)) return FORBIDDEN()
    const body   = await req.json()
    const parsed = EventSchema.safeParse(body)
    if (!parsed.success) return err(parsed.error.issues[0]?.message ?? 'Input tidak valid')
    const payload = { ...parsed.data, createdby: session.id }
    const { data, error } = await adminDb().from('events').insert(payload).select().single()
    if (error) return err(error.message)

    // Notify bot jika event dipublish
    if (parsed.data.ispublished) {
      const botUrl    = process.env.BOT_WEBHOOK_URL
      const botSecret = process.env.BOT_WEBHOOK_SECRET
      if (botUrl && botSecret) {
        try {
          await fetch(`${botUrl}/announce/event`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-webhook-secret': botSecret },
            body: JSON.stringify({
              title:    parsed.data.title,
              eventUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/events/${parsed.data.slug}`,
            }),
          })
        } catch { /* bot offline — lanjut saja */ }
      }
    }
    return ok(data, 201)
  } catch { return SERVER_ERROR() }
}
