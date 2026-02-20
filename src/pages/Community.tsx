import { motion } from 'framer-motion';
import { 
  Users, 
  MessageCircle, 
  Gamepad2, 
  Video, 
  Music,
  BookOpen,
  Palette,
  Camera,
  Code,
  Trophy,
  Gift,
  Star,
  ArrowRight
} from 'lucide-react';
import { Discord } from '@/components/icons/Discord';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useInView } from '@/hooks/useScroll';

const channels = [
  {
    category: '💬 Ruang Ngobrol',
    items: [
      { name: 'general', icon: MessageCircle, description: 'Obrolan umum seputar apa saja' },
      { name: 'introduce', icon: Users, description: 'Perkenalkan dirimu' },
      { name: 'anime-manga', icon: BookOpen, description: 'Diskusi anime & manga' },
      { name: 'recommendations', icon: Star, description: 'Rekomendasi anime/manga' },
    ],
  },
  {
    category: '🎮 Hobi & Interest',
    items: [
      { name: 'gaming', icon: Gamepad2, description: 'Main game bareng' },
      { name: 'art-corner', icon: Palette, description: 'Share karya seni' },
      { name: 'music', icon: Music, description: 'Dengerin & share musik' },
      { name: 'photography', icon: Camera, description: 'Share hasil jepretan' },
      { name: 'tech-corner', icon: Code, description: 'Diskusi teknologi' },
    ],
  },
  {
    category: '🎉 Event & Activities',
    items: [
      { name: 'event-announcements', icon: Trophy, description: 'Pengumuman event' },
      { name: 'watch-party', icon: Video, description: 'Nobar anime bareng' },
      { name: 'game-night', icon: Gamepad2, description: 'Main game komunitas' },
      { name: 'giveaways', icon: Gift, description: 'Giveaway & hadiah' },
    ],
  },
];

const benefits = [
  {
    title: 'Akses ke Semua Channel',
    description: 'Bergabung dengan berbagai channel sesuai minatmu.',
  },
  {
    title: 'Event Eksklusif',
    description: 'Ikuti event-event seru yang hanya untuk member.',
  },
  {
    title: 'Giveaway & Hadiah',
    description: 'Berkesempatan memenangkan berbagai hadiah menarik.',
  },
  {
    title: 'Jaringan Luas',
    description: 'Bertemu dengan ribuan penggemar anime dari seluruh Indonesia.',
  },
];

export function Community() {
  const { ref, isInView } = useInView({ threshold: 0.1, once: true });

  return (
    <div className="min-h-screen bg-[#1C1E22]">
      <Navbar />
      
      <main className="pt-24 pb-24">
        {/* Hero */}
        <section className="relative overflow-hidden pb-24">
          <div className="absolute inset-0">
            <div className="absolute left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-[#4FA3D1]/10 blur-[100px]" />
            <div className="absolute right-0 bottom-0 h-[400px] w-[400px] rounded-full bg-[#6E8FA6]/10 blur-[80px]" />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#4FA3D1]/30 bg-[#4FA3D1]/10 px-4 py-2">
                <Users className="h-4 w-4 text-[#4FA3D1]" />
                <span className="text-sm font-medium text-[#4FA3D1]">Komunitas Kami</span>
              </div>

              <h1 className="mb-6 text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
                Bergabung dengan{' '}
                <span className="bg-gradient-to-r from-[#4FA3D1] to-[#6E8FA6] bg-clip-text text-transparent">
                  5,000+ Member
                </span>
              </h1>

              <p className="mx-auto max-w-3xl text-lg text-[#D9DDE3]/70">
                Soraku bukan sekadar komunitas, tapi rumah bagi para penggemar anime 
                dan budaya pop Jepang. Jadilah bagian dari keluarga besar kami!
              </p>
            </motion.div>
          </div>
        </section>

        {/* Channels */}
        <section className="py-24" ref={ref as React.RefObject<HTMLDivElement>}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-white">Channel Discord</h2>
              <p className="mx-auto max-w-2xl text-[#D9DDE3]/60">
                Berbagai channel untuk berdiskusi sesuai minatmu.
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
              {channels.map((category, categoryIndex) => (
                <motion.div
                  key={category.category}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
                  className="rounded-2xl border border-white/5 bg-white/[0.02] p-6"
                >
                  <h3 className="mb-6 text-lg font-semibold text-white">{category.category}</h3>
                  <div className="space-y-4">
                    {category.items.map((item) => (
                      <div
                        key={item.name}
                        className="flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-white/5"
                      >
                        <item.icon className="mt-0.5 h-5 w-5 text-[#4FA3D1]" />
                        <div>
                          <p className="font-medium text-white">#{item.name}</p>
                          <p className="text-sm text-[#D9DDE3]/50">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-white">Keuntungan Bergabung</h2>
              <p className="mx-auto max-w-2xl text-[#D9DDE3]/60">
                Apa yang akan kamu dapatkan sebagai member Soraku?
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-6"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#4FA3D1]/10">
                    <Star className="h-6 w-6 text-[#4FA3D1]" />
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-white">{benefit.title}</h3>
                    <p className="text-[#D9DDE3]/60">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#4FA3D1]/20 to-[#6E8FA6]/20 p-12 text-center"
            >
              <h2 className="mb-4 text-3xl font-bold text-white">Siap Bergabung?</h2>
              <p className="mb-8 text-lg text-[#D9DDE3]/70">
                Jadilah bagian dari komunitas yang penuh semangat. 
                Gratis dan terbuka untuk semua!
              </p>
              <a
                href="https://discord.gg/soraku"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 rounded-xl bg-[#5865F2] px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-[#4752C4] hover:shadow-lg hover:shadow-[#5865F2]/30"
              >
                <Discord className="h-6 w-6" />
                Gabung Discord
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </a>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
