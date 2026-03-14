/**
 * Supabase DB Layer — pengganti semua Mongoose models
 * Schema "bot" untuk data bot, schema "soraku" untuk data shared dengan apps/web
 */
const { createClient } = require("@supabase/supabase-js")

// Support kedua nama: SUPABASE_SERVICE_KEY (Railway Riu) atau SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_KEY
)

const bot = () => supabase.schema("bot")
const soraku = () => supabase.schema("soraku")

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

const Guild = {
  get: (guildId) => findOne("bot_guilds", { guild_id: guildId }),
  set: (guildId, data) => upsert("bot_guilds", { guild_id: guildId, ...data }, "guild_id"),
  getPrefix: async (guildId, def = "!") => {
    const row = await findOne("bot_guilds", { guild_id: guildId })
    return row?.prefix ?? def
  },
  setPrefix: (guildId, prefix) => upsert("bot_guilds", { guild_id: guildId, prefix }, "guild_id"),
}

const Antinuke = {
  get: (guildId) => findOne("bot_antinuke", { guild_id: guildId }),
  upsert: (guildId, data) => upsert("bot_antinuke", { guild_id: guildId, ...data }, "guild_id"),
}

const Antilink = {
  get: (guildId) => findOne("bot_antilink", { guild_id: guildId }),
  upsert: (guildId, data) => upsert("bot_antilink", { guild_id: guildId, ...data }, "guild_id"),
}

const Antispam = {
  get: (guildId) => findOne("bot_antispam", { guild_id: guildId }),
  upsert: (guildId, data) => upsert("bot_antispam", { guild_id: guildId, ...data }, "guild_id"),
}

const Autorole = {
  get: (guildId) => findOne("bot_autorole", { guild_id: guildId }),
  upsert: (guildId, data) => upsert("bot_autorole", { guild_id: guildId, ...data }, "guild_id"),
}

const Autorespond = {
  getAll: (guildId) => findAll("bot_autorespond", { guild_id: guildId }),
  add: (guildId, trigger, response) => upsert("bot_autorespond", { guild_id: guildId, trigger, response }, "guild_id,trigger"),
  remove: (guildId, trigger) => remove("bot_autorespond", { guild_id: guildId, trigger }),
}

const Autoreact = {
  getAll: (guildId) => findAll("bot_autoreact", { guild_id: guildId }),
  add: (guildId, keyword, emoji) => upsert("bot_autoreact", { guild_id: guildId, keyword, emoji }, "guild_id,keyword"),
  remove: (guildId, keyword) => remove("bot_autoreact", { guild_id: guildId, keyword }),
}

const Welcome = {
  get: (guildId) => findOne("bot_welcome", { guild_id: guildId }),
  upsert: (guildId, data) => upsert("bot_welcome", { guild_id: guildId, ...data }, "guild_id"),
}

const Afk = {
  get: (guildId, userId) => findOne("bot_afk", { guild_id: guildId, user_id: userId }),
  set: (guildId, userId, reason) => upsert("bot_afk", { guild_id: guildId, user_id: userId, reason, since: new Date().toISOString() }, "guild_id,user_id"),
  remove: (guildId, userId) => remove("bot_afk", { guild_id: guildId, user_id: userId }),
}

const Playlist = {
  getAll: (userId) => findAll("bot_playlists", { user_id: userId }),
  get: async (userId, name) => {
    const { data } = await bot().from("bot_playlists").select("*").eq("user_id", userId).ilike("name", name).maybeSingle()
    return data
  },
  create: (userId, name) => upsert("bot_playlists", { user_id: userId, name, tracks: [] }, "user_id,name"),
  update: (userId, name, tracks) => bot().from("bot_playlists").update({ tracks }).eq("user_id", userId).ilike("name", name),
  delete: (userId, name) => bot().from("bot_playlists").delete().eq("user_id", userId).ilike("name", name),
}

const Music247 = {
  get: (guildId) => findOne("bot_247", { guild_id: guildId }),
  set: (guildId, textId, voiceId) => upsert("bot_247", { guild_id: guildId, text_channel_id: textId, voice_channel_id: voiceId }, "guild_id"),
  remove: (guildId) => remove("bot_247", { guild_id: guildId }),
}

const Roles = {
  get: (guildId) => findOne("bot_roles", { guild_id: guildId }),
  upsert: (guildId, data) => upsert("bot_roles", { guild_id: guildId, ...data }, "guild_id"),
}

const Blacklist = {
  get: (userId) => findOne("bot_blacklist", { user_id: userId }),
  add: (userId) => upsert("bot_blacklist", { user_id: userId, created_at: new Date().toISOString() }, "user_id"),
  remove: (userId) => remove("bot_blacklist", { user_id: userId }),
}

const Noprefix = {
  get: (userId) => findOne("bot_noprefix", { user_id: userId }),
  add: (userId, expiresAt) => upsert("bot_noprefix", { user_id: userId, expires_at: expiresAt ?? null }, "user_id"),
  remove: (userId) => remove("bot_noprefix", { user_id: userId }),
}

const IgnoreChan = {
  getAll: (guildId) => findAll("bot_ignorechan", { guild_id: guildId }),
  add: (guildId, channelId) => upsert("bot_ignorechan", { guild_id: guildId, channel_id: channelId }, "guild_id,channel_id"),
  remove: (guildId, channelId) => remove("bot_ignorechan", { guild_id: guildId, channel_id: channelId }),
}

const SorakuUser = {
  get: async (discordId) => {
    const { data } = await soraku().from("users")
      .select("id,username,displayname,avatarurl,role,supporterrole,supporteruntil,isprivate")
      .eq("discordid", discordId).maybeSingle()
    return data
  },
  syncRole: async (discordId, tier) => {
    await soraku().from("users").update({ supporterrole: tier }).eq("discordid", discordId)
  },
}

module.exports = { supabase, Guild, Antinuke, Antilink, Antispam, Autorole, Autorespond, Autoreact, Welcome, Afk, Playlist, Music247, Roles, Blacklist, Noprefix, IgnoreChan, SorakuUser }
