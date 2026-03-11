import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''

// Support dua nama ENV — SUPABASE_SERVICE_ROLE_KEY (standar) atau SUPABASE_SERVICE_KEY (legacy)
const SERVICE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  process.env.SUPABASE_SERVICE_KEY ??
  ''

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error(
    '[supabase/admin] ⚠ Missing ENV:',
    !SUPABASE_URL ? 'NEXT_PUBLIC_SUPABASE_URL' : '',
    !SERVICE_KEY  ? 'SUPABASE_SERVICE_ROLE_KEY' : '',
  )
}

/** Admin client — bypass RLS. HANYA di API routes server-side. */
export function createAdminClient() {
  return createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

/** Admin query ke schema soraku */
export function adminDb() {
  return createAdminClient().schema('soraku')
}
