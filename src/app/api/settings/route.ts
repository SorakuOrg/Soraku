import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createServiceClient } from '@/lib/supabase'
import { getCurrentUserRole } from '@/lib/clerk'
import { hasPermission } from '@/lib/roles'

export async function GET() {
  const supabase = createServiceClient()
  const { data } = await supabase.from('settings').select('*')
  return NextResponse.json(data || [])
}

export async function POST(request: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const role = await getCurrentUserRole()
  if (!hasPermission(role, ['MANAGER'])) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { key, value } = await request.json()
  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('settings')
    .upsert({ key, value, updated_by: userId, updated_at: new Date().toISOString() }, { onConflict: 'key' })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
