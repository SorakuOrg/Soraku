import Link from 'next/link'
import { Zap, Twitter, Youtube, MessageCircle } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-dark-base/50 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-xl text-white">Soraku</span>
            </div>
            <p className="text-secondary text-sm leading-relaxed mb-4 max-w-xs">
              Platform komunitas VTuber Indonesia. Temukan, dukung, dan bergabung bersama VTuber kesayanganmu.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://discord.gg/soraku"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-sky-500/20 text-sky-400 hover:bg-sky-500/30 transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Platform</h3>
            <ul className="space-y-2">
              {[
                { href: '/vtuber', label: 'VTuber' },
                { href: '/events', label: 'Events' },
                { href: '/blog', label: 'Blog' },
                { href: '/gallery', label: 'Gallery' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-secondary hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Info</h3>
            <ul className="space-y-2">
              {[
                { href: '/about', label: 'Tentang Kami' },
                { href: '/community', label: 'Komunitas' },
                { href: 'https://discord.gg/soraku', label: 'Discord Server' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-secondary hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-secondary text-sm">
            © {new Date().getFullYear()} Soraku Community. All rights reserved.
          </p>
          <p className="text-secondary/50 text-xs">
            Built with ❤️ for VTuber Indonesia
          </p>
        </div>
      </div>
    </footer>
  )
}
