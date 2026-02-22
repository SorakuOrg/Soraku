import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/about',
  '/community',
  '/blog',
  '/blog/(.*)',
  '/events',
  '/events/(.*)',
  '/vtuber',
  '/vtuber/(.*)',
  '/gallery',
  '/maintenance',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/discord',
  '/api/blog(.*)',
  '/api/events(.*)',
  '/api/vtuber(.*)',
  '/api/gallery(.*)',
  '/api/settings(.*)',
])

export default clerkMiddleware(async (auth, request: NextRequest) => {
  const url = request.nextUrl
  const maintenanceMode = process.env.MAINTENANCE_MODE === 'true'

  // ── Maintenance Mode ──────────────────────────────────────
  if (maintenanceMode) {
    const bypass = ['/maintenance', '/sign-in', '/sign-up', '/api/discord', '/admin']
    const isAllowed = bypass.some((p) => url.pathname.startsWith(p))
    if (!isAllowed) {
      return NextResponse.redirect(new URL('/maintenance', request.url))
    }
  }

  // ── Protect non-public routes ─────────────────────────────
  if (!isPublicRoute(request)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
