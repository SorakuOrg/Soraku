// ─────────────────────────────────────────────────────────────────────────────
// Soraku — Notification System
// Sumber: /api/notifications (DB internal Supabase — BUKAN GitHub Discussion)
// TODO Kaizo: buat tabel notifications + RLS → lihat schema di route.ts
// ─────────────────────────────────────────────────────────────────────────────

export type NotifType =
  | "event"    // Event baru / reminder
  | "blog"     // Artikel baru
  | "gallery"  // Galeri disetujui / ditolak
  | "badge"    // Dapat badge / role baru
  | "mention"  // Disebut di komentar
  | "system"   // Pengumuman platform
  | "premium"; // Status premium berubah

export interface Notification {
  id: string;
  type: NotifType;
  title: string;
  body: string;
  href?: string;
  read: boolean;
  created_at: string; // ISO
}

export const NOTIF_CONFIG: Record<
  NotifType,
  { emoji: string; bg: string; color: string }
> = {
  event:   { emoji: "🎌", bg: "bg-blue-500/10",   color: "text-blue-400"   },
  blog:    { emoji: "📝", bg: "bg-primary/10",    color: "text-primary"    },
  gallery: { emoji: "🖼️", bg: "bg-purple-500/10", color: "text-purple-400" },
  badge:   { emoji: "🏅", bg: "bg-yellow-500/10", color: "text-yellow-400" },
  mention: { emoji: "💬", bg: "bg-green-500/10",  color: "text-green-400"  },
  system:  { emoji: "📢", bg: "bg-accent/10",     color: "text-accent"     },
  premium: { emoji: "⭐", bg: "bg-yellow-400/10", color: "text-yellow-300" },
};

// Mock — diganti real API saat Kaizo selesai tabel notifications
export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "n1", type: "event",
    title: "Event Baru!",
    body: "Nonton Bareng Jujutsu Kaisen S3 dijadwalkan Minggu ini.",
    href: "/events", read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
  },
  {
    id: "n2", type: "blog",
    title: "Artikel Baru",
    body: "Review One Piece Chapter 1113 sudah terbit di Blog.",
    href: "/blog", read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: "n3", type: "gallery",
    title: "Galeri Disetujui",
    body: "Upload fan-art Attack on Titan kamu sudah disetujui.",
    href: "/gallery", read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: "n4", type: "badge",
    title: "Badge Baru 🎉",
    body: "Kamu mendapatkan badge Kreator Aktif!",
    href: "/dashboard", read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
];
