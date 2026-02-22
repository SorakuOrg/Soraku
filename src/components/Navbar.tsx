'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { UserButton, SignInButton, useUser } from '@clerk/nextjs'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/', label: 'Beranda' },
  { href: '/vtuber', label: 'VTuber' },
  { href: '/events', label: 'Events' },
  { href: '/blog', label: 'Blog' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/about', label: 'Tentang' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { isSignedIn } = useUser()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-base/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-primary/30 group-hover:border-primary/60 transition-all duration-300">
              <Image
                src="https://blogger.googleusercontent.com/img/a/AVvXsEhlhs4Uhd-DSMY2uER618DpZkDLuupIyT5GmQDqdMmM31HF3XGi1om60_82VyP_P4r7aZlpqz8zCXNFe_-qfsBRQ63m_NcTD_viFP5pTpR4-sgfTGfK0BSUpjixF8N7eZdV7oki8kkq5uivp_Xo=w150-h150-p-k-no-nu-rw-e90"
                alt="Soraku Logo"
                fill
                className="object-cover"
              />
            </div>
            <span className="font-bold text-xl text-white group-hover:text-primary transition-colors duration-200">
              Soraku
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  pathname === link.href
                    ? 'bg-primary/20 text-primary'
                    : 'text-secondary hover:text-white hover:bg-white/5'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth */}
          <div className="hidden md:flex items-center gap-3">
            {isSignedIn ? (
              <div className="flex items-center gap-3">
                <Link href="/admin" className="text-sm text-secondary hover:text-white transition-colors">
                  Admin
                </Link>
                <UserButton afterSignOutUrl="/" />
              </div>
            ) : (
              <SignInButton mode="modal">
                <button className="btn-primary text-sm">Masuk</button>
              </SignInButton>
            )}
          </div>

          {/* Mobile btn */}
          <button className="md:hidden text-secondary hover:text-white" onClick={() => setOpen(!open)}>
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-dark-card border-t border-white/5 px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)}
              className={cn('block px-4 py-3 rounded-lg text-sm font-medium transition-all',
                pathname === link.href ? 'bg-primary/20 text-primary' : 'text-secondary hover:text-white hover:bg-white/5'
              )}>
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-white/5">
            {isSignedIn ? (
              <div className="flex items-center gap-3 px-4">
                <UserButton afterSignOutUrl="/" />
                <Link href="/admin" className="text-sm text-secondary hover:text-white">Admin Panel</Link>
              </div>
            ) : (
              <SignInButton mode="modal">
                <button className="w-full btn-primary text-sm">Masuk</button>
              </SignInButton>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
