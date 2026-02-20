import { motion } from 'framer-motion';
import { Shield, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export function Privacy() {
  return (
    <div className="min-h-screen bg-[#1C1E22]">
      <Navbar />
      
      <main className="pt-24 pb-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 text-[#D9DDE3]/60 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
            Kembali ke Beranda
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Header */}
            <div className="mb-12 text-center">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#4FA3D1]/10">
                <Shield className="h-8 w-8 text-[#4FA3D1]" />
              </div>
              <h1 className="mb-4 text-4xl font-bold text-white">Privacy Policy</h1>
              <p className="text-[#D9DDE3]/60">Terakhir diperbarui: {new Date().toLocaleDateString('id-ID')}</p>
            </div>

            {/* Content */}
            <div className="prose prose-invert max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white">1. Informasi yang Kami Kumpulkan</h2>
                <p className="text-[#D9DDE3]/70">
                  Kami mengumpulkan informasi yang Anda berikan saat mendaftar dan menggunakan layanan kami, termasuk:
                </p>
                <ul className="list-disc pl-6 text-[#D9DDE3]/70">
                  <li>Informasi akun Discord (username, avatar, email)</li>
                  <li>Data profil yang Anda lengkapi</li>
                  <li>Riwayat partisipasi event</li>
                  <li>Interaksi dalam komunitas</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white">2. Penggunaan Informasi</h2>
                <p className="text-[#D9DDE3]/70">
                  Informasi yang kami kumpulkan digunakan untuk:
                </p>
                <ul className="list-disc pl-6 text-[#D9DDE3]/70">
                  <li>Mengelola akun dan memberikan akses ke layanan</li>
                  <li>Mengirim notifikasi tentang event dan update</li>
                  <li>Meningkatkan pengalaman pengguna</li>
                  <li>Keperluan analitik dan pengembangan</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white">3. Perlindungan Data</h2>
                <p className="text-[#D9DDE3]/70">
                  Kami mengambil langkah-langkah keamanan yang sesuai untuk melindungi informasi Anda dari akses, 
                  pengubahan, pengungkapan, atau penghancuran yang tidak sah. Data disimpan dengan enkripsi dan 
                  akses terbatas hanya untuk pihak yang berwenang.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white">4. Berbagi Informasi</h2>
                <p className="text-[#D9DDE3]/70">
                  Kami tidak menjual atau menyewakan informasi pribadi Anda kepada pihak ketiga. 
                  Informasi hanya dibagikan dalam kasus berikut:
                </p>
                <ul className="list-disc pl-6 text-[#D9DDE3]/70">
                  <li>Dengan persetujuan Anda</li>
                  <li>Untuk mematuhi kewajiban hukum</li>
                  <li>Untuk melindungi hak dan keamanan komunitas</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white">5. Hak Pengguna</h2>
                <p className="text-[#D9DDE3]/70">
                  Anda memiliki hak untuk:
                </p>
                <ul className="list-disc pl-6 text-[#D9DDE3]/70">
                  <li>Mengakses data pribadi Anda</li>
                  <li>Meminta koreksi data yang tidak akurat</li>
                  <li>Meminta penghapusan data</li>
                  <li>Menarik persetujuan penggunaan data</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white">6. Perubahan Kebijakan</h2>
                <p className="text-[#D9DDE3]/70">
                  Kami dapat memperbarui kebijakan privasi ini dari waktu ke waktu. Perubahan akan 
                  diumumkan melalui website dan Discord server kami.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white">7. Hubungi Kami</h2>
                <p className="text-[#D9DDE3]/70">
                  Jika Anda memiliki pertanyaan tentang kebijakan privasi ini, silakan hubungi kami di{' '}
                  <a href="mailto:privacy@soraku.id" className="text-[#4FA3D1] hover:underline">
                    privacy@soraku.id
                  </a>
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
