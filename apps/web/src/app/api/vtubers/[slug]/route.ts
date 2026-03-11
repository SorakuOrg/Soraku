export const dynamic = 'force-dynamic'

import { adminDb } from '@/lib/supabase/admin'
import { ok, err, SERVER_ERROR } from '@/lib/api'
import { NextRequest } from 'next/server'

type Params = { params: Promise<{ slug: string }> }

// GET /api/vtubers/[slug]
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { slug } = await params
    const { data, error } = await adminDb()
      .from('vtubers')
      .select('*')
      .eq('slug', slug)
      .eq('ispublished', true)
      .single()
    if (error || !data) return err('VTuber tidak ditemukan', 404)
    return ok(data)
  } catch { return SERVER_ERROR }
}
