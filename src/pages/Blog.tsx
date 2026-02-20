import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, 
  Calendar, 
  User, 
  Eye, 
  ArrowLeft,
  Tag,
  Clock,
  Share2,
  Bookmark
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useBlogStore } from '@/stores/blogStore';

import { formatDate, formatRelativeTime } from '@/lib/utils';
import { cn } from '@/lib/utils';

// Blog List Page
function BlogList() {
  const { posts, categories, fetchPosts, fetchCategories, isLoading } = useBlogStore();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCategories();
    fetchPosts({ category: selectedCategory || undefined, search: searchQuery || undefined });
  }, [fetchCategories, fetchPosts, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-[#1C1E22]">
      <Navbar />
      
      <main className="pt-24 pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 text-center"
          >
            <h1 className="mb-4 text-4xl font-bold text-white">Blog Soraku</h1>
            <p className="mx-auto max-w-2xl text-lg text-[#D9DDE3]/60">
              Artikel menarik seputar anime, manga, dan budaya pop Jepang.
            </p>
          </motion.div>

          {/* Search & Filter */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#D9DDE3]/40" />
              <input
                type="text"
                placeholder="Cari artikel..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-12 pr-4 text-white placeholder:text-[#D9DDE3]/40 focus:border-[#4FA3D1] focus:outline-none focus:ring-1 focus:ring-[#4FA3D1]"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={cn(
                  'rounded-lg px-4 py-2 text-sm font-medium transition-all',
                  selectedCategory === null
                    ? 'bg-[#4FA3D1] text-white'
                    : 'bg-white/5 text-[#D9DDE3]/70 hover:bg-white/10 hover:text-white'
                )}
              >
                Semua
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={cn(
                    'rounded-lg px-4 py-2 text-sm font-medium transition-all',
                    selectedCategory === category
                      ? 'bg-[#4FA3D1] text-white'
                      : 'bg-white/5 text-[#D9DDE3]/70 hover:bg-white/10 hover:text-white'
                  )}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Posts Grid */}
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-96 animate-pulse rounded-2xl bg-white/5" />
              ))}
            </div>
          ) : posts.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] transition-all hover:border-white/10"
                >
                  <Link to={`/blog/${post.slug}`}>
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={post.featured_image || `https://placehold.co/600x400/1C1E22/4FA3D1?text=${encodeURIComponent(post.title)}`}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1C1E22] via-transparent to-transparent" />
                      <div className="absolute left-4 top-4">
                        <span className="rounded-full bg-[#4FA3D1]/90 px-3 py-1 text-xs font-medium text-white">
                          {post.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="mb-3 flex items-center gap-4 text-xs text-[#D9DDE3]/50">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatRelativeTime(post.published_at || post.created_at)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {post.view_count} views
                        </span>
                      </div>
                      <h3 className="mb-2 text-lg font-semibold text-white transition-colors group-hover:text-[#4FA3D1]">
                        {post.title}
                      </h3>
                      <p className="line-clamp-2 text-sm text-[#D9DDE3]/60">
                        {post.excerpt}
                      </p>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-12 text-center">
              <p className="text-[#D9DDE3]/60">Tidak ada artikel ditemukan.</p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

// Blog Detail Page
function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { currentPost, fetchPostBySlug, incrementViewCount, isLoading } = useBlogStore();

  useEffect(() => {
    if (slug) {
      fetchPostBySlug(slug);
      incrementViewCount(slug);
    }
  }, [slug, fetchPostBySlug, incrementViewCount]);

  if (isLoading || !currentPost) {
    return (
      <div className="min-h-screen bg-[#1C1E22]">
        <Navbar />
        <main className="flex min-h-screen items-center justify-center pt-16">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#4FA3D1] border-t-transparent" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1C1E22]">
      <Navbar />
      
      <main className="pt-24 pb-24">
        <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link
            to="/blog"
            className="mb-8 inline-flex items-center gap-2 text-[#D9DDE3]/60 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
            Kembali ke Blog
          </Link>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="mb-4 flex flex-wrap items-center gap-4">
              <span className="rounded-full bg-[#4FA3D1]/10 px-3 py-1 text-sm font-medium text-[#4FA3D1]">
                {currentPost.category}
              </span>
              {currentPost.featured && (
                <span className="rounded-full bg-[#E8C2A8]/10 px-3 py-1 text-sm font-medium text-[#E8C2A8]">
                  Featured
                </span>
              )}
            </div>
            
            <h1 className="mb-6 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              {currentPost.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-sm text-[#D9DDE3]/60">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#4FA3D1] to-[#6E8FA6]">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span>Admin</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(currentPost.published_at || currentPost.created_at)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>5 menit baca</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span>{currentPost.view_count} views</span>
              </div>
            </div>
          </motion.div>

          {/* Featured Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <img
              src={currentPost.featured_image || `https://placehold.co/1200x600/1C1E22/4FA3D1?text=${encodeURIComponent(currentPost.title)}`}
              alt={currentPost.title}
              className="w-full rounded-2xl"
            />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="prose prose-invert prose-lg max-w-none"
          >
            <div dangerouslySetInnerHTML={{ __html: currentPost.content }} />
          </motion.div>

          {/* Tags */}
          {currentPost.tags && currentPost.tags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-12 flex flex-wrap items-center gap-2"
            >
              <Tag className="h-4 w-4 text-[#D9DDE3]/40" />
              {currentPost.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-white/5 px-3 py-1 text-sm text-[#D9DDE3]/60"
                >
                  #{tag}
                </span>
              ))}
            </motion.div>
          )}

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 flex items-center gap-4 border-t border-white/5 pt-8"
          >
            <button className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 text-sm text-[#D9DDE3]/60 transition-colors hover:bg-white/10 hover:text-white">
              <Share2 className="h-4 w-4" />
              Bagikan
            </button>
            <button className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 text-sm text-[#D9DDE3]/60 transition-colors hover:bg-white/10 hover:text-white">
              <Bookmark className="h-4 w-4" />
              Simpan
            </button>
          </motion.div>
        </article>
      </main>
      
      <Footer />
    </div>
  );
}

// Export both components
export { BlogList, BlogDetail };
