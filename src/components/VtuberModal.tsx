'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { X, Twitter, Youtube, Twitch, Instagram, Globe } from 'lucide-react'
import type { VtuberRow } from '@/lib/supabase'

interface VtuberModalProps {
  vtuber: VtuberRow | null
  onClose: () => void
}

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  youtube: <Youtube className="w-4 h-4" />,
  twitter: <Twitter className="w-4 h-4" />,
  twitch: <Twitch className="w-4 h-4" />,
  instagram: <Instagram className="w-4 h-4" />,
  website: <Globe className="w-4 h-4" />,
}

const SOCIAL_STYLES: Record<string, string> = {
  youtube: 'bg-red-500/20 text-red-400 hover:bg-red-500/30',
  twitter: 'bg-sky-500/20 text-sky-400 hover:bg-sky-500/30',
  twitch: 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30',
  instagram: 'bg-pink-500/20 text-pink-400 hover:bg-pink-500/30',
  website: 'bg-green-500/20 text-green-400 hover:bg-green-500/30',
}

export default function VtuberModal({ vtuber, onClose }: VtuberModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEsc)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = 'unset'
    }
  }, [onClose])

  if (!vtuber) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg glass-card p-8 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-secondary hover:text-white hover:bg-white/10 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          {/* Avatar */}
          <div className="relative w-32 h-32 mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-full opacity-30 blur-lg" />
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-primary/40">
              {vtuber.avatar_url ? (
                <Image
                  src={vtuber.avatar_url}
                  alt={vtuber.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
                  <span className="text-5xl font-bold text-primary">
                    {vtuber.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Name & Gen */}
          <h2 className="text-2xl font-bold text-white mb-2">{vtuber.name}</h2>
          <div className="flex items-center gap-2 mb-4">
            <span className="badge bg-primary/10 text-primary border-primary/20">
              Generasi {vtuber.generation}
            </span>
            {vtuber.agency && (
              <span className="badge bg-accent/10 text-accent border-accent/20">
                {vtuber.agency}
              </span>
            )}
          </div>

          {/* Bio */}
          {vtuber.bio && (
            <p className="text-secondary text-sm leading-relaxed mb-6 max-w-sm">
              {vtuber.bio}
            </p>
          )}

          {/* Divider */}
          <div className="w-full border-t border-white/5 mb-6" />

          {/* Social Links */}
          {vtuber.social_links && Object.keys(vtuber.social_links).length > 0 && (
            <div>
              <p className="text-xs text-secondary uppercase tracking-wider mb-3">
                Social Media
              </p>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                {Object.entries(vtuber.social_links).map(([platform, url]) => (
                  <a
                    key={platform}
                    href={url as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      SOCIAL_STYLES[platform] || SOCIAL_STYLES.website
                    }`}
                  >
                    {SOCIAL_ICONS[platform] || <Globe className="w-4 h-4" />}
                    <span className="capitalize">{platform}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
