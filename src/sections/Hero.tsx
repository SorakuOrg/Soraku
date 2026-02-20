import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Users, 
  Calendar, 
  Sparkles,
  Play
} from 'lucide-react';
import { Discord } from '@/components/icons/Discord';
import { useDiscordWidget } from '@/hooks/useDiscord';

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  const { onlineCount } = useDiscordWidget(import.meta.env.VITE_DISCORD_SERVER_ID);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen overflow-hidden bg-[#1C1E22]"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orbs */}
        <motion.div
          style={{ y }}
          className="absolute -left-[20%] -top-[20%] h-[800px] w-[800px] rounded-full bg-[#4FA3D1]/20 blur-[120px]"
        />
        <motion.div
          style={{ y }}
          className="absolute -right-[20%] top-[20%] h-[600px] w-[600px] rounded-full bg-[#6E8FA6]/20 blur-[100px]"
        />
        <motion.div
          style={{ y }}
          className="absolute bottom-[10%] left-[30%] h-[400px] w-[400px] rounded-full bg-[#E8C2A8]/10 blur-[80px]"
        />

        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(79, 163, 209, 0.5) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(79, 163, 209, 0.5) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-1 w-1 rounded-full bg-[#4FA3D1]/40"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <motion.div
        style={{ opacity, scale }}
        className="relative z-10 flex min-h-screen items-center justify-center px-4 pt-16"
      >
        <div className="mx-auto max-w-6xl text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#4FA3D1]/30 bg-[#4FA3D1]/10 px-4 py-2 backdrop-blur-sm"
          >
            <Sparkles className="h-4 w-4 text-[#4FA3D1]" />
            <span className="text-sm font-medium text-[#4FA3D1]">
              Komunitas Pop Jepang & Anime
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-6 text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Berkembang Bersama{' '}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-[#4FA3D1] via-[#6E8FA6] to-[#E8C2A8] bg-clip-text text-transparent">
                Soraku
              </span>
              <motion.svg
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="absolute -bottom-2 left-0 h-3 w-full"
                viewBox="0 0 200 12"
                fill="none"
              >
                <motion.path
                  d="M2 10C50 2 150 2 198 10"
                  stroke="url(#gradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#4FA3D1" />
                    <stop offset="50%" stopColor="#6E8FA6" />
                    <stop offset="100%" stopColor="#E8C2A8" />
                  </linearGradient>
                </defs>
              </motion.svg>
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mb-10 max-w-2xl text-lg text-[#D9DDE3]/70 sm:text-xl"
          >
            Bergabunglah dengan komunitas yang penuh semangat untuk berbagi, 
            belajar, dan berkembang bersama dalam dunia budaya pop Jepang, anime, dan manga.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <a
              href="https://discord.gg/soraku"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center gap-3 rounded-xl bg-[#5865F2] px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-[#4752C4] hover:shadow-lg hover:shadow-[#5865F2]/30"
            >
              <Discord className="h-6 w-6" />
              Gabung Discord
              <motion.span
                className="absolute -right-1 -top-1 flex h-3 w-3"
              >
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500" />
              </motion.span>
            </a>
            
            <Link
              to="/events"
              className="group flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-8 py-4 text-lg font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/30"
            >
              <Play className="h-5 w-5" />
              Lihat Event
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-8 sm:gap-12"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#4FA3D1]/10">
                <Users className="h-6 w-6 text-[#4FA3D1]" />
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold text-white">5,000+</p>
                <p className="text-sm text-[#D9DDE3]/60">Member</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#6E8FA6]/10">
                <Discord className="h-6 w-6 text-[#6E8FA6]" />
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold text-white">{onlineCount || '100+'}</p>
                <p className="text-sm text-[#D9DDE3]/60">Online</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E8C2A8]/10">
                <Calendar className="h-6 w-6 text-[#E8C2A8]" />
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold text-white">50+</p>
                <p className="text-sm text-[#D9DDE3]/60">Event/Bulan</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs text-[#D9DDE3]/40">Scroll untuk eksplor</span>
          <div className="h-12 w-6 rounded-full border-2 border-[#D9DDE3]/20 p-1">
            <motion.div
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="h-2 w-full rounded-full bg-[#4FA3D1]"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
