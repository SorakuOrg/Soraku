import { auth, currentUser } from '@clerk/nextjs/server'
import { createServiceClient } from './supabase'
import type { Role } from './roles'

export async function getCurrentUserRole(): Promise<Role | null> {
  const { userId } = await auth()
  if (!userId) return null

  try {
    const supabase = createServiceClient()
    const { data } = await supabase
      .from('users')
      .select('role')
      .eq('clerk_user_id', userId)
      .single()

    return (data?.role as Role) || 'USER'
  } catch {
    return 'USER'
  }
}

export async function syncUserToSupabase() {
  const user = await currentUser()
  if (!user) return null

  try {
    const supabase = createServiceClient()
    const email = user.emailAddresses[0]?.emailAddress || ''
    const username = user.username || user.firstName || email.split('@')[0]

    const { data, error } = await supabase
      .from('users')
      .upsert(
        {
          clerk_user_id: user.id,
          email,
          username,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'clerk_user_id',
          ignoreDuplicates: false,
        }
      )
      .select()
      .single()

    if (error) console.error('Sync user error:', error)
    return data
  } catch (error) {
    console.error('syncUserToSupabase error:', error)
    return null
  }
}
