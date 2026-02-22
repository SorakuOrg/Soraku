import { Suspense } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BlogCard from '@/components/BlogCard'
import { createServiceClient } from '@/lib/supabase'

async function BlogList() {
  const supabase = createServiceClient()
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-20 text-secondary">
        <div className="text-6xl mb-4">📰</div>
        <p>Belum ada artikel blog</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => <BlogCard key={post.id} post={post} />)}
    </div>
  )
}

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-dark-base">
      <Navbar />
      <div className="pt-24 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h1 className="page-title">Blog</h1>
            <p className="text-secondary text-lg">Berita dan update terbaru dari komunitas Soraku</p>
          </div>
          <Suspense fallback={<div className="grid grid-cols-1 md:grid-cols-3 gap-6">{[...Array(6)].map((_, i) => <div key={i} className="glass-card h-72 animate-pulse" />)}</div>}>
            <BlogList />
          </Suspense>
        </div>
      </div>
      <Footer />
    </div>
  )
}
