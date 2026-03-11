import { createClient } from '@/lib/supabase/server'
import { ok, SERVER_ERROR } from '@/lib/api'

export const dynamic = 'force-dynamic'

export async function POST() {
  try {
    const supabase = await createClient()
    await supabase.auth.signOut()
    return ok({ signedOut: true })
  } catch { return SERVER_ERROR }
}
