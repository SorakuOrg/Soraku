/**
 * services/bot — API Client
 * Discord bot konek ke services/api pakai API Key.
 *
 * Cara generate API Key (sekali, simpan di DB dan .env):
 *   node -e "
 *     const crypto = require('crypto');
 *     const key = 'bot_' + crypto.randomBytes(32).toString('hex');
 *     const hash = crypto.createHash('sha256').update(key).digest('hex');
 *     console.log('KEY:', key);   // → BOT_API_KEY di .env
 *     console.log('HASH:', hash); // → simpan ke soraku.apikeys.keyhash
 *   "
 *
 * Pakai di command/event handler:
 *   import { api } from "@/lib/api-client"
 *   const { data: events } = await api.events.list({ status: "online" })
 */
import { createApiClient } from "@soraku/utils"

const API_URL    = process.env.SORAKU_API_URL ?? "http://localhost:4000"
const BOT_SECRET = process.env.SORAKU_API_SECRET ?? ""
const BOT_API_KEY = process.env.BOT_API_KEY ?? ""

/**
 * Client untuk bot — pakai API Key (sk_/bot_ prefix).
 * Gunakan ini untuk baca data (events, vtubers, users, dll).
 */
export const api = createApiClient({
  baseUrl: API_URL,
  token:   BOT_API_KEY,
})

/**
 * Client dengan internal secret — untuk trigger webhook ke web.
 * Gunakan ini kalau bot perlu notify web (role sync, dll).
 */
export const apiInternal = createApiClient({
  baseUrl:        API_URL,
  internalSecret: BOT_SECRET,
})
