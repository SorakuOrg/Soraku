import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { users, donatur } from "@/lib/db/schema"
import { verifyAuth, unauthorized } from "@/lib/auth"
import { eq, desc } from "drizzle-orm"

export const dynamic = "force-dynamic"

// GET /api/premium — status subscriber user yang login
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  // Kalau ada ?leaderboard=true → return top donatur publik
  if (searchParams.get("leaderboard") === "true") {
    const rows = await db
      .select()
      .from(donatur)
      .where(eq(donatur.ispublic, true))
      .orderBy(desc(donatur.amount))
      .limit(50)
    return NextResponse.json({ data: rows, error: null })
  }

  // Default: return status subscriber milik user yang login
  const auth = await verifyAuth(req)
  if ("error" in auth || !("userId" in auth)) return unauthorized()

  const [user] = await db
    .select({
      supporterrole:   users.supporterrole,
      supportersince:  users.supportersince,
      supporteruntil:  users.supporteruntil,
      supportersource: users.supportersource,
    })
    .from(users)
    .where(eq(users.id, auth.userId))
    .limit(1)

  if (!user) return NextResponse.json({ data: null, error: "User not found" }, { status: 404 })

  const isActive =
    user.supporterrole !== null &&
    (user.supporteruntil === null || user.supporteruntil > new Date())

  return NextResponse.json({ data: { ...user, isActive }, error: null })
}
