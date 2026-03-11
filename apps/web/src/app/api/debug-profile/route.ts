import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// TEMPORARY: diagnostic endpoint — hapus setelah fix
export async function GET() {
  const result: Record<string, unknown> = {}

  // 1. Cek ENV vars tersedia
  result.env = {
    supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey:     !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    serviceKey:  !!process.env.SUPABASE_SERVICE_ROLE_KEY,
  }

  // 2. Cek session dari cookie
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    result.authUser = user ? { id: user.id, email: user.email } : null
    result.authError = error?.message ?? null
  } catch (e) {
    result.authError = String(e)
  }

  // 3. Cek admin client bisa query soraku.users
  try {
    const admin = createAdminClient()
    const { data, error } = await admin
      .schema('soraku')
      .from('users')
      .select('id, username, role')
      .limit(3)
    result.dbUsers = data
    result.dbError = error?.message ?? null
  } catch (e) {
    result.dbError = String(e)
  }

  return NextResponse.json(result)
}
