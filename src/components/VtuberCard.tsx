'use client'

import Image from 'next/image'
import { Twitter, Youtube, Twitch, Instagram } from 'lucide-react'
import type { VtuberRow } from '@/lib/supabase'

interface VtuberCardProps {
  vtuber: VtuberRow
  onClick: (vtuber: VtuberRow) => void
}

export default function VtuberCard({ vtuber, onClick }: VtuberCardProps) {
  return (
    <div
      className="glass-card-hover cursor-pointer p-6 flex flex-col items-center text-center group"
      onClick={() => onClick(vtuber)}
    >
      {/* Avatar */}
      <div className="relative w-24 h-24 mb-4">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-300 blur-md" />
        <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-primary/30 group-hover:border-primary/60 transition-all duration-300">
          {vtuber.avatar_url ? (
            <Image
              src={vtuber.avatar_url}
              alt={vtuber.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
              <span className="text-3xl font-bold text-primary">
                {vtuber.name.charAt(0)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Name */}
      <h3 className="font-bold text-white text-lg mb-1 group-hover:text-primary transition-colors duration-200">
        {vtuber.name}
      </h3>

      {/* Gen badge */}
      <span className="badge bg-primary/10 text-primary border-primary/20 mb-3">
        Generasi {vtuber.generation}
      </span>

      {/* Bio preview */}
      {vtuber.bio && (
        <p className="text-secondary text-sm line-clamp-2 mb-4">
          {vtuber.bio}
        </p>
      )}

      {/* Social Links */}
      {vtuber.social_links && Object.keys(vtuber.social_links).length > 0 && (
        <div
          className="flex items-center gap-2 mt-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {vtuber.social_links.youtube && (
            <a
              href={vtuber.social_links.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
            >
              <Youtube className="w-3 h-3" />
            </a>
          )}
          {vtuber.social_links.twitter && (
            <a
              href={vtuber.social_links.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400 hover:bg-sky-500/30 transition-colors"
            >
              <Twitter className="w-3 h-3" />
            </a>
          )}
          {vtuber.social_links.twitch && (
            <a
              href={vtuber.social_links.twitch}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-colors"
            >
              <Twitch className="w-3 h-3" />
            </a>
          )}
          {vtuber.social_links.instagram && (
            <a
              href={vtuber.social_links.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg bg-pink-500/20 text-pink-400 hover:bg-pink-500/30 transition-colors"
            >
              <Instagram className="w-3 h-3" />
            </a>
          )}
        </div>
      )}
    </div>
  )
}
