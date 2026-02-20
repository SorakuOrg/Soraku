import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';
import { useInView } from '@/hooks/useScroll';

const testimonials = [
  {
    id: 1,
    name: 'Ahmad Rizky',
    role: 'Member since 2023',
    avatar: 'AR',
    content: 'Soraku adalah tempat terbaik untuk berbagi passion tentang anime. Komunitasnya sangat ramah dan aktif!',
    rating: 5,
  },
  {
    id: 2,
    name: 'Siti Nurhaliza',
    role: 'Member since 2022',
    avatar: 'SN',
    content: 'Event-eventnya seru banget! Dari nobar sampai game night, selalu ada keseruan setiap minggu.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Budi Santoso',
    role: 'Member since 2023',
    avatar: 'BS',
    content: 'Adminnya responsif dan komunitasnya well-managed. Recommended buat yang cari teman ngobrol anime!',
    rating: 5,
  },
  {
    id: 4,
    name: 'Dewi Kusuma',
    role: 'Member since 2022',
    avatar: 'DK',
    content: 'Dari yang cuma nonton anime sendirian, sekarang punya banyak teman dengan interest yang sama. Thanks Soraku!',
    rating: 5,
  },
  {
    id: 5,
    name: 'Eko Prasetyo',
    role: 'Member since 2023',
    avatar: 'EP',
    content: 'Website dan Discord servernya very organized. Informasi event selalu up-to-date. Keep it up!',
    rating: 5,
  },
  {
    id: 6,
    name: 'Maya Angelina',
    role: 'Member since 2022',
    avatar: 'MA',
    content: 'Soraku bukan cuma komunitas, tapi udah kayak keluarga kedua. Banyak kenangan seru di sini!',
    rating: 5,
  },
];

function TestimonialCard({ testimonial, index }: { testimonial: typeof testimonials[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group relative"
    >
      <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-sm transition-all duration-300 hover:border-white/10 hover:bg-white/[0.04]">
        {/* Quote Icon */}
        <Quote className="mb-4 h-8 w-8 text-[#4FA3D1]/30" />

        {/* Content */}
        <p className="mb-6 text-[#D9DDE3]/80 leading-relaxed">
          "{testimonial.content}"
        </p>

        {/* Rating */}
        <div className="mb-4 flex gap-1">
          {[...Array(testimonial.rating)].map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-[#E8C2A8] text-[#E8C2A8]" />
          ))}
        </div>

        {/* Author */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#4FA3D1] to-[#6E8FA6] text-sm font-bold text-white">
            {testimonial.avatar}
          </div>
          <div>
            <p className="font-semibold text-white">{testimonial.name}</p>
            <p className="text-sm text-[#D9DDE3]/50">{testimonial.role}</p>
          </div>
        </div>

        {/* Glow Effect */}
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#4FA3D1]/10 blur-[60px] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
    </motion.div>
  );
}

export function Testimonials() {
  const { ref, isInView } = useInView({ threshold: 0.1, once: true });

  return (
    <section className="relative overflow-hidden bg-[#1C1E22] py-24" ref={ref as React.RefObject<HTMLDivElement>}>
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute left-0 top-1/3 h-[500px] w-[500px] rounded-full bg-[#E8C2A8]/5 blur-[100px]" />
        <div className="absolute right-0 bottom-1/3 h-[400px] w-[400px] rounded-full bg-[#4FA3D1]/5 blur-[80px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#E8C2A8]/30 bg-[#E8C2A8]/10 px-4 py-2">
            <Star className="h-4 w-4 text-[#E8C2A8]" />
            <span className="text-sm font-medium text-[#E8C2A8]">Testimoni Member</span>
          </div>
          
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Apa Kata{' '}
            <span className="bg-gradient-to-r from-[#E8C2A8] to-[#4FA3D1] bg-clip-text text-transparent">
              Member Kami?
            </span>
          </h2>
          
          <p className="mx-auto max-w-2xl text-lg text-[#D9DDE3]/60">
            Dengarkan pengalaman langsung dari para member Soraku yang telah 
            bergabung dengan komunitas kami.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 grid grid-cols-2 gap-8 border-t border-white/5 pt-12 sm:grid-cols-4"
        >
          <div className="text-center">
            <p className="text-4xl font-bold text-white">5,000+</p>
            <p className="mt-1 text-sm text-[#D9DDE3]/60">Member Aktif</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-white">4.9</p>
            <p className="mt-1 text-sm text-[#D9DDE3]/60">Rating Rata-rata</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-white">50+</p>
            <p className="mt-1 text-sm text-[#D9DDE3]/60">Event/Bulan</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-white">100%</p>
            <p className="mt-1 text-sm text-[#D9DDE3]/60">Gratis</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
