import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Twitter, Youtube, Twitch, Instagram, Globe } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { createServiceClient } from '@/lib/supabase'

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  youtube: <Youtube className="w-4 h-4" />,
  twitter: <Twitter className="w-4 h-4" />,
  twitch: <Twitch className="w-4 h-4" />,
  instagram: <Instagram className="w-4 h-4" />,
}

export default async function VtuberDetailPage({ params }: { params: { generation: string; slug: string } }) {
  const supabase = createServiceClient()
  const { data: vtuber } = await supabase
    .from('vtubers')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (!vtuber) notFound()

  return (
    <div className="min-h-screen bg-dark-base">
      <Navbar />
      <div className="pt-24 pb-20 px-4">
        <div className="max-w-2xl mx-auto">
          <Link href={`/vtuber/${params.generation}`} className="inline-flex items-center gap-2 text-secondary hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Generasi {params.generation.replace('generation-', '')}
          </Link>

          <div className="glass-card p-8 text-center">
            <div className="relative w-36 h-36 mx-auto mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-full opacity-20 blur-xl" />
              <div className="relative w-36 h-36 rounded-full overflow-hidden border-2 border-primary/40">
                {vtuber.avatar_url ? (
                  <Image src={vtuber.avatar_url} alt={vtuber.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
                    <span className="text-6xl font-bold text-primary">{vtuber.name[0]}</span>
                  </div>
                )}
              </div>
            </div>

            <h1 className="text-3xl font-bold text-white mb-3">{vtuber.name}</h1>
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="badge bg-primary/10 text-primary border-primary/20">Generasi {vtuber.generation}</span>
              {vtuber.agency && <span className="badge bg-accent/10 text-accent border-accent/20">{vtuber.agency}</span>}
            </div>

            {vtuber.bio && <p className="text-secondary leading-relaxed mb-8">{vtuber.bio}</p>}

            {vtuber.social_links && Object.keys(vtuber.social_links).length > 0 && (
              <div>
                <p className="text-xs text-secondary uppercase tracking-wider mb-4">Social Media</p>
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  {Object.entries(vtuber.social_links).map(([platform, url]) => (
                    <a key={platform} href={url as string} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-sm text-secondary hover:text-white border border-white/10 transition-all">
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
      <Footer />
    </div>
  )
}
