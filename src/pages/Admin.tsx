import { useState, useEffect } from 'react';
import { Navigate, Link, Routes, Route, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  FileText,
  Calendar,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  BarChart3,
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useBlogStore } from '@/stores/blogStore';
import { useEventStore } from '@/stores/eventStore';
import { cn } from '@/lib/utils';

// Admin Layout
function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuthStore();
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Blog', href: '/admin/blog', icon: FileText },
    { name: 'Events', href: '/admin/events', icon: Calendar },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex min-h-screen bg-[#1C1E22]">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen transition-all duration-300 lg:static',
          sidebarOpen ? 'w-64' : 'w-0 lg:w-20'
        )}
      >
        <div className="flex h-full flex-col border-r border-white/5 bg-[#1C1E22]">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#4FA3D1] to-[#6E8FA6]">
                <span className="text-lg font-bold text-white">S</span>
              </div>
              {sidebarOpen && (
                <span className="text-xl font-bold text-white">Soraku</span>
              )}
            </Link>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="rounded-lg p-2 text-white/60 hover:bg-white/5 lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                  isActive(item.href)
                    ? 'bg-[#4FA3D1]/10 text-[#4FA3D1]'
                    : 'text-[#D9DDE3]/60 hover:bg-white/5 hover:text-white',
                  !sidebarOpen && 'justify-center lg:justify-center'
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {sidebarOpen && <span>{item.name}</span>}
              </Link>
            ))}
          </nav>

          {/* User */}
          <div className="border-t border-white/5 p-4">
            <div className={cn('flex items-center gap-3', !sidebarOpen && 'justify-center')}>
              <img
                src={user?.avatarUrl || ''}
                alt={user?.username}
                className="h-10 w-10 rounded-full border-2 border-[#4FA3D1]/30"
              />
              {sidebarOpen && (
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-white">{user?.username}</p>
                  <p className="truncate text-xs text-[#D9DDE3]/50 capitalize">{user?.role}</p>
                </div>
              )}
            </div>
            {sidebarOpen && (
              <button
                onClick={logout}
                className="mt-3 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/10"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/5 bg-[#1C1E22]/80 px-4 backdrop-blur-xl">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-lg p-2 text-white/60 hover:bg-white/5"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-sm text-[#D9DDE3]/60 hover:text-white"
            >
              Lihat Website
            </Link>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

// Dashboard
function Dashboard() {
  const stats = [
    { name: 'Total Users', value: '5,234', change: '+12%', trend: 'up' },
    { name: 'Blog Posts', value: '156', change: '+5%', trend: 'up' },
    { name: 'Events', value: '48', change: '-2%', trend: 'down' },
    { name: 'Active Now', value: '234', change: '+8%', trend: 'up' },
  ];

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold text-white">Dashboard</h1>

      {/* Stats */}
      <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="rounded-2xl border border-white/5 bg-white/[0.02] p-6"
          >
            <p className="text-sm text-[#D9DDE3]/60">{stat.name}</p>
            <div className="mt-2 flex items-end justify-between">
              <p className="text-3xl font-bold text-white">{stat.value}</p>
              <div className={cn(
                'flex items-center gap-1 text-sm',
                stat.trend === 'up' ? 'text-emerald-400' : 'text-red-400'
              )}>
                {stat.trend === 'up' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                {stat.change}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
          <h2 className="mb-4 text-lg font-semibold text-white">Aktivitas Terbaru</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4 rounded-lg bg-white/5 p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4FA3D1]/10">
                  <BarChart3 className="h-5 w-5 text-[#4FA3D1]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white">User baru bergabung</p>
                  <p className="text-xs text-[#D9DDE3]/50">2 menit yang lalu</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
          <h2 className="mb-4 text-lg font-semibold text-white">Event Mendatang</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 rounded-lg bg-white/5 p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E8C2A8]/10">
                  <Calendar className="h-5 w-5 text-[#E8C2A8]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white">Nobar Anime Episode {i}</p>
                  <p className="text-xs text-[#D9DDE3]/50">Besok, 19:00 WIB</p>
                </div>
                <ChevronRight className="h-5 w-5 text-[#D9DDE3]/40" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Blog Management
function BlogManagement() {
  const { posts, fetchPosts } = useBlogStore();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-white">Manajemen Blog</h1>
        <Link
          to="/admin/blog/new"
          className="flex items-center gap-2 rounded-xl bg-[#4FA3D1] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#3d8ab8]"
        >
          <Plus className="h-4 w-4" />
          Artikel Baru
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#D9DDE3]/40" />
          <input
            type="text"
            placeholder="Cari artikel..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-12 pr-4 text-white placeholder:text-[#D9DDE3]/40 focus:border-[#4FA3D1] focus:outline-none"
          />
        </div>
      </div>

      {/* Posts Table */}
      <div className="overflow-hidden rounded-2xl border border-white/5">
        <table className="w-full">
          <thead className="bg-white/5">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-[#D9DDE3]/60">Judul</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-[#D9DDE3]/60">Kategori</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-[#D9DDE3]/60">Status</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-[#D9DDE3]/60">Views</th>
              <th className="px-6 py-4 text-right text-sm font-medium text-[#D9DDE3]/60">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredPosts.map((post) => (
              <tr key={post.id} className="hover:bg-white/[0.02]">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={post.featured_image || `https://placehold.co/100x100/1C1E22/4FA3D1?text=${post.title.charAt(0)}`}
                      alt={post.title}
                      className="h-10 w-10 rounded-lg object-cover"
                    />
                    <span className="font-medium text-white">{post.title}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-[#D9DDE3]/60">{post.category}</td>
                <td className="px-6 py-4">
                  <span className={cn(
                    'rounded-full px-3 py-1 text-xs font-medium',
                    post.status === 'published' && 'bg-emerald-500/10 text-emerald-400',
                    post.status === 'draft' && 'bg-amber-500/10 text-amber-400',
                    post.status === 'archived' && 'bg-gray-500/10 text-gray-400',
                  )}>
                    {post.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-[#D9DDE3]/60">{post.view_count}</td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <button className="rounded-lg p-2 text-[#D9DDE3]/60 hover:bg-white/5 hover:text-white">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="rounded-lg p-2 text-[#D9DDE3]/60 hover:bg-white/5 hover:text-white">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="rounded-lg p-2 text-red-400 hover:bg-red-500/10">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Events Management
function EventsManagement() {
  const { events, fetchEvents } = useEventStore();

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-white">Manajemen Event</h1>
        <Link
          to="/admin/events/new"
          className="flex items-center gap-2 rounded-xl bg-[#4FA3D1] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#3d8ab8]"
        >
          <Plus className="h-4 w-4" />
          Event Baru
        </Link>
      </div>

      {/* Events Table */}
      <div className="overflow-hidden rounded-2xl border border-white/5">
        <table className="w-full">
          <thead className="bg-white/5">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-[#D9DDE3]/60">Event</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-[#D9DDE3]/60">Tanggal</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-[#D9DDE3]/60">Status</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-[#D9DDE3]/60">RSVP</th>
              <th className="px-6 py-4 text-right text-sm font-medium text-[#D9DDE3]/60">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {events.map((event) => (
              <tr key={event.id} className="hover:bg-white/[0.02]">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={event.banner_image || `https://placehold.co/100x100/1C1E22/4FA3D1?text=${event.title.charAt(0)}`}
                      alt={event.title}
                      className="h-10 w-10 rounded-lg object-cover"
                    />
                    <div>
                      <span className="font-medium text-white">{event.title}</span>
                      <p className="text-xs text-[#D9DDE3]/50">{event.category}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-[#D9DDE3]/60">
                  {new Date(event.start_date).toLocaleDateString('id-ID')}
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    'rounded-full px-3 py-1 text-xs font-medium',
                    event.status === 'upcoming' && 'bg-emerald-500/10 text-emerald-400',
                    event.status === 'ongoing' && 'bg-amber-500/10 text-amber-400',
                    event.status === 'ended' && 'bg-gray-500/10 text-gray-400',
                    event.status === 'cancelled' && 'bg-red-500/10 text-red-400',
                  )}>
                    {event.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-[#D9DDE3]/60">
                  {event.rsvp_count}
                  {event.max_participants && ` / ${event.max_participants}`}
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <button className="rounded-lg p-2 text-[#D9DDE3]/60 hover:bg-white/5 hover:text-white">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="rounded-lg p-2 text-[#D9DDE3]/60 hover:bg-white/5 hover:text-white">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="rounded-lg p-2 text-red-400 hover:bg-red-500/10">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Users Management
function UsersManagement() {
  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold text-white">Manajemen User</h1>
      <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-12 text-center">
        <Users className="mx-auto mb-4 h-12 w-12 text-[#D9DDE3]/30" />
        <p className="text-[#D9DDE3]/60">Fitur ini sedang dalam pengembangan.</p>
      </div>
    </div>
  );
}

// Settings
function SettingsPage() {
  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold text-white">Pengaturan</h1>
      <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-12 text-center">
        <Settings className="mx-auto mb-4 h-12 w-12 text-[#D9DDE3]/30" />
        <p className="text-[#D9DDE3]/60">Fitur ini sedang dalam pengembangan.</p>
      </div>
    </div>
  );
}

// Main Admin Component
export function Admin() {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/blog" element={<BlogManagement />} />
        <Route path="/events" element={<EventsManagement />} />
        <Route path="/users" element={<UsersManagement />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </AdminLayout>
  );
}
