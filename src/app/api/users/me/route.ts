import { NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { createServiceClient } from '@/lib/supabase'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('clerk_user_id', userId)
    .single()

  if (error) {
    // Auto-create user if not exists
    const user = await currentUser()
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
    
    const email = user.emailAddresses[0]?.emailAddress || ''
    const username = user.username || user.firstName || email.split('@')[0]
    
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({ clerk_user_id: userId, email, username, role: 'USER' })
      .select()
      .single()
    
    if (insertError) return NextResponse.json({ role: 'USER' })
    return NextResponse.json(newUser)
  }

  return NextResponse.json(data)
}
