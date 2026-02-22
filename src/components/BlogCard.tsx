import Image from 'next/image'
import Link from 'next/link'
import { Calendar, User } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { BlogPostRow } from '@/lib/supabase'

interface BlogCardProps {
  post: BlogPostRow & { author_name?: string }
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="block group">
      <div className="glass-card overflow-hidden hover:border-primary/30 hover:shadow-glass hover:-translate-y-1 transition-all duration-300">
        {/* Image */}
        <div className="relative h-48 bg-gradient-to-br from-primary/20 to-secondary/20 overflow-hidden">
          {post.featured_image ? (
            <Image
              src={post.featured_image}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-6xl opacity-20">📰</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-dark-card/80 to-transparent" />
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="font-bold text-white text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="text-secondary text-sm line-clamp-3 mb-4">
              {post.excerpt}
            </p>
          )}
          <div className="flex items-center gap-4 text-xs text-secondary/70">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(post.created_at)}
            </span>
            {post.author_name && (
              <span className="flex items-center gap-1">
                <User className="w-3 h-3" />
                {post.author_name}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
