import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Star } from 'lucide-react';
import { useInView } from '@/hooks/useScroll';

export function CTA() {
  const { ref, isInView } = useInView({ threshold: 0.1, once: true });

  return (
    <section className="relative overflow-hidden bg-[#1C1E22] py-24" ref={ref as React.RefObject<HTMLDivElement>}>
      {/* Background */}
      <div className="absolute inset-0">
        {/* Gradient Orbs */}
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-[#4FA3D1]/20 via-[#6E8FA6]/20 to-[#E8C2A8]/20 blur-[120px]" />
        
        {/* Animated Rings */}
        <svg className="absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 opacity-10">
          <motion.circle
            cx="400"
            cy="400"
            r="300"
            fill="none"
            stroke="url(#gradient1)"
            strokeWidth="1"
            initial={{ pathLength: 0, rotate: 0 }}
            animate={{ pathLength: 1, rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          />
          <motion.circle
            cx="400"
            cy="400"
            r="250"
            fill="none"
            stroke="url(#gradient2)"
            strokeWidth="1"
            initial={{ pathLength: 0, rotate: 0 }}
            animate={{ pathLength: 1, rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          />
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4FA3D1" />
              <stop offset="100%" stopColor="#6E8FA6" />
            </linearGradient>
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6E8FA6" />
              <stop offset="100%" stopColor="#E8C2A8" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#E8C2A8]/30 bg-[#E8C2A8]/10 px-4 py-2">
            <Sparkles className="h-4 w-4 text-[#E8C2A8]" />
            <span className="text-sm font-medium text-[#E8C2A8]">Mulai Perjalananmu</span>
          </div>

          {/* Title */}
          <h2 className="mb-6 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Siap Bergabung dengan{' '}
            <span className="bg-gradient-to-r from-[#4FA3D1] via-[#6E8FA6] to-[#E8C2A8] bg-clip-text text-transparent">
              Komunitas Kami?
            </span>
          </h2>

          {/* Description */}
          <p className="mx-auto mb-10 max-w-2xl text-lg text-[#D9DDE3]/70">
            Jangan lewatkan kesempatan untuk menjadi bagian dari komunitas yang penuh semangat. 
            Daftar sekarang dan mulai perjalananmu bersama Soraku!
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="https://discord.gg/soraku"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center gap-3 rounded-xl bg-gradient-to-r from-[#4FA3D1] to-[#6E8FA6] px-8 py-4 text-lg font-semibold text-white transition-all hover:shadow-lg hover:shadow-[#4FA3D1]/30"
            >
              <Star className="h-5 w-5" />
              Gabung Sekarang
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </a>

            <Link
              to="/about"
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-white/10"
            >
              Pelajari Lebih Lanjut
            </Link>
          </div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-8"
          >
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#1C1E22] bg-gradient-to-br from-[#4FA3D1] to-[#6E8FA6] text-xs font-bold text-white"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <span className="text-sm text-[#D9DDE3]/60">5,000+ Member</span>
            </div>

            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="h-4 w-4 fill-[#E8C2A8] text-[#E8C2A8]" />
              ))}
              <span className="ml-2 text-sm text-[#D9DDE3]/60">4.9 Rating</span>
            </div>

            <div className="text-sm text-[#D9DDE3]/60">
              <span className="text-[#4FA3D1]">100%</span> Gratis
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
