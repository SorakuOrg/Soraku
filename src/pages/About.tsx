import { motion } from 'framer-motion';
import { 
  Target, 
  Eye, 
  Heart, 
  Users, 
  Zap,
  Shield,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useInView } from '@/hooks/useScroll';

const values = [
  {
    icon: Heart,
    title: 'Passion',
    description: 'Kami percaya bahwa passion adalah bahan bakar utama untuk menciptakan komunitas yang hidup dan berkembang.',
    color: 'from-rose-500 to-pink-500',
  },
  {
    icon: Users,
    title: 'Inclusivity',
    description: 'Soraku terbuka untuk semua orang, regardless of background atau level pengetahuan tentang anime.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Zap,
    title: 'Growth',
    description: 'Kami mendorong setiap member untuk terus belajar, berkembang, dan berbagi pengetahuan.',
    color: 'from-amber-500 to-orange-500',
  },
  {
    icon: Shield,
    title: 'Safety',
    description: 'Kami berkomitmen untuk menciptakan lingkungan yang aman, nyaman, dan bebas dari toxic behavior.',
    color: 'from-emerald-500 to-teal-500',
  },
];

const milestones = [
  { year: '2020', title: 'Berdiri', description: 'Soraku didirikan oleh sekelompok penggemar anime.' },
  { year: '2021', title: '1,000 Member', description: 'Mencapai 1,000 member di Discord server.' },
  { year: '2022', title: 'Event Pertama', description: 'Mengadakan event offline pertama di Jakarta.' },
  { year: '2023', title: '5,000 Member', description: 'Mencapai 5,000 member dan meluncurkan website.' },
];

export function About() {
  const { ref, isInView } = useInView({ threshold: 0.1, once: true });

  return (
    <div className="min-h-screen bg-[#1C1E22]">
      <Navbar />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-24">
          <div className="absolute inset-0">
            <div className="absolute left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-[#4FA3D1]/10 blur-[100px]" />
            <div className="absolute right-0 bottom-0 h-[400px] w-[400px] rounded-full bg-[#6E8FA6]/10 blur-[80px]" />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#4FA3D1]/30 bg-[#4FA3D1]/10 px-4 py-2">
                <Sparkles className="h-4 w-4 text-[#4FA3D1]" />
                <span className="text-sm font-medium text-[#4FA3D1]">Tentang Kami</span>
              </div>

              <h1 className="mb-6 text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
                Cerita di Balik{' '}
                <span className="bg-gradient-to-r from-[#4FA3D1] to-[#6E8FA6] bg-clip-text text-transparent">
                  Soraku
                </span>
              </h1>

              <p className="mx-auto max-w-3xl text-lg text-[#D9DDE3]/70">
                Soraku adalah komunitas Pop Jepang & Anime yang berdiri dengan tujuan 
                untuk menghubungkan para penggemar dan menciptakan ruang yang aman 
                untuk berbagi passion.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="py-24" ref={ref as React.RefObject<HTMLDivElement>}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6 }}
                className="rounded-2xl border border-white/5 bg-white/[0.02] p-8"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-[#4FA3D1]/10">
                  <Eye className="h-7 w-7 text-[#4FA3D1]" />
                </div>
                <h2 className="mb-4 text-2xl font-bold text-white">Visi</h2>
                <p className="text-[#D9DDE3]/70 leading-relaxed">
                  Menjadi komunitas Pop Jepang & Anime terbesar dan teraktif di Indonesia 
                  yang menjadi rumah bagi para penggemar untuk berbagi, belajar, dan 
                  berkembang bersama.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="rounded-2xl border border-white/5 bg-white/[0.02] p-8"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-[#6E8FA6]/10">
                  <Target className="h-7 w-7 text-[#6E8FA6]" />
                </div>
                <h2 className="mb-4 text-2xl font-bold text-white">Misi</h2>
                <ul className="space-y-3 text-[#D9DDE3]/70">
                  <li className="flex items-start gap-3">
                    <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-[#4FA3D1]" />
                    <span>Menciptakan lingkungan yang aman dan nyaman untuk semua member.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-[#4FA3D1]" />
                    <span>Mengadakan event berkualitas yang mendidik dan menghibur.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-[#4FA3D1]" />
                    <span>Menyediakan konten informatif dan edukatif seputar budaya pop Jepang.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-[#4FA3D1]" />
                    <span>Membangun jaringan yang kuat antar sesama penggemar.</span>
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-white">Nilai-Nilai Kami</h2>
              <p className="mx-auto max-w-2xl text-[#D9DDE3]/60">
                Prinsip-prinsip yang menjadi fondasi komunitas Soraku.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group rounded-2xl border border-white/5 bg-white/[0.02] p-6 transition-all hover:border-white/10"
                >
                  <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${value.color} bg-opacity-10`}>
                    <value.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-white">{value.title}</h3>
                  <p className="text-sm text-[#D9DDE3]/60">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-24">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-white">Perjalanan Kami</h2>
              <p className="mx-auto max-w-2xl text-[#D9DDE3]/60">
                Soraku telah berkembang pesat sejak pertama kali berdiri.
              </p>
            </div>

            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-[#4FA3D1] via-[#6E8FA6] to-[#E8C2A8] sm:left-1/2 sm:-translate-x-1/2" />

              {/* Timeline Items */}
              <div className="space-y-12">
                {milestones.map((milestone, index) => (
                  <motion.div
                    key={milestone.year}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className={`relative flex items-center gap-8 ${
                      index % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'
                    }`}
                  >
                    {/* Content */}
                    <div className={`flex-1 ${index % 2 === 0 ? 'sm:text-right' : 'sm:text-left'}`}>
                      <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
                        <span className="mb-2 inline-block text-lg font-bold text-[#4FA3D1]">
                          {milestone.year}
                        </span>
                        <h3 className="mb-2 text-xl font-semibold text-white">{milestone.title}</h3>
                        <p className="text-[#D9DDE3]/60">{milestone.description}</p>
                      </div>
                    </div>

                    {/* Dot */}
                    <div className="absolute left-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border-4 border-[#1C1E22] bg-[#4FA3D1] sm:left-1/2 sm:-translate-x-1/2">
                      <div className="h-2 w-2 rounded-full bg-white" />
                    </div>

                    {/* Spacer for alternating layout */}
                    <div className="hidden flex-1 sm:block" />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
