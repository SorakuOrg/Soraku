import { adminDb } from '@/lib/supabase/admin'
import { ok, err } from '@/lib/api'
import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

// GET /api/users/[username]
// Returns public profile data: user + level + badges + gallery count + support total
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params

  const { data: user, error } = await adminDb()
    .from('users')
    .select('id, username, displayname, avatarurl, coverurl, bio, role, supporterrole, sociallinks, isprivate, createdat')
    .eq('username', username)
    .eq('isbanned', false)
    .maybeSingle()

  if (error || !user) return err('User tidak ditemukan', 404)

  // Profil privat — return minimal
  if (user.isprivate) {
    return ok({ id: user.id, username: user.username, displayname: user.displayname,
      avatarurl: user.avatarurl, role: user.role, supporterrole: user.supporterrole, isprivate: true })
  }

  // Level data
  const { data: levelData } = await adminDb()
    .from('userlevels')
    .select('level, xpcurrent, xprequired, reputationscore')
    .eq('userid', user.id)
    .maybeSingle()

  // Gallery count (approved only)
  const { count: galleryCount } = await adminDb()
    .from('gallery')
    .select('*', { count: 'exact', head: true })
    .eq('uploadedby', user.id)
    .eq('status', 'approved')

  // Gallery preview (last 9)
  const { data: galleryPosts } = await adminDb()
    .from('gallery')
    .select('id, imageurl, title')
    .eq('uploadedby', user.id)
    .eq('status', 'approved')
    .order('createdat', { ascending: false })
    .limit(9)

  // Support total
  const { data: donations } = await adminDb()
    .from('donatur')
    .select('amount')
    .eq('userid', user.id)
    .eq('ispublic', true)

  const supportTotal = donations?.reduce((sum, d) => sum + (d.amount ?? 0), 0) ?? 0

  // Badges
  const { data: badges } = await adminDb()
    .from('userbadges')
    .select('id, badgename, badgeicon, badgecls')
    .eq('userid', user.id)
    .order('createdat', { ascending: true })
    .limit(12)

  return ok({
    ...user,
    level: levelData ?? { level: 1, xpcurrent: 0, xprequired: 100, reputationscore: 0 },
    galleryCount: galleryCount ?? 0,
    galleryPosts: galleryPosts ?? [],
    supportTotal,
    badges: badges ?? [],
  })
}
