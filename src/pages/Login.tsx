import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Discord } from '@/components/icons/Discord';
import { useAuth } from '@/hooks/useAuth';
import { getDiscordAuthUrl } from '@/lib/discord';

export function Login() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, handleDiscordCallback } = useAuth();

  // Check for Discord OAuth callback
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes('access_token')) {
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get('access_token');
      
      if (accessToken) {
        handleDiscordCallback(accessToken).then((success) => {
          if (success) {
            const redirect = sessionStorage.getItem('redirectAfterLogin') || '/';
            sessionStorage.removeItem('redirectAfterLogin');
            navigate(redirect);
          }
        });
      }
    }
  }, [handleDiscordCallback, navigate]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/');
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleDiscordLogin = () => {
    const authUrl = getDiscordAuthUrl();
    window.location.href = authUrl;
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#1C1E22] p-4">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-1/4 h-[500px] w-[500px] rounded-full bg-[#4FA3D1]/10 blur-[120px]" />
        <div className="absolute right-1/4 bottom-1/4 h-[400px] w-[400px] rounded-full bg-[#6E8FA6]/10 blur-[100px]" />
        <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#5865F2]/10 blur-[80px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md"
      >
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="absolute -top-16 left-0 flex items-center gap-2 text-[#D9DDE3]/60 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-5 w-5" />
          Kembali
        </button>

        {/* Card */}
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl">
          {/* Header */}
          <div className="border-b border-white/5 p-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-[#4FA3D1] to-[#6E8FA6]">
              <span className="text-2xl font-bold text-white">S</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Selamat Datang Kembali</h1>
            <p className="mt-2 text-[#D9DDE3]/60">
              Masuk untuk melanjutkan ke Soraku
            </p>
          </div>

          {/* Content */}
          <div className="p-8">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className="mb-4 h-10 w-10 animate-spin text-[#4FA3D1]" />
                <p className="text-[#D9DDE3]/60">Memproses login...</p>
              </div>
            ) : (
              <>
                {/* Discord Login Button */}
                <button
                  onClick={handleDiscordLogin}
                  className="group flex w-full items-center justify-center gap-3 rounded-xl bg-[#5865F2] px-6 py-4 text-lg font-semibold text-white transition-all hover:bg-[#4752C4] hover:shadow-lg hover:shadow-[#5865F2]/30"
                >
                  <Discord className="h-6 w-6" />
                  Login dengan Discord
                </button>

                {/* Divider */}
                <div className="my-6 flex items-center gap-4">
                  <div className="h-px flex-1 bg-white/10" />
                  <span className="text-sm text-[#D9DDE3]/40">atau</span>
                  <div className="h-px flex-1 bg-white/10" />
                </div>

                {/* Guest Option */}
                <button
                  onClick={() => navigate('/')}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-medium text-white transition-all hover:bg-white/10"
                >
                  Lanjutkan sebagai Tamu
                </button>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-white/5 p-6 text-center">
            <p className="text-sm text-[#D9DDE3]/50">
              Dengan login, Anda menyetujui{' '}
              <a href="/terms" className="text-[#4FA3D1] hover:underline">
                Terms of Service
              </a>{' '}
              dan{' '}
              <a href="/privacy" className="text-[#4FA3D1] hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 grid grid-cols-3 gap-4 text-center"
        >
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
            <div className="mb-2 text-2xl font-bold text-[#4FA3D1]">5K+</div>
            <div className="text-xs text-[#D9DDE3]/50">Member</div>
          </div>
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
            <div className="mb-2 text-2xl font-bold text-[#6E8FA6]">50+</div>
            <div className="text-xs text-[#D9DDE3]/50">Event/Bulan</div>
          </div>
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
            <div className="mb-2 text-2xl font-bold text-[#E8C2A8]">100%</div>
            <div className="text-xs text-[#D9DDE3]/50">Gratis</div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
