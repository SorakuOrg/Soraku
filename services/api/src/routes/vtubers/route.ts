import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { vtubers } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"

export const dynamic = "force-dynamic"

// GET /api/vtubers — semua vtuber yang published & active
export async function GET(_req: NextRequest) {
  const rows = await db
    .select()
    .from(vtubers)
    .where(and(eq(vtubers.ispublished, true), eq(vtubers.isactive, true)))
    .orderBy(vtubers.name)

  return NextResponse.json({ data: rows, error: null })
}

// GET /api/vtubers/:slug
export async function getBySlug(_req: NextRequest, { params }: { params: { slug: string } }) {
  const [vtuber] = await db
    .select()
    .from(vtubers)
    .where(and(eq(vtubers.slug, params.slug), eq(vtubers.ispublished, true)))
    .limit(1)

  if (!vtuber) return NextResponse.json({ data: null, error: "VTuber not found" }, { status: 404 })
  return NextResponse.json({ data: vtuber, error: null })
}
