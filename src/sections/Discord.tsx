import { motion } from 'framer-motion';
import { 
  Users, 
  MessageCircle, 
  Mic,
  Gamepad2,
  Music,
  Video,
  ArrowRight
} from 'lucide-react';
import { Discord } from '@/components/icons/Discord';
import { useInView } from '@/hooks/useScroll';
import { useDiscordPresence } from '@/hooks/useDiscord';

const channelCategories = [
  {
    name: '💬 Ruang Ngobrol',
    channels: [
      { name: 'general', icon: MessageCircle, description: 'Obrolan umum' },
      { name: 'anime-manga', icon: MessageCircle, description: 'Diskusi anime & manga' },
      { name: 'random', icon: MessageCircle, description: 'Obrolan bebas' },
    ],
  },
  {
    name: '🎤 Voice Channels',
    channels: [
      { name: 'Lounge', icon: Mic, description: 'Ngobrol santai' },
      { name: 'Gaming', icon: Gamepad2, description: 'Main game bareng' },
      { name: 'Music', icon: Music, description: 'Dengerin musik' },
      { name: 'Watch Party', icon: Video, description: 'Nobar anime' },
    ],
  },
];

export function DiscordSection() {
  const { ref, isInView } = useInView({ threshold: 0.1, once: true });
  const presence = useDiscordPresence(import.meta.env.VITE_DISCORD_SERVER_ID);
  const onlineCount = presence?.totalOnline || 0;
  const isLoading = presence?.isLoading || false;

  return (
    <section className="relative overflow-hidden bg-[#1C1E22] py-24" ref={ref as React.RefObject<HTMLDivElement>}>
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute left-0 top-1/2 h-[800px] w-[800px] -translate-y-1/2 rounded-full bg-[#5865F2]/10 blur-[150px]" />
        <div className="absolute right-0 bottom-0 h-[500px] w-[500px] rounded-full bg-[#4FA3D1]/5 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#5865F2]/30 bg-[#5865F2]/10 px-4 py-2">
              <Discord className="h-4 w-4 text-[#5865F2]" />
              <span className="text-sm font-medium text-[#5865F2]">Discord Server</span>
            </div>

            <h2 className="mb-6 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              Gabung Server{' '}
              <span className="text-[#5865F2]">Discord</span>{' '}
              Kami
            </h2>

            <p className="mb-8 text-lg leading-relaxed text-[#D9DDE3]/70">
              Jadilah bagian dari komunitas yang aktif dan ramah. Diskusikan anime favoritmu, 
              ikuti event seru, dan bertemu dengan teman-teman baru yang memiliki minat yang sama!
            </p>

            {/* Stats */}
            <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 backdrop-blur-sm">
                <div className="mb-1 text-3xl font-bold text-white">5,000+</div>
                <div className="text-sm text-[#D9DDE3]/60">Total Member</div>
              </div>
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 backdrop-blur-sm">
                <div className="mb-1 flex items-center gap-2 text-3xl font-bold text-emerald-400">
                  {isLoading ? '...' : onlineCount || '100+'}
                  <span className="relative flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
                  </span>
                </div>
                <div className="text-sm text-[#D9DDE3]/60">Online Sekarang</div>
              </div>
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 backdrop-blur-sm">
                <div className="mb-1 text-3xl font-bold text-white">50+</div>
                <div className="text-sm text-[#D9DDE3]/60">Channel</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <a
                href="https://discord.gg/soraku"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded-xl bg-[#5865F2] px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-[#4752C4] hover:shadow-lg hover:shadow-[#5865F2]/30"
              >
                <Discord className="h-6 w-6" />
                Gabung Discord
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </motion.div>

          {/* Right Content - Server Preview */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-2xl border border-[#5865F2]/20 bg-[#2B2D31] p-6 shadow-2xl">
              {/* Server Header */}
              <div className="mb-6 flex items-center gap-4 border-b border-white/5 pb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#4FA3D1] to-[#6E8FA6]">
                  <span className="text-xl font-bold text-white">S</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white">Soraku Community</h3>
                  <p className="text-sm text-[#D9DDE3]/50">Komunitas Pop Jepang & Anime</p>
                </div>
              </div>

              {/* Channels */}
              <div className="space-y-6">
                {channelCategories.map((category) => (
                  <div key={category.name}>
                    <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#D9DDE3]/40">
                      {category.name}
                    </h4>
                    <div className="space-y-1">
                      {category.channels.map((channel) => (
                        <div
                          key={channel.name}
                          className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-[#D9DDE3]/60 transition-colors hover:bg-white/5 hover:text-white"
                        >
                          <channel.icon className="h-4 w-4" />
                          <span className="text-sm">{channel.name}</span>
                          <span className="ml-auto text-xs text-[#D9DDE3]/40">
                            {channel.description}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* User Panel */}
              <div className="mt-6 flex items-center gap-3 rounded-xl bg-[#1C1E22] p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#4FA3D1] to-[#6E8FA6]">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">Guest User</p>
                  <p className="text-xs text-[#D9DDE3]/50">#0000</p>
                </div>
                <div className="flex gap-2">
                  <div className="h-3 w-3 rounded-full bg-emerald-500" />
                  <div className="h-3 w-3 rounded-full bg-gray-500" />
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-[#5865F2]/20 blur-2xl" />
              <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-[#4FA3D1]/20 blur-2xl" />
            </div>

            {/* Floating Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="absolute -right-4 top-1/4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 backdrop-blur-sm"
            >
              <div className="flex items-center gap-2">
                <div className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
                </div>
                <span className="text-sm font-medium text-emerald-400">
                  {isLoading ? '...' : onlineCount || '100+'} Online
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
