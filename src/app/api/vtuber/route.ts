import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createServiceClient } from '@/lib/supabase'
import { getCurrentUserRole } from '@/lib/clerk'
import { slugify } from '@/lib/utils'
import { hasPermission } from '@/lib/roles'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const generation = searchParams.get('generation')
  
  const supabase = createServiceClient()
  let query = supabase.from('vtubers').select('*').order('name')
  
  if (generation) {
    query = query.eq('generation', parseInt(generation))
  }

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const role = await getCurrentUserRole()
  if (!hasPermission(role, ['MANAGER', 'AGENSI'])) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json()
  const { name, bio, avatar_url, generation, agency, social_links } = body

  if (!name || !generation) {
    return NextResponse.json({ error: 'Name and generation required' }, { status: 400 })
  }

  const slug = slugify(name)
  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('vtubers')
    .insert({ name, slug, bio, avatar_url, generation: parseInt(generation), agency, social_links: social_links || {}, created_by: userId })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
