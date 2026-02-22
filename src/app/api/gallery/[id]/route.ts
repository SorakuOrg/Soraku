import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createServiceClient } from '@/lib/supabase'
import { getCurrentUserRole } from '@/lib/clerk'
import { hasPermission } from '@/lib/roles'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth()
  if (!userId)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const role = await getCurrentUserRole()
  if (!hasPermission(role, ['MANAGER', 'ADMIN'])) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json()

  // whitelist field yang boleh diupdate
  const allowedFields = ['status', 'caption', 'category']
  const safeUpdate: Record<string, any> = {}

  for (const key of allowedFields) {
    if (body[key] !== undefined) {
      safeUpdate[key] = body[key]
    }
  }

  safeUpdate.reviewed_by = userId
  safeUpdate.reviewed_at = new Date().toISOString()

  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('gallery')
    .update(safeUpdate)
    .eq('id', params.id)
    .select()
    .maybeSingle()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!data) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json(data)
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth()
  if (!userId)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const role = await getCurrentUserRole()
  if (!hasPermission(role, ['MANAGER'])) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('gallery')
    .delete()
    .eq('id', params.id)
    .select()
    .maybeSingle()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!data) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json({ success: true })
}
