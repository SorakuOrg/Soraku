/**
 * lib/db/index.ts — Drizzle ORM client
 * ENV via @/env (T3 Env — type-safe, validated).
 *
 * DATABASE_URL opsional saat build; error jelas saat runtime jika tidak diset.
 */
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'
import { env } from '@/env'

if (!env.DATABASE_URL) {
  throw new Error(
    '[db] DATABASE_URL tidak diset. ' +
    'Tambahkan di Vercel → Settings → Environment Variables.\n' +
    'Format: postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres'
  )
}

const client = postgres(env.DATABASE_URL, { prepare: false })

export const db = drizzle(client, { schema })
