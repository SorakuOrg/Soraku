/**
 * lib/db/index.ts — Drizzle ORM client (standby)
 * Saat ini platform menggunakan Supabase JS client (adminDb/createClient).
 * Drizzle disiapkan untuk query kompleks di masa mendatang.
 *
 * Untuk aktifkan: tambahkan DATABASE_URL ke env.ts + set di Vercel.
 * Format: postgresql://postgres.[ref]:[password]@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres
 */
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

const url = process.env.DATABASE_URL

if (!url) {
  // Drizzle belum aktif — tidak crash, hanya warn
  console.warn('[db] DATABASE_URL tidak diset — Drizzle standby, platform pakai Supabase client')
}

// Lazy init — hanya connect jika DATABASE_URL ada
const client = url ? postgres(url, { prepare: false }) : null

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const db = client ? drizzle(client, { schema }) : null as any
