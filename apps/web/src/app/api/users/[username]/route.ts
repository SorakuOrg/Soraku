import { adminDb } from '@/lib/supabase/admin'
import { ok, err } from '@/lib/api'
import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

// GET /api/users/[username] — public profile by username
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params

  const { data, error } = await adminDb()
    .from('users')
    .select('id, username, displayname, avatarurl, coverurl, bio, role, supporterrole, sociallinks, isprivate, createdat')
    .eq('username', username)
    .eq('isbanned', false)
    .maybeSingle()

  if (error || !data) return err('User tidak ditemukan', 404)
  if (data.isprivate) {
    // Return terbatas untuk profil privat
    return ok({
      id: data.id,
      username: data.username,
      displayname: data.displayname,
      avatarurl: data.avatarurl,
      role: data.role,
      supporterrole: data.supporterrole,
      isprivate: true,
    })
  }
  return ok(data)
}
