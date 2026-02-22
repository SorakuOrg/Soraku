import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createServiceClient } from '@/lib/supabase'
import { getCurrentUserRole } from '@/lib/clerk'
import { hasPermission } from '@/lib/roles'

function applyIdOrSlug(query: any, value: string) {
  return query.or(`id.eq.${value},slug.eq.${value}`)
}

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createServiceClient()

  const { data, error } = await applyIdOrSlug(
    supabase.from('events').select('*'),
    params.id
  ).maybeSingle()

  if (error || !data) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json(data)
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const role = await getCurrentUserRole()
  if (!hasPermission(role, ['MANAGER', 'AGENSI'])) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json()

  // whitelist field yang boleh diupdate
  const allowedFields = ['title', 'description', 'date', 'location', 'slug', 'status']
  const safeUpdate: Record<string, any> = {}

  for (const key of allowedFields) {
    if (body[key] !== undefined) {
      safeUpdate[key] = body[key]
    }
  }

  safeUpdate.updated_at = new Date().toISOString()

  const supabase = createServiceClient()

  const { data, error } = await applyIdOrSlug(
    supabase.from('events').update(safeUpdate).select(),
    params.id
  ).maybeSingle()

  if (error || !data) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const role = await getCurrentUserRole()
  if (!hasPermission(role, ['MANAGER'])) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const supabase = createServiceClient()

  const { error } = await applyIdOrSlug(
    supabase.from('events').delete(),
    params.id
  )

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
