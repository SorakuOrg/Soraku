/**
 * Supabase DB Layer — pengganti semua Mongoose models Arrkiii
 * Semua tabel ada di schema "bot" (terpisah dari schema "soraku" milik apps/web)
 *
 * Tabel shared dengan apps/web (schema soraku):
 *   - users → sync profile, role, supporter tier
 *
 * Tabel khusus bot (schema bot):
 *   - bot_guilds       → prefix, settings per server
 *   - bot_antinuke     → konfigurasi antinuke
 *   - bot_antilink     → konfigurasi antilink
 *   - bot_antispam     → konfigurasi antispam
 *   - bot_autorole     → konfigurasi autorole
 *   - bot_autorespond  → trigger → response
 *   - bot_autoreact    → keyword → emoji reaction
 *   - bot_welcome      → welcome system config
 *   - bot_afk          → AFK per user per guild
 *   - bot_playlists    → playlist musik user
 *   - bot_247          → 24/7 music config
 *   - bot_roles        → role setup per guild
 *   - bot_ignorechan   → channel yang diabaikan prefix
 *   - bot_blacklist    → user yang diblokir
 *   - bot_noprefix     → user dengan no-prefix access
 */

import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// ── Helper: upsert by primary key ─────────────────────────────
async function upsert(table: string, data: Record<string, unknown>, conflict: string) {
  const { data: result, error } = await supabase
    .schema("bot")
    .from(table)
    .upsert(data, { onConflict: conflict })
    .select()
    .single()
  if (error) throw error
  return result
}

async function findOne(table: string, filters: Record<string, string>) {
  let q = supabase.schema("bot").from(table).select("*")
  for (const [k, v] of Object.entries(filters)) q = q.eq(k, v) as typeof q
  const { data, error } = await q.maybeSingle()
  if (error) throw error
  return data
}

async function findAll(table: string, filters: Record<string, string>) {
  let q = supabase.schema("bot").from(table).select("*")
  for (const [k, v] of Object.entries(filters)) q = q.eq(k, v) as typeof q
  const { data, error } = await q
  if (error) throw error
  return data ?? []
}

async function remove(table: string, filters: Record<string, string>) {
  let q = supabase.schema("bot").from(table).delete()
  for (const [k, v] of Object.entries(filters)) q = q.eq(k, v) as typeof q
  const { error } = await q
  if (error) throw error
}

// ── Guild (prefix, settings) ──────────────────────────────────
export const Guild = {
  get: (guildId: string) => findOne("bot_guilds", { guild_id: guildId }),
  set: (guildId: string, data: Record<string, unknown>) =>
    upsert("bot_guilds", { guild_id: guildId, ...data }, "guild_id"),
  getPrefix: async (guildId: string, defaultPrefix = "!") => {
    const row = await findOne("bot_guilds", { guild_id: guildId }) as { prefix?: string } | null
    return row?.prefix ?? defaultPrefix
  },
  setPrefix: (guildId: string, prefix: string) =>
    upsert("bot_guilds", { guild_id: guildId, prefix }, "guild_id"),
}

// ── Antinuke ──────────────────────────────────────────────────
export const Antinuke = {
  get:    (guildId: string) => findOne("bot_antinuke", { guild_id: guildId }),
  upsert: (guildId: string, data: Record<string, unknown>) =>
    upsert("bot_antinuke", { guild_id: guildId, ...data }, "guild_id"),
}

// ── Antilink ──────────────────────────────────────────────────
export const Antilink = {
  get:    (guildId: string) => findOne("bot_antilink", { guild_id: guildId }),
  upsert: (guildId: string, data: Record<string, unknown>) =>
    upsert("bot_antilink", { guild_id: guildId, ...data }, "guild_id"),
}

// ── Antispam ──────────────────────────────────────────────────
export const Antispam = {
  get:    (guildId: string) => findOne("bot_antispam", { guild_id: guildId }),
  upsert: (guildId: string, data: Record<string, unknown>) =>
    upsert("bot_antispam", { guild_id: guildId, ...data }, "guild_id"),
}

// ── Autorole ──────────────────────────────────────────────────
export const Autorole = {
  get:    (guildId: string) => findOne("bot_autorole", { guild_id: guildId }),
  upsert: (guildId: string, data: Record<string, unknown>) =>
    upsert("bot_autorole", { guild_id: guildId, ...data }, "guild_id"),
}

// ── Autorespond ───────────────────────────────────────────────
export const Autorespond = {
  getAll:  (guildId: string) => findAll("bot_autorespond", { guild_id: guildId }),
  add:     (guildId: string, trigger: string, response: string) =>
    upsert("bot_autorespond", { guild_id: guildId, trigger, response }, "guild_id,trigger"),
  remove:  (guildId: string, trigger: string) =>
    remove("bot_autorespond", { guild_id: guildId, trigger }),
}

// ── Autoreact ─────────────────────────────────────────────────
export const Autoreact = {
  getAll:  (guildId: string) => findAll("bot_autoreact", { guild_id: guildId }),
  add:     (guildId: string, keyword: string, emoji: string) =>
    upsert("bot_autoreact", { guild_id: guildId, keyword, emoji }, "guild_id,keyword"),
  remove:  (guildId: string, keyword: string) =>
    remove("bot_autoreact", { guild_id: guildId, keyword }),
}

// ── Welcome ───────────────────────────────────────────────────
export const Welcome = {
  get:    (guildId: string) => findOne("bot_welcome", { guild_id: guildId }),
  upsert: (guildId: string, data: Record<string, unknown>) =>
    upsert("bot_welcome", { guild_id: guildId, ...data }, "guild_id"),
}

// ── AFK ───────────────────────────────────────────────────────
export const Afk = {
  get:    (guildId: string, userId: string) => findOne("bot_afk", { guild_id: guildId, user_id: userId }),
  set:    (guildId: string, userId: string, reason: string) =>
    upsert("bot_afk", { guild_id: guildId, user_id: userId, reason, since: new Date().toISOString() }, "guild_id,user_id"),
  remove: (guildId: string, userId: string) =>
    remove("bot_afk", { guild_id: guildId, user_id: userId }),
}

// ── Playlist ──────────────────────────────────────────────────
export const Playlist = {
  getAll: (userId: string) => findAll("bot_playlists", { user_id: userId }),
  get:    (userId: string, name: string) =>
    supabase.schema("bot").from("bot_playlists").select("*")
      .eq("user_id", userId).ilike("name", name).maybeSingle().then(r => r.data),
  create: (userId: string, name: string) =>
    upsert("bot_playlists", { user_id: userId, name, tracks: [] }, "user_id,name"),
  update: (userId: string, name: string, tracks: unknown[]) =>
    supabase.schema("bot").from("bot_playlists").update({ tracks })
      .eq("user_id", userId).ilike("name", name),
  delete: (userId: string, name: string) =>
    supabase.schema("bot").from("bot_playlists").delete()
      .eq("user_id", userId).ilike("name", name),
}

// ── 24/7 Music ────────────────────────────────────────────────
export const Music247 = {
  get:    (guildId: string) => findOne("bot_247", { guild_id: guildId }),
  set:    (guildId: string, textId: string, voiceId: string) =>
    upsert("bot_247", { guild_id: guildId, text_channel_id: textId, voice_channel_id: voiceId }, "guild_id"),
  remove: (guildId: string) => remove("bot_247", { guild_id: guildId }),
}

// ── Roles Setup ───────────────────────────────────────────────
export const Roles = {
  get:    (guildId: string) => findOne("bot_roles", { guild_id: guildId }),
  upsert: (guildId: string, data: Record<string, unknown>) =>
    upsert("bot_roles", { guild_id: guildId, ...data }, "guild_id"),
}

// ── Blacklist ─────────────────────────────────────────────────
export const Blacklist = {
  get:    (userId: string) => findOne("bot_blacklist", { user_id: userId }),
  add:    (userId: string) =>
    upsert("bot_blacklist", { user_id: userId, created_at: new Date().toISOString() }, "user_id"),
  remove: (userId: string) => remove("bot_blacklist", { user_id: userId }),
}

// ── Noprefix ──────────────────────────────────────────────────
export const Noprefix = {
  get:    (userId: string) => findOne("bot_noprefix", { user_id: userId }),
  add:    (userId: string, expiresAt?: string) =>
    upsert("bot_noprefix", { user_id: userId, expires_at: expiresAt ?? null }, "user_id"),
  remove: (userId: string) => remove("bot_noprefix", { user_id: userId }),
}

// ── Ignore Channel ────────────────────────────────────────────
export const IgnoreChan = {
  getAll: (guildId: string) => findAll("bot_ignorechan", { guild_id: guildId }),
  add:    (guildId: string, channelId: string) =>
    upsert("bot_ignorechan", { guild_id: guildId, channel_id: channelId }, "guild_id,channel_id"),
  remove: (guildId: string, channelId: string) =>
    remove("bot_ignorechan", { guild_id: guildId, channel_id: channelId }),
}

// ── Shared: sync dengan soraku.users (apps/web) ───────────────
export const SorakuUser = {
  get: async (discordId: string) => {
    const { data } = await supabase
      .schema("soraku")
      .from("users")
      .select("id,username,displayname,avatarurl,role,supporterrole,supporteruntil,isprivate")
      .eq("discordid", discordId)
      .maybeSingle()
    return data
  },
  syncRole: async (discordId: string, tier: string | null) => {
    await supabase
      .schema("soraku")
      .from("users")
      .update({ supporterrole: tier })
      .eq("discordid", discordId)
  },
}

export { supabase }
