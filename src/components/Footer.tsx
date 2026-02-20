import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Twitter, 
  Instagram, 
  Youtube,
  Mail,
  MapPin,
  Heart,
  ExternalLink
} from 'lucide-react';
import { Discord } from '@/components/icons/Discord';

const footerLinks = {
  komunitas: [
    { name: 'Tentang Kami', href: '/about' },
    { name: 'Blog', href: '/blog' },
    { name: 'Event', href: '/events' },
    { name: 'Discord', href: 'https://discord.gg/soraku', external: true },
  ],
  sumber: [
    { name: 'Dokumentasi', href: '#' },
    { name: 'FAQ', href: '#' },
    { name: 'Panduan', href: '#' },
    { name: 'Status', href: '#' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '#' },
  ],
};

const socialLinks = [
  { name: 'Discord', icon: Discord, href: 'https://discord.gg/soraku' },
  { name: 'Twitter', icon: Twitter, href: '#' },
  { name: 'Instagram', icon: Instagram, href: '#' },
  { name: 'YouTube', icon: Youtube, href: '#' },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/5 bg-[#1C1E22]">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/4 -top-1/2 h-[600px] w-[600px] rounded-full bg-[#4FA3D1]/5 blur-3xl" />
        <div className="absolute -right-1/4 bottom-0 h-[400px] w-[400px] rounded-full bg-[#6E8FA6]/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#4FA3D1] to-[#6E8FA6]">
                <span className="text-xl font-bold text-white">S</span>
              </div>
              <div>
                <span className="block text-2xl font-bold text-white">Soraku</span>
                <span className="text-sm text-[#D9DDE3]/60">Komunitas Pop Jepang & Anime</span>
              </div>
            </Link>
            
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#D9DDE3]/70">
              Soraku adalah komunitas yang berkembang bersama untuk para penggemar 
              budaya pop Jepang, anime, dan manga. Bergabunglah dengan kami dan 
              jadilah bagian dari keluarga besar Soraku!
            </p>

            {/* Social Links */}
            <div className="mt-6 flex gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-[#D9DDE3]/60 transition-colors hover:bg-[#4FA3D1]/10 hover:text-[#4FA3D1]"
                >
                  <social.icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Komunitas
            </h3>
            <ul className="space-y-3">
              {footerLinks.komunitas.map((link) => (
                <li key={link.name}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-1 text-sm text-[#D9DDE3]/60 transition-colors hover:text-white"
                    >
                      {link.name}
                      <ExternalLink className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                    </a>
                  ) : (
                    <Link
                      to={link.href}
                      className="text-sm text-[#D9DDE3]/60 transition-colors hover:text-white"
                    >
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Sumber Daya
            </h3>
            <ul className="space-y-3">
              {footerLinks.sumber.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-[#D9DDE3]/60 transition-colors hover:text-white"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Legal
            </h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-[#D9DDE3]/60 transition-colors hover:text-white"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Contact */}
            <div className="mt-6 space-y-2">
              <a
                href="mailto:hello@soraku.id"
                className="flex items-center gap-2 text-sm text-[#D9DDE3]/60 transition-colors hover:text-white"
              >
                <Mail className="h-4 w-4" />
                hello@soraku.id
              </a>
              <div className="flex items-center gap-2 text-sm text-[#D9DDE3]/60">
                <MapPin className="h-4 w-4" />
                Indonesia
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 sm:flex-row">
          <p className="text-sm text-[#D9DDE3]/50">
            &copy; {new Date().getFullYear()} Soraku Community. All rights reserved.
          </p>
          <p className="flex items-center gap-1 text-sm text-[#D9DDE3]/50">
            Dibuat dengan <Heart className="h-4 w-4 text-red-400" /> untuk komunitas
          </p>
        </div>
      </div>
    </footer>
  );
}
