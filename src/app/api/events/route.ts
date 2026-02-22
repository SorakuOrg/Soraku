import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createServiceClient } from '@/lib/supabase'
import { getCurrentUserRole } from '@/lib/clerk'
import { slugify } from '@/lib/utils'
import { hasPermission } from '@/lib/roles'
import { sendEventToDiscord } from '@/lib/discord'

export async function GET() {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('start_date', { ascending: true })

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
  const { title, description, banner_image, start_date, end_date, status = 'upcoming' } = body

  if (!title || !start_date || !end_date) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const slug = slugify(title)
  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('events')
    .insert({ title, slug, description, banner_image, start_date, end_date, status, organizer_id: userId })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Send to Discord webhook
  await sendEventToDiscord({ title, description, startDate: start_date, endDate: end_date, bannerImage: banner_image })

  return NextResponse.json(data, { status: 201 })
}
