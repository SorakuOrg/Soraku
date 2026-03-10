import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { UserSession } from '@/lib/supabase/types'

export async function getSession(): Promise<UserSession | null> {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) return null

    const { data } = await createAdminClient()
      .schema('soraku')
      .from('users')
      .select('username, displayname, avatarurl, role, supporterrole')
      .eq('id', user.id)
      .single()

    const meta = user.user_metadata ?? {}

    return {
      id:            user.id,
      username:      data?.username      ?? meta.user_name ?? meta.preferred_username ?? null,
      displayname:   data?.displayname   ?? meta.full_name ?? meta.name ?? null,
      avatarurl:     data?.avatarurl     ?? meta.avatar_url ?? meta.picture ?? null,
      email:         user.email          ?? null,
      role:          data?.role          ?? 'USER',
      supporterrole: data?.supporterrole ?? null,
      issupporter:   data?.supporterrole != null,
    }
  } catch { return null }
}

export const isStaff   = (r: string) => ['OWNER','MANAGER','ADMIN'].includes(r)
export const isManager = (r: string) => ['OWNER','MANAGER'].includes(r)
export const isOwner   = (r: string) => r === 'OWNER'
