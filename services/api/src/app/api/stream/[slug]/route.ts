import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { streamcontent, users } from "@/lib/db/schema"
import { verifyAuth } from "@/lib/auth"
import { eq, and } from "drizzle-orm"

export const dynamic = "force-dynamic"

// GET /api/stream/:slug
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const [content] = await db
    .select()
    .from(streamcontent)
    .where(and(eq(streamcontent.slug, slug), eq(streamcontent.status, "published")))
    .limit(1)

  if (!content) return NextResponse.json({ data: null, error: "Content not found" }, { status: 404 })

  // Premium gating
  if (content.ispremium) {
    const auth = await verifyAuth(req)
    if ("error" in auth || !("userId" in auth)) {
      return NextResponse.json({ data: null, error: "Premium content requires login" }, { status: 401 })
    }
    const [user] = await db
      .select({ supporterrole: users.supporterrole, supporteruntil: users.supporteruntil })
      .from(users).where(eq(users.id, auth.userId)).limit(1)
    const isActive = user?.supporterrole && (!user.supporteruntil || user.supporteruntil > new Date())
    if (!isActive) return NextResponse.json({ data: null, error: "Premium subscription required" }, { status: 403 })
  }

  // Increment viewcount
  await db.update(streamcontent)
    .set({ viewcount: (content.viewcount ?? 0) + 1 })
    .where(eq(streamcontent.id, content.id))

  return NextResponse.json({ data: content, error: null })
}
