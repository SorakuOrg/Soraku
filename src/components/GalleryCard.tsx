'use client'

import Image from 'next/image'
import { Check, X, Eye } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { GalleryRow } from '@/lib/supabase'

interface GalleryCardProps {
  item: GalleryRow
  isAdmin?: boolean
  onApprove?: (id: string) => void
  onReject?: (id: string) => void
}

const STATUS_STYLES = {
  pending: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  approved: 'bg-green-500/20 text-green-300 border-green-500/30',
  rejected: 'bg-red-500/20 text-red-300 border-red-500/30',
}

export default function GalleryCard({ item, isAdmin, onApprove, onReject }: GalleryCardProps) {
  return (
    <div className="glass-card overflow-hidden group">
      <div className="relative aspect-square">
        <Image
          src={item.image_url}
          alt={item.caption || 'Gallery item'}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Status badge */}
        {isAdmin && (
          <div className="absolute top-2 right-2">
            <span className={cn('badge text-xs', STATUS_STYLES[item.status])}>
              {item.status}
            </span>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          {item.caption && (
            <p className="text-white text-sm font-medium line-clamp-2 mb-2">
              {item.caption}
            </p>
          )}
          <p className="text-white/60 text-xs">{item.uploader_name || 'Anonim'}</p>
        </div>
      </div>

      {/* Admin actions */}
      {isAdmin && item.status === 'pending' && (
        <div className="flex border-t border-white/5">
          <button
            onClick={() => onApprove?.(item.id)}
            className="flex-1 py-2.5 flex items-center justify-center gap-1.5 text-sm text-green-400 hover:bg-green-500/10 transition-colors"
          >
            <Check className="w-4 h-4" />
            Setuju
          </button>
          <div className="w-px bg-white/5" />
          <button
            onClick={() => onReject?.(item.id)}
            className="flex-1 py-2.5 flex items-center justify-center gap-1.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <X className="w-4 h-4" />
            Tolak
          </button>
        </div>
      )}
    </div>
  )
}
