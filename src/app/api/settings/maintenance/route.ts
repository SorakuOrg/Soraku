import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

export async function GET() {
  const supabase = createServiceClient()
  const { data } = await supabase
    .from('settings')
    .select('value')
    .eq('key', 'maintenance_mode')
    .single()

  return NextResponse.json({ maintenance: data?.value === 'true' })
}
