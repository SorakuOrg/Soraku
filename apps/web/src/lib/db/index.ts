/**
 * lib/db/index.ts — Drizzle ORM client
 * Menggunakan Supabase Transaction Pooler (port 6543).
 * ENV diambil dari @/env (T3 Env — type-safe, validated).
 */
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'
import { env } from '@/env'

// Transaction Pooler Supabase — prepare: false wajib untuk pooler
const client = postgres(env.DATABASE_URL, { prepare: false })

export const db = drizzle(client, { schema })
