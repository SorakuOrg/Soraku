import { createClient } from '@supabase/supabase-js'

/** Admin client — bypass RLS. HANYA di API routes server-side. */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  )
}

/** Admin query ke schema soraku */
export function adminDb() {
  return createAdminClient().schema('soraku')
}
