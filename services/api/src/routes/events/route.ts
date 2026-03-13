import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { events } from "@/lib/db/schema"
import { EventQuerySchema } from "@/lib/validators"
import { eq, and, asc, desc } from "drizzle-orm"

export const dynamic = "force-dynamic"

// GET /api/events
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const parsed = EventQuerySchema.safeParse(Object.fromEntries(searchParams))
  if (!parsed.success) return NextResponse.json({ data: null, error: parsed.error.issues[0]?.message }, { status: 400 })

  const { status, page, limit } = parsed.data
  const offset = (page - 1) * limit

  const where = and(
    eq(events.ispublished, true),
    status ? eq(events.status, status) : undefined,
  )

  const rows = await db
    .select()
    .from(events)
    .where(where)
    .orderBy(asc(events.startdate))
    .limit(limit)
    .offset(offset)

  return NextResponse.json({ data: rows, error: null })
}

// GET /api/events/:slug
export async function getBySlug(_req: NextRequest, { params }: { params: { slug: string } }) {
  const [event] = await db
    .select()
    .from(events)
    .where(and(eq(events.slug, params.slug), eq(events.ispublished, true)))
    .limit(1)

  if (!event) return NextResponse.json({ data: null, error: "Event not found" }, { status: 404 })
  return NextResponse.json({ data: event, error: null })
}
