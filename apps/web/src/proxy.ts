import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  const { data: { user } } = await supabase.auth.getUser()
  const { pathname } = request.nextUrl

  // ── Permanent redirects — deprecated routes ────────────────────────────────

  // /social → hapus, bukan halaman (sesuai NAMESPACE.md)
  if (pathname === '/social' || pathname.startsWith('/social/')) {
    return NextResponse.redirect(new URL('/', request.url), 301)
  }

  // /agensi/vtuber → /vtubers
  if (pathname === '/agensi/vtuber' || pathname.startsWith('/agensi/vtuber/')) {
    const newPath = pathname.replace('/agensi/vtuber', '/vtubers')
    return NextResponse.redirect(new URL(newPath, request.url), 301)
  }

  // /premium/donatur → /donate/leaderboard
  if (pathname === '/premium/donatur' || pathname.startsWith('/premium/donatur/')) {
    return NextResponse.redirect(new URL('/donate/leaderboard', request.url), 301)
  }

  // /admin/* → /dash/admin/* (old admin routes)
  if (pathname.startsWith('/admin')) {
    const newPath = pathname.replace('/admin', '/dash/admin')
    return NextResponse.redirect(new URL(newPath, request.url), 301)
  }

  // /dashboard/* → /dash/* (old dashboard)
  if (pathname.startsWith('/dashboard')) {
    const newPath = pathname.replace('/dashboard', '/dash')
    return NextResponse.redirect(new URL(newPath, request.url), 301)
  }

  // ── Auth guards ────────────────────────────────────────────────────────────

  // /dash/* — harus login
  if (pathname.startsWith('/dash') && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // /dash/admin/* — harus OWNER / MANAGER / ADMIN
  if (pathname.startsWith('/dash/admin')) {
    if (!user) return NextResponse.redirect(new URL('/login', request.url))
    const { data } = await supabase
      .schema('soraku')
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()
    if (!['OWNER', 'MANAGER', 'ADMIN'].includes(data?.role ?? '')) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // /login /register — sudah login → redirect ke /dash/profile/me
  if ((pathname === '/login' || pathname === '/register') && user) {
    return NextResponse.redirect(new URL('/dash/profile/me', request.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
