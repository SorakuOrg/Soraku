import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { streamcontent, users } from "@/lib/db/schema"
import { verifyAuth } from "@/lib/auth"
import { getEpisodeStream, getAnimeDetail } from "@/lib/anime"
import type { AnimeSource } from "@soraku/types"
import { eq, and } from "drizzle-orm"

export const dynamic = "force-dynamic"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const { searchParams } = new URL(req.url)

  // ── Mode anime ────────────────────────────────────────────
  if (searchParams.get("anime") === "true") {
    const source = (searchParams.get("source") ?? "hianime") as AnimeSource
    const info   = searchParams.get("info") === "true"

    if (info) {
      const detail = await getAnimeDetail(slug, source)
      if (!detail) {
        return NextResponse.json({ data: null, error: "Anime tidak ditemukan" }, { status: 404 })
      }
      return NextResponse.json({ data: detail, error: null })
    }

    const quality = (searchParams.get("quality") ?? "auto") as "auto" | "1080p" | "720p" | "360p"
    const stream  = await getEpisodeStream(slug, source, quality)
    if (!stream) {
      return NextResponse.json({ data: null, error: "Stream tidak tersedia" }, { status: 404 })
    }
    return NextResponse.json({ data: stream, error: null })
  }

  // ── Mode Soraku DB ────────────────────────────────────────
  const [content] = await db
    .select()
    .from(streamcontent)
    .where(and(eq(streamcontent.slug, slug), eq(streamcontent.status, "published")))
    .limit(1)

  if (!content) {
    return NextResponse.json({ data: null, error: "Konten tidak ditemukan" }, { status: 404 })
  }

  // Premium gate
  if (content.ispremium) {
    const auth = await verifyAuth(req)
    if ("error" in auth) {
      return NextResponse.json({ data: null, error: "Login dulu untuk konten premium" }, { status: 401 })
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
    // API key / internal — trusted, lewat
  }

  // Increment viewcount (fire and forget)
  db.update(streamcontent)
    .set({ viewcount: (content.viewcount ?? 0) + 1 })
    .where(eq(streamcontent.id, content.id))
    .catch(() => {})

  return NextResponse.json({ data: content, error: null })
}
