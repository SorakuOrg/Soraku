import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useScroll';
import { 
  MessageCircle, 
  Calendar, 
  Newspaper, 
  Users, 
  Zap,
  Shield,
  Heart,
  Sparkles
} from 'lucide-react';

const features = [
  {
    icon: MessageCircle,
    title: 'Komunitas Aktif',
    description: 'Bergabung dengan ribuan member yang aktif berdiskusi tentang anime, manga, dan budaya pop Jepang.',
    color: 'from-[#4FA3D1] to-[#4FA3D1]/60',
    bgColor: 'bg-[#4FA3D1]/10',
  },
  {
    icon: Calendar,
    title: 'Event Berkala',
    description: 'Ikuti berbagai event menarik seperti nobar anime, game night, quiz, dan gathering komunitas.',
    color: 'from-[#6E8FA6] to-[#6E8FA6]/60',
    bgColor: 'bg-[#6E8FA6]/10',
  },
  {
    icon: Newspaper,
    title: 'Konten Eksklusif',
    description: 'Dapatkan akses ke artikel, review, dan berita terbaru seputar dunia anime dan manga.',
    color: 'from-[#E8C2A8] to-[#E8C2A8]/60',
    bgColor: 'bg-[#E8C2A8]/10',
  },
  {
    icon: Users,
    title: 'Jaringan Luas',
    description: 'Bertemu dengan sesama penggemar dari berbagai daerah dan bangun pertemanan baru.',
    color: 'from-[#4FA3D1] to-[#6E8FA6]',
    bgColor: 'bg-gradient-to-br from-[#4FA3D1]/10 to-[#6E8FA6]/10',
  },
  {
    icon: Zap,
    title: 'Update Cepat',
    description: 'Dapatkan informasi terbaru tentang rilis anime, manga, dan event secara real-time.',
    color: 'from-[#6E8FA6] to-[#E8C2A8]',
    bgColor: 'bg-gradient-to-br from-[#6E8FA6]/10 to-[#E8C2A8]/10',
  },
  {
    icon: Shield,
    title: 'Lingkungan Aman',
    description: 'Komunitas yang diawasi dengan baik untuk memastikan pengalaman yang nyaman bagi semua.',
    color: 'from-[#E8C2A8] to-[#4FA3D1]',
    bgColor: 'bg-gradient-to-br from-[#E8C2A8]/10 to-[#4FA3D1]/10',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export function Features() {
  const { ref, isInView } = useInView({ threshold: 0.1, once: true });

  return (
    <section className="relative overflow-hidden bg-[#1C1E22] py-24" ref={ref as React.RefObject<HTMLDivElement>}>
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute left-0 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-[#4FA3D1]/5 blur-[100px]" />
        <div className="absolute right-0 bottom-0 h-[400px] w-[400px] rounded-full bg-[#6E8FA6]/5 blur-[80px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#4FA3D1]/30 bg-[#4FA3D1]/10 px-4 py-2">
            <Sparkles className="h-4 w-4 text-[#4FA3D1]" />
            <span className="text-sm font-medium text-[#4FA3D1]">Mengapa Soraku?</span>
          </div>
          
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Fitur Unggulan{' '}
            <span className="bg-gradient-to-r from-[#4FA3D1] to-[#6E8FA6] bg-clip-text text-transparent">
              Komunitas
            </span>
          </h2>
          
          <p className="mx-auto max-w-2xl text-lg text-[#D9DDE3]/60">
            Soraku menyediakan berbagai fitur untuk membuat pengalaman berkomunitas 
            Anda lebih menyenangkan dan bermanfaat.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="group relative"
            >
              <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-8 backdrop-blur-sm transition-all duration-300 hover:border-white/10 hover:bg-white/[0.04]">
                {/* Glow Effect */}
                <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-gradient-to-br opacity-0 blur-[60px] transition-opacity duration-300 group-hover:opacity-50" 
                  style={{ 
                    background: `linear-gradient(to bottom right, var(--tw-gradient-stops))`,
                  }}
                />

                {/* Icon */}
                <div className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl ${feature.bgColor}`}>
                  <feature.icon className={`h-7 w-7 bg-gradient-to-br ${feature.color} bg-clip-text`} style={{ color: 'inherit' }} />
                  <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${feature.color} opacity-20`} />
                </div>

                {/* Content */}
                <h3 className="mb-3 text-xl font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="text-[#D9DDE3]/60 leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover Indicator */}
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-[#4FA3D1] to-[#6E8FA6] transition-all duration-300 group-hover:w-full" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.02] px-8 py-6 backdrop-blur-sm">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#1C1E22] bg-gradient-to-br from-[#4FA3D1] to-[#6E8FA6] text-sm font-bold text-white"
                >
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <div className="text-left">
              <p className="font-semibold text-white">Bergabung Sekarang</p>
              <p className="text-sm text-[#D9DDE3]/60">Jadilah bagian dari 5,000+ member</p>
            </div>
            <div className="h-10 w-px bg-white/10" />
            <div className="flex items-center gap-2 text-[#E8C2A8]">
              <Heart className="h-5 w-5 fill-current" />
              <span className="font-semibold">Gratis!</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
