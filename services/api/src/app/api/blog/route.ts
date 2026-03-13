import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { posts } from "@/lib/db/schema"
import { BlogQuerySchema } from "@/lib/validators"
import { eq, and, ilike, desc, sql } from "drizzle-orm"

export const dynamic = "force-dynamic"

// GET /api/blog
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const parsed = BlogQuerySchema.safeParse(Object.fromEntries(searchParams))
  if (!parsed.success) return NextResponse.json({ data: null, error: parsed.error.issues[0]?.message }, { status: 400 })

  const { tag, search, page, limit } = parsed.data
  const offset = (page - 1) * limit

  const rows = await db
    .select({
      id: posts.id, slug: posts.slug, title: posts.title,
      excerpt: posts.excerpt, coverurl: posts.coverurl,
      tags: posts.tags, publishedat: posts.publishedat, authorid: posts.authorid,
    })
    .from(posts)
    .where(and(
      eq(posts.ispublished, true),
      search ? ilike(posts.title, `%${search}%`) : undefined,
      tag    ? sql`${tag} = ANY(${posts.tags})` : undefined,
    ))
    .orderBy(desc(posts.publishedat))
    .limit(limit)
    .offset(offset)

  return NextResponse.json({ data: rows, error: null })
}
