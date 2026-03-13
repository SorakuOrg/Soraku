import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { streamcontent, users } from "@/lib/db/schema"
import { StreamQuerySchema } from "@/lib/validators"
import { verifyAuth } from "@/lib/auth"
import { eq, and, desc } from "drizzle-orm"

export const dynamic = "force-dynamic"

// GET /api/stream — daftar konten streaming
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const parsed = StreamQuerySchema.safeParse(Object.fromEntries(searchParams))
  if (!parsed.success) return NextResponse.json({ data: null, error: parsed.error.issues[0]?.message }, { status: 400 })

  const { type, vtuberid, ispremium, page, limit } = parsed.data
  const offset = (page - 1) * limit

  // Cek apakah user subscriber kalau minta konten premium
  if (ispremium) {
    const auth = await verifyAuth(req)
    if ("error" in auth) return NextResponse.json({ data: null, error: "Premium content requires login" }, { status: 401 })

    if ("userId" in auth) {
      const [user] = await db.select({ supporterrole: users.supporterrole, supporteruntil: users.supporteruntil })
        .from(users).where(eq(users.id, auth.userId)).limit(1)

      const isActive = user?.supporterrole && (!user.supporteruntil || user.supporteruntil > new Date())
      if (!isActive) return NextResponse.json({ data: null, error: "Premium subscription required" }, { status: 403 })
    }
  }

  const where = and(
    eq(streamcontent.status, "published"),
    type      ? eq(streamcontent.type, type)           : undefined,
    vtuberid  ? eq(streamcontent.vtuberid, vtuberid)   : undefined,
    ispremium !== undefined ? eq(streamcontent.ispremium, ispremium) : undefined,
  )

  const rows = await db
    .select({
      id: streamcontent.id, slug: streamcontent.slug, title: streamcontent.title,
      description: streamcontent.description, thumbnailurl: streamcontent.thumbnailurl,
      duration: streamcontent.duration, type: streamcontent.type,
      vtuberid: streamcontent.vtuberid, tags: streamcontent.tags,
      viewcount: streamcontent.viewcount, ispremium: streamcontent.ispremium,
      createdat: streamcontent.createdat,
    })
    .from(streamcontent)
    .where(where)
    .orderBy(desc(streamcontent.createdat))
    .limit(limit)
    .offset(offset)

  return NextResponse.json({ data: rows, error: null })
}

// GET /api/stream/:slug — metadata + HLS URL
export async function getBySlug(req: NextRequest, { params }: { params: { slug: string } }) {
  const [content] = await db
    .select()
    .from(streamcontent)
    .where(and(eq(streamcontent.slug, params.slug), eq(streamcontent.status, "published")))
    .limit(1)

  if (!content) return NextResponse.json({ data: null, error: "Content not found" }, { status: 404 })

  // Konten premium — wajib login dan punya subscription aktif
  if (content.ispremium) {
    const auth = await verifyAuth(req)
    if ("error" in auth) return NextResponse.json({ data: null, error: "Premium content requires login" }, { status: 401 })

    if ("userId" in auth) {
      const [user] = await db.select({ supporterrole: users.supporterrole, supporteruntil: users.supporteruntil })
        .from(users).where(eq(users.id, auth.userId)).limit(1)

      const isActive = user?.supporterrole && (!user.supporteruntil || user.supporteruntil > new Date())
      if (!isActive) return NextResponse.json({ data: null, error: "Premium subscription required" }, { status: 403 })
    }
  }

  // Increment viewcount
  await db.update(streamcontent)
    .set({ viewcount: (content.viewcount ?? 0) + 1 })
    .where(eq(streamcontent.id, content.id))

  return NextResponse.json({ data: content, error: null })
}
