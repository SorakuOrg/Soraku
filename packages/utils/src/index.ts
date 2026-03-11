// ─── Soraku Shared Utils ────────────────────────────────────────────────────

/**
 * Ubah string jadi slug URL-safe (lowercase, spasi → tanda hubung)
 * Contoh: "One Piece Review!" → "one-piece-review"
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Format angka ke Rupiah
 * Contoh: 50000 → "Rp 50.000"
 */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style:    "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format ISO date string ke format lokal Indonesia
 * Contoh: "2026-03-11T..." → "11 Maret 2026"
 */
export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "-";
  try {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric", month: "long", year: "numeric",
    });
  } catch { return "-"; }
}

/**
 * Format ISO date ke format panjang dengan waktu
 * Contoh: "11 Maret 2026, 19:30 WIB"
 */
export function formatEventDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "-";
  try {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric", month: "long", year: "numeric",
      hour: "2-digit", minute: "2-digit", timeZone: "Asia/Jakarta",
    }) + " WIB";
  } catch { return "-"; }
}

/**
 * Potong string panjang dengan ellipsis
 * Contoh: truncate("Halo dunia ini panjang", 10) → "Halo dunia..."
 */
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length).trimEnd() + "...";
}

/**
 * Generate avatar placeholder berbasis initial nama
 * Return URL ke DiceBear atau inisial untuk fallback
 */
export function generateAvatar(name: string): string {
  const initial = name.charAt(0).toUpperCase();
  return `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(initial)}&backgroundColor=6366f1`;
}

/**
 * Hitung perkiraan waktu baca artikel (menit)
 * Asumsi 200 kata per menit
 */
export function readingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

/**
 * Cek apakah URL adalah URL valid
 */
export function isValidUrl(url: string): boolean {
  try { new URL(url); return true; } catch { return false; }
}
