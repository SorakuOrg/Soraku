import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Calendar, User } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { createServiceClient } from '@/lib/supabase'
import { formatDate } from '@/lib/utils'

export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
  const supabase = createServiceClient()
  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (!post) notFound()

  return (
    <div className="min-h-screen bg-dark-base">
      <Navbar />
      <div className="pt-24 pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          <Link href="/blog" className="inline-flex items-center gap-2 text-secondary hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Blog
          </Link>

          {post.featured_image && (
            <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-8">
              <Image src={post.featured_image} alt={post.title} fill className="object-cover" />
            </div>
          )}

          <div className="flex items-center gap-4 text-sm text-secondary mb-4">
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{formatDate(post.created_at)}</span>
            {post.author_name && <span className="flex items-center gap-1.5"><User className="w-4 h-4" />{post.author_name}</span>}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">{post.title}</h1>

          <div className="glass-card p-8 prose prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br/>') }} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
