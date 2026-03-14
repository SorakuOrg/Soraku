/**
 * Supabase DB Layer — schema "bot" untuk data bot, "soraku" untuk data shared web
 */
const { createClient } = require("@supabase/supabase-js")

let _supabase = null
function getSupabase() {
  if (_supabase) return _supabase
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_KEY
  if (!url || !key) throw new Error("SUPABASE_URL atau SUPABASE_SERVICE_KEY belum diset")
  const fixedUrl = url.startsWith("http") ? url : "https://" + url
  _supabase = createClient(fixedUrl, key)
  return _supabase
}

const bot    = () => getSupabase().schema("bot")
const soraku = () => getSupabase().schema("soraku")

async function upsert(table, data, conflict) {
  const { data: r, error } = await bot().from(table).upsert(data, { onConflict: conflict }).select().single()
  if (error) throw error
  return r
}
async function findOne(table, filters) {
  let q = bot().from(table).select("*")
  for (const [k, v] of Object.entries(filters)) q = q.eq(k, v)
  const { data, error } = await q.maybeSingle()
  if (error) throw error
  return data
}
async function findAll(table, filters) {
  let q = bot().from(table).select("*")
  for (const [k, v] of Object.entries(filters)) q = q.eq(k, v)
  const { data, error } = await q
  if (error) throw error
  return data ?? []
}
async function remove(table, filters) {
  let q = bot().from(table).delete()
  for (const [k, v] of Object.entries(filters)) q = q.eq(k, v)
  const { error } = await q
  if (error) throw error
}

// ── Guild ─────────────────────────────────────────────────────
const Guild = {
  get:       (guildId)         => findOne("guilds", { guild_id: guildId }),
  set:       (guildId, data)   => upsert("guilds", { guild_id: guildId, ...data }, "guild_id"),
  getPrefix: async (guildId, def = "!") => {
    const row = await findOne("guilds", { guild_id: guildId })
    return row?.prefix ?? def
  },
  setPrefix: (guildId, prefix) => upsert("guilds", { guild_id: guildId, prefix }, "guild_id"),
}

// ── Antinuke / Automod ────────────────────────────────────────
const Antinuke   = { get: g => findOne("antinuke",   { guild_id: g }), upsert: (g, d) => upsert("antinuke",   { guild_id: g, ...d }, "guild_id") }
const Antilink   = { get: g => findOne("antilink",   { guild_id: g }), upsert: (g, d) => upsert("antilink",   { guild_id: g, ...d }, "guild_id") }
const Antispam   = { get: g => findOne("antispam",   { guild_id: g }), upsert: (g, d) => upsert("antispam",   { guild_id: g, ...d }, "guild_id") }
const Autorole   = { get: g => findOne("autorole",   { guild_id: g }), upsert: (g, d) => upsert("autorole",   { guild_id: g, ...d }, "guild_id") }
const Welcome    = { get: g => findOne("welcome",    { guild_id: g }), upsert: (g, d) => upsert("welcome",    { guild_id: g, ...d }, "guild_id") }
const Roles      = { get: g => findOne("roles",      { guild_id: g }), upsert: (g, d) => upsert("roles",      { guild_id: g, ...d }, "guild_id") }

// ── Autorespond / Autoreact ───────────────────────────────────
const Autorespond = {
  getAll: g          => findAll("autorespond", { guild_id: g }),
  add:    (g, t, r)  => upsert("autorespond", { guild_id: g, trigger: t, response: r }, "guild_id,trigger"),
  remove: (g, t)     => remove("autorespond", { guild_id: g, trigger: t }),
}
const Autoreact = {
  getAll: g          => findAll("autoreact", { guild_id: g }),
  add:    (g, k, e)  => upsert("autoreact", { guild_id: g, keyword: k, emoji: e }, "guild_id,keyword"),
  remove: (g, k)     => remove("autoreact", { guild_id: g, keyword: k }),
}

// ── AFK ───────────────────────────────────────────────────────
const Afk = {
  get:    (g, u)         => findOne("afk", { guild_id: g, user_id: u }),
  set:    (g, u, reason) => upsert("afk",  { guild_id: g, user_id: u, reason, since: new Date().toISOString() }, "guild_id,user_id"),
  remove: (g, u)         => remove("afk",  { guild_id: g, user_id: u }),
}

// ── Playlist ──────────────────────────────────────────────────
const Playlist = {
  getAll: u           => findAll("playlists", { user_id: u }),
  get: async (u, n)  => {
    const { data } = await bot().from("playlists").select("*").eq("user_id", u).ilike("name", n).maybeSingle()
    return data
  },
  create: (u, n)     => upsert("playlists", { user_id: u, name: n, tracks: [] }, "user_id,name"),
  update: (u, n, t)  => bot().from("playlists").update({ tracks: t }).eq("user_id", u).ilike("name", n),
  delete: (u, n)     => bot().from("playlists").delete().eq("user_id", u).ilike("name", n),
}

// ── Music 24/7 ────────────────────────────────────────────────
const Music247 = {
  get:    g              => findOne("music247", { guild_id: g }),
  set:    (g, tId, vId)  => upsert("music247", { guild_id: g, text_channel_id: tId, voice_channel_id: vId }, "guild_id"),
  remove: g              => remove("music247", { guild_id: g }),
}

// ── Owner Tools ───────────────────────────────────────────────
const Blacklist = {
  get:    u  => findOne("blacklist", { user_id: u }),
  add:    u  => upsert("blacklist", { user_id: u, created_at: new Date().toISOString() }, "user_id"),
  remove: u  => remove("blacklist", { user_id: u }),
}
const Noprefix = {
  get:    u           => findOne("noprefix", { user_id: u }),
  add:    (u, exp)    => upsert("noprefix", { user_id: u, expires_at: exp ?? null }, "user_id"),
  remove: u           => remove("noprefix", { user_id: u }),
}
const IgnoreChan = {
  getAll: g          => findAll("ignorechan", { guild_id: g }),
  add:    (g, c)     => upsert("ignorechan", { guild_id: g, channel_id: c }, "guild_id,channel_id"),
  remove: (g, c)     => remove("ignorechan", { guild_id: g, channel_id: c }),
}
const Snipe = {
  get: c          => findOne("snipe", { channel_id: c }),
  set: (c, data)  => upsert("snipe", { channel_id: c, ...data, deleted_at: new Date().toISOString() }, "channel_id"),
}

// ── Soraku Web Integration ────────────────────────────────────
const SorakuUser = {
  /** Cari user Soraku berdasarkan Discord ID */
  get: async (discordId) => {
    const { data, error } = await soraku().from("users")
      .select("id,username,displayname,avatarurl,bio,role,supporterrole,supporteruntil,isprivate")
      .eq("discordid", discordId)
      .maybeSingle()
    if (error) { console.error("[SorakuUser.get]", error); return null }
    return data
  },
  /** Set discordid saat user link akun */
  link: async (userId, discordId) => {
    const { error } = await soraku().from("users")
      .update({ discordid: discordId })
      .eq("id", userId)
    if (error) throw error
  },
  /** Sync supporter role dari Discord ke DB */
  syncRole: async (discordId, tier) => {
    const { error } = await soraku().from("users")
      .update({ supporterrole: tier, supportersource: "discord" })
      .eq("discordid", discordId)
    if (error) throw error
  },
}

module.exports = {
  Guild, Antinuke, Antilink, Antispam, Autorole, Autorespond, Autoreact,
  Welcome, Afk, Playlist, Music247, Roles, Blacklist, Noprefix, IgnoreChan, Snipe,
  SorakuUser,
}
