import { adminDb } from '@/lib/supabase/admin'
import { getSession, isStaff } from '@/lib/auth'
import { ok, err, FORBIDDEN, SERVER_ERROR } from '@/lib/api'
import { NextRequest } from 'next/server'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

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

// POST /api/admin/events
export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session || !isStaff(session.role)) return FORBIDDEN

    const body   = await req.json()
    const parsed = EventSchema.safeParse(body)
    if (!parsed.success) return err(parsed.error.message)

    const { data, error } = await adminDb()
      .from('events')
      .insert({ ...parsed.data, createdby: session.id })
      .select()
      .single()

    if (error) return err(error.message)

    // Trigger bot announce jika event dipublish
    if (parsed.data.ispublished) {
      const botUrl    = process.env.BOT_WEBHOOK_URL
      const botSecret = process.env.BOT_WEBHOOK_SECRET
      if (botUrl && botSecret) {
        fetch(`${botUrl}/webhook/discord-event`, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json', 'x-soraku-secret': botSecret },
          body: JSON.stringify({
            title:       parsed.data.title,
            description: parsed.data.description,
            startAt:     parsed.data.startdate,
            eventUrl:    `${process.env.NEXT_PUBLIC_SITE_URL}/events/${parsed.data.slug}`,
          }),
        }).catch(e => console.error('[admin/events] bot announce error:', e))
      }
    }

    return ok(data, 201)
  } catch { return SERVER_ERROR }
}
