import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Clock, 
  User, 
  Eye,
  TrendingUp
} from 'lucide-react';
import { useInView } from '@/hooks/useScroll';
import { useBlogStore } from '@/stores/blogStore';
import { formatRelativeTime } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string | null;
  category: string;
  featured: boolean;
  view_count: number;
  published_at: string | null;
  created_at: string;
}

function BlogCard({ post, featured = false }: { post: BlogPost; featured?: boolean }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm transition-all duration-300 hover:border-white/10 hover:bg-white/[0.04]',
        featured && 'sm:col-span-2 lg:col-span-2'
      )}
    >
      <div className={cn('flex flex-col', featured && 'sm:flex-row')}>
        {/* Image */}
        <div className={cn(
          'relative overflow-hidden',
          featured ? 'sm:w-1/2 h-64 sm:h-auto' : 'h-48'
        )}>
          <img
            src={post.featured_image || `https://placehold.co/600x400/1C1E22/4FA3D1?text=${encodeURIComponent(post.title)}`}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1E22] via-transparent to-transparent" />
          
          {/* Category */}
          <div className="absolute left-4 top-4">
            <span className="rounded-full bg-[#4FA3D1]/90 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
              {post.category}
            </span>
          </div>

          {/* Featured Badge */}
          {post.featured && (
            <div className="absolute right-4 top-4">
              <span className="rounded-full bg-[#E8C2A8]/90 px-3 py-1 text-xs font-medium text-[#1C1E22] backdrop-blur-sm">
                Featured
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className={cn('flex flex-col justify-between p-6', featured && 'sm:w-1/2 sm:p-8')}>
          <div>
            {/* Meta */}
            <div className="mb-3 flex flex-wrap items-center gap-4 text-xs text-[#D9DDE3]/50">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{formatRelativeTime(post.published_at || post.created_at)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                <span>{post.view_count} views</span>
              </div>
            </div>

            <h3 className={cn(
              'mb-3 font-semibold text-white transition-colors group-hover:text-[#4FA3D1]',
              featured ? 'text-2xl sm:text-3xl' : 'text-lg'
            )}>
              {post.title}
            </h3>
            
            <p className={cn(
              'line-clamp-2 text-[#D9DDE3]/60',
              featured && 'line-clamp-3'
            )}>
              {post.excerpt}
            </p>
          </div>

          {/* Footer */}
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#4FA3D1] to-[#6E8FA6]">
                <User className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm text-[#D9DDE3]/70">Admin</span>
            </div>

            <Link
              to={`/blog/${post.slug}`}
              className="flex items-center gap-2 text-sm font-medium text-[#4FA3D1] transition-colors hover:text-[#6E8FA6]"
            >
              Baca Selengkapnya
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export function Blog() {
  const { ref, isInView } = useInView({ threshold: 0.1, once: true });
  const { featuredPosts, fetchFeaturedPosts, isLoading } = useBlogStore();

  useEffect(() => {
    fetchFeaturedPosts(4);
  }, [fetchFeaturedPosts]);

  const featuredPost = featuredPosts.find(p => p.featured) || featuredPosts[0];
  const otherPosts = featuredPosts.filter(p => p.id !== featuredPost?.id).slice(0, 3);

  return (
    <section className="relative overflow-hidden bg-[#1C1E22] py-24" ref={ref as React.RefObject<HTMLDivElement>}>
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-[#6E8FA6]/5 blur-[100px]" />
        <div className="absolute right-0 bottom-0 h-[400px] w-[400px] rounded-full bg-[#4FA3D1]/5 blur-[80px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end"
        >
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#4FA3D1]/30 bg-[#4FA3D1]/10 px-4 py-2">
              <TrendingUp className="h-4 w-4 text-[#4FA3D1]" />
              <span className="text-sm font-medium text-[#4FA3D1]">Artikel Terbaru</span>
            </div>
            
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Dari{' '}
              <span className="bg-gradient-to-r from-[#4FA3D1] to-[#6E8FA6] bg-clip-text text-transparent">
                Blog Soraku
              </span>
            </h2>
            
            <p className="mt-3 max-w-xl text-lg text-[#D9DDE3]/60">
              Baca artikel menarik seputar anime, manga, dan budaya pop Jepang.
            </p>
          </div>

          <Link
            to="/blog"
            className="group flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-white/10"
          >
            Lihat Semua Artikel
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>

        {/* Blog Grid */}
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={cn('animate-pulse rounded-2xl bg-white/5', i === 1 && 'sm:col-span-2')} />
            ))}
          </div>
        ) : featuredPosts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredPost && (
              <BlogCard post={featuredPost} featured />
            )}
            {otherPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-12 text-center">
            <TrendingUp className="mx-auto mb-4 h-12 w-12 text-[#D9DDE3]/30" />
            <h3 className="mb-2 text-xl font-semibold text-white">Belum Ada Artikel</h3>
            <p className="text-[#D9DDE3]/60">Nantikan artikel-artikel menarik dari kami!</p>
          </div>
        )}
      </div>
    </section>
  );
}
