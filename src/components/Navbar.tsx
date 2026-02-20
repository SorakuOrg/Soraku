import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  Calendar, 
  Newspaper, 
  Users, 
  Info,
  Shield,
  LogIn,
  LogOut,
  User,
  ChevronDown,
  Home
} from 'lucide-react';
import { Discord } from '@/components/icons/Discord';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import { useStickyHeader } from '@/hooks/useScroll';
import { cn } from '@/lib/utils';

const navLinks = [
  { name: 'Beranda', href: '/', icon: Home },
  { name: 'Tentang', href: '/about', icon: Info },
  { name: 'Blog', href: '/blog', icon: Newspaper },
  { name: 'Event', href: '/events', icon: Calendar },
  { name: 'Komunitas', href: '/community', icon: Users },
];

export function Navbar() {
  const location = useLocation();
  const isSticky = useStickyHeader(50);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const { addToast } = useUIStore();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    addToast({
      title: 'Logout Berhasil',
      description: 'Anda telah keluar dari akun.',
      type: 'info',
    });
    setUserMenuOpen(false);
  };

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={cn(
          'fixed left-0 right-0 top-0 z-50 transition-all duration-300',
          isSticky
            ? 'bg-[#1C1E22]/80 backdrop-blur-xl shadow-lg'
            : 'bg-transparent'
        )}
      >
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#4FA3D1] to-[#6E8FA6]">
              <span className="text-lg font-bold text-white">S</span>
              <div className="absolute -right-1 -top-1 flex h-3 w-3 items-center justify-center rounded-full bg-[#E8C2A8]">
                <div className="h-1.5 w-1.5 rounded-full bg-[#1C1E22]" />
              </div>
            </div>
            <span className="hidden text-xl font-bold text-white sm:block">
              Soraku
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={cn(
                  'relative rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200',
                  isActive(link.href)
                    ? 'text-[#4FA3D1]'
                    : 'text-[#D9DDE3]/70 hover:text-white'
                )}
              >
                {isActive(link.href) && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 rounded-lg bg-[#4FA3D1]/10"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative flex items-center gap-2">
                  <link.icon className="h-4 w-4" />
                  {link.name}
                </span>
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Discord Button */}
            <a
              href="https://discord.gg/soraku"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-2 rounded-lg bg-[#5865F2]/10 px-3 py-2 text-sm font-medium text-[#5865F2] transition-all hover:bg-[#5865F2]/20 sm:flex"
            >
              <Discord className="h-4 w-4" />
              <span>Join Discord</span>
            </a>

            {/* Auth Section */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 rounded-lg p-2 transition-colors hover:bg-white/5"
                >
                  <img
                    src={user?.avatarUrl || ''}
                    alt={user?.username}
                    className="h-8 w-8 rounded-full border-2 border-[#4FA3D1]/30"
                  />
                  <span className="hidden max-w-[100px] truncate text-sm text-white sm:block">
                    {user?.username}
                  </span>
                  <ChevronDown className="h-4 w-4 text-white/50" />
                </button>

                {/* User Dropdown */}
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-white/10 bg-[#1C1E22]/95 p-1 shadow-xl backdrop-blur-xl"
                    >
                      <div className="border-b border-white/10 px-3 py-2">
                        <p className="text-sm font-medium text-white">{user?.username}</p>
                        <p className="text-xs text-white/50">{user?.email}</p>
                      </div>
                      
                      <Link
                        to="/profile"
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <User className="h-4 w-4" />
                        Profil
                      </Link>
                      
                      {user?.role === 'admin' && (
                        <Link
                          to="/admin"
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Shield className="h-4 w-4" />
                          Admin Dashboard
                        </Link>
                      )}
                      
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/10"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#4FA3D1] to-[#6E8FA6] px-4 py-2 text-sm font-medium text-white transition-all hover:opacity-90 hover:shadow-lg hover:shadow-[#4FA3D1]/20"
              >
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline">Login</span>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-2 text-white/70 transition-colors hover:bg-white/5 hover:text-white md:hidden"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 h-full w-72 bg-[#1C1E22] p-4 pt-20 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                      isActive(link.href)
                        ? 'bg-[#4FA3D1]/10 text-[#4FA3D1]'
                        : 'text-white/70 hover:bg-white/5 hover:text-white'
                    )}
                  >
                    <link.icon className="h-5 w-5" />
                    {link.name}
                  </Link>
                ))}
                
                <div className="my-2 border-t border-white/10" />
                
                <a
                  href="https://discord.gg/soraku"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-lg bg-[#5865F2]/10 px-4 py-3 text-sm font-medium text-[#5865F2]"
                >
                  <Discord className="h-5 w-5" />
                  Join Discord
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
