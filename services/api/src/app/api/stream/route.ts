import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { streamcontent, users } from "@/lib/db/schema"
import { StreamQuerySchema, AnimeSearchQuerySchema } from "@/lib/validators"
import { verifyAuth } from "@/lib/auth"
import { searchAnime } from "@/lib/anime"
import { eq, and, desc } from "drizzle-orm"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  // ── Mode anime search ─────────────────────────────────────
  if (searchParams.get("anime") === "true") {
    const parsed = AnimeSearchQuerySchema.safeParse(Object.fromEntries(searchParams))
    if (!parsed.success) {
      return NextResponse.json({ data: null, error: parsed.error.issues[0]?.message }, { status: 400 })
    }
    const { q, source, page } = parsed.data
    const results = await searchAnime(q, source, page)
    return NextResponse.json({ data: results, error: null })
  }

  // ── Mode Soraku DB ────────────────────────────────────────
  const parsed = StreamQuerySchema.safeParse(Object.fromEntries(searchParams))
  if (!parsed.success) {
    return NextResponse.json({ data: null, error: parsed.error.issues[0]?.message }, { status: 400 })
  }

  const { type, vtuberid, ispremium, page, limit } = parsed.data
  const offset = (page - 1) * limit

  // Premium gate
  if (ispremium) {
    const auth = await verifyAuth(req)
    if ("error" in auth) {
      return NextResponse.json({ data: null, error: "Konten premium — login dulu" }, { status: 401 })
    }
    const userId = ("userId" in auth && typeof auth.userId === "string") ? auth.userId : null
    if (userId) {
      const [user] = await db
        .select({ supporterrole: users.supporterrole, supporteruntil: users.supporteruntil })
        .from(users).where(eq(users.id, userId)).limit(1)
      const isActive = user?.supporterrole && (!user.supporteruntil || user.supporteruntil > new Date())
      if (!isActive) {
        return NextResponse.json({ data: null, error: "Butuh subscription premium" }, { status: 403 })
      }
    }
    // API key client — boleh lewat (trusted service)
  }

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
    .where(and(
      eq(streamcontent.status, "published"),
      type      ? eq(streamcontent.type, type)         : undefined,
      vtuberid  ? eq(streamcontent.vtuberid, vtuberid) : undefined,
      ispremium !== undefined ? eq(streamcontent.ispremium, ispremium) : undefined,
    ))
    .orderBy(desc(streamcontent.createdat))
    .limit(limit)
    .offset(offset)

  return NextResponse.json({ data: rows, error: null })
}
