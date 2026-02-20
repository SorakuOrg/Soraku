import { motion } from 'framer-motion';
import { FileText, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export function Terms() {
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
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#6E8FA6]/10">
                <FileText className="h-8 w-8 text-[#6E8FA6]" />
              </div>
              <h1 className="mb-4 text-4xl font-bold text-white">Terms of Service</h1>
              <p className="text-[#D9DDE3]/60">Terakhir diperbarui: {new Date().toLocaleDateString('id-ID')}</p>
            </div>

            {/* Content */}
            <div className="prose prose-invert max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white">1. Penerimaan Syarat</h2>
                <p className="text-[#D9DDE3]/70">
                  Dengan mengakses dan menggunakan layanan Soraku, Anda menyetujui untuk terikat oleh 
                  syarat dan ketentuan ini. Jika Anda tidak setuju dengan bagian mana pun dari syarat 
                  ini, Anda tidak diperkenankan menggunakan layanan kami.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white">2. Deskripsi Layanan</h2>
                <p className="text-[#D9DDE3]/70">
                  Soraku adalah platform komunitas untuk para penggemar budaya pop Jepang, anime, dan manga. 
                  Layanan kami mencakup:
                </p>
                <ul className="list-disc pl-6 text-[#D9DDE3]/70">
                  <li>Discord server untuk diskusi dan interaksi</li>
                  <li>Event online dan offline</li>
                  <li>Konten blog dan artikel</li>
                  <li>Manajemen profil dan partisipasi komunitas</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white">3. Kriteria Member</h2>
                <p className="text-[#D9DDE3]/70">
                  Untuk menjadi member Soraku, Anda harus:
                </p>
                <ul className="list-disc pl-6 text-[#D9DDE3]/70">
                  <li>Berusia minimal 13 tahun</li>
                  <li>Memiliki akun Discord yang valid</li>
                  <li>Menyetujui syarat dan ketentuan ini</li>
                  <li>Mematuhi aturan komunitas</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white">4. Aturan Komunitas</h2>
                <p className="text-[#D9DDE3]/70">
                  Semua member wajib mematuhi aturan berikut:
                </p>
                <ul className="list-disc pl-6 text-[#D9DDE3]/70">
                  <li>Bersikap sopan dan menghormati member lain</li>
                  <li>Tidak melakukan spam atau promosi tanpa izin</li>
                  <li>Tidak membagikan konten NSFW atau tidak pantas</li>
                  <li>Tidak melakukan pelecehan, bullying, atau diskriminasi</li>
                  <li>Tidak menyebarkan informasi pribadi orang lain (doxing)</li>
                  <li>Tidak melakukan aktivitas ilegal</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white">5. Akun dan Keamanan</h2>
                <p className="text-[#D9DDE3]/70">
                  Anda bertanggung jawab untuk menjaga keamanan akun Anda. Soraku tidak bertanggung 
                  jawab atas akses tidak sah ke akun Anda yang disebabkan oleh kelalaian Anda dalam 
                  menjaga kerahasiaan informasi login.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white">6. Konten Pengguna</h2>
                <p className="text-[#D9DDE3]/70">
                  Dengan mengunggah konten ke platform kami, Anda memberikan Soraku lisensi non-eksklusif 
                  untuk menggunakan, menyimpan, dan menampilkan konten tersebut untuk keperluan operasional 
                  platform. Anda tetap memiliki hak atas konten yang Anda buat.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white">7. Penghentian</h2>
                <p className="text-[#D9DDE3]/70">
                  Soraku berhak menangguhkan atau menghentikan akses Anda ke layanan kami jika Anda 
                  melanggar syarat dan ketentuan ini. Keputusan penghentian bersifat final dan dapat 
                  dilakukan tanpa pemberitahuan sebelumnya dalam kasus pelanggaran serius.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-white">8. Perubahan Syarat</h2>
                <p className="text-[#D9DDE3]/70">
                  Kami berhak mengubah syarat dan ketentuan ini kapan saja. Perubahan akan diumumkan 
                  melalui website dan Discord server kami. Penggunaan layanan yang berkelanjutan 
                  setelah perubahan berarti Anda menerima syarat yang telah diperbarui.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white">9. Hubungi Kami</h2>
                <p className="text-[#D9DDE3]/70">
                  Jika Anda memiliki pertanyaan tentang syarat dan ketentuan ini, silakan hubungi kami di{' '}
                  <a href="mailto:legal@soraku.id" className="text-[#4FA3D1] hover:underline">
                    legal@soraku.id
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
