export const dynamic = 'force-dynamic'

import { adminDb } from '@/lib/supabase/admin'
import { getSession, isStaff } from '@/lib/auth'
import { ok, err, FORBIDDEN, SERVER_ERROR } from '@/lib/api'
import { NextRequest } from 'next/server'
import { z } from 'zod'

const PostSchema = z.object({
  slug:        z.string().min(1),
  title:       z.string().min(1),
  excerpt:     z.string().optional(),
  content:     z.string().optional(),
  coverurl:    z.string().url().optional(),
  tags:        z.array(z.string()).default([]),
  ispublished: z.boolean().default(false),
})

// GET /api/admin/blog — list SEMUA post termasuk draft (staff only)
export async function GET(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session || !isStaff(session.role)) return FORBIDDEN
    const { searchParams } = new URL(req.url)
    const limit = Math.min(Number(searchParams.get('limit') ?? '100'), 200)
    const { data, error } = await adminDb()
      .from('posts')
      .select('id,slug,title,excerpt,ispublished,tags,createdat,publishedat,authorid')
      .order('createdat', { ascending: false })
      .limit(limit)
    if (error) return SERVER_ERROR
    return ok(data ?? [])
  } catch { return SERVER_ERROR }
}

// POST /api/admin/blog — buat post baru
export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session || !isStaff(session.role)) return FORBIDDEN
    const body   = await req.json()
    const parsed = PostSchema.safeParse(body)
    if (!parsed.success) return err(parsed.error.issues[0]?.message ?? 'Input tidak valid')
    const payload = {
      ...parsed.data,
      authorid:    session.id,
      publishedat: parsed.data.ispublished ? new Date().toISOString() : null,
    }
    const { data, error } = await adminDb().from('posts').insert(payload).select().single()
    if (error) return err(error.message)
    return ok(data, 201)
  } catch { return SERVER_ERROR }
}
