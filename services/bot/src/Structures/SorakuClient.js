const { Client, GatewayIntentBits, Collection, EmbedBuilder } = require("discord.js")
const { Kazagumo, Plugins } = require("kazagumo")
const { Connectors } = require("shoukaku")
const Spotify = require("kazagumo-spotify")
const { readdirSync } = require("fs")
const { join } = require("path")
const { log } = require("../Utils/logger")

class SorakuClient extends Client {
  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.MessageContent,
      ],
      allowedMentions: { parse: ["roles", "users", "everyone"], repliedUser: false },
    })

    this.commands     = new Collection() // prefix commands
    this.aliases      = new Collection() // prefix aliases
    this.slash        = new Collection() // slash commands
    this.cooldowns    = new Collection()
    this.spamMap      = new Map()
    this.logger       = { log }

    this.prefix       = process.env.BOT_PREFIX ?? "!"
    this.ownerID      = process.env.OWNER_ID   ?? ""
    this.embedColor   = "#7c3aed"
    this.webUrl       = process.env.SORAKU_WEB_URL ?? "https://www.soraku.id"
    this.support      = "https://discord.gg/qm3XJvRa6B"
    this.invite       = `https://discord.com/api/oauth2/authorize?client_id=${process.env.CLIENT_ID}&permissions=8&scope=bot%20applications.commands`
    this.manager      = null

    this.emoji = {
      tick: "✅", cross: "❌", warn: "⚠️", dot: "•",
      loading: "⏳", music: "🎵", playing: "▶️", pause: "⏸️",
      stop: "⏹️", skip: "⏭️", queue: "📋", volume: "🔊",
      loop: "🔁", shuffle: "🔀", join: "🔊", leave: "🔇",
      search: "🔍", star: "⭐", crown: "👑",
    }
  }

  /** Buat EmbedBuilder dengan warna default Soraku */
  embed() {
    return new EmbedBuilder().setColor(this.embedColor)
  }

  /** Load prefix & slash commands dari src/Commands/ */
  loadCommands() {
    const basePrefix = join(__dirname, "../Commands/prefix")
    const baseSlash  = join(__dirname, "../Commands/slash")
    let prefix = 0, slash = 0

    for (const cat of readdirSync(basePrefix)) {
      for (const file of readdirSync(join(basePrefix, cat)).filter(f => f.endsWith(".js"))) {
        const cmd = require(join(basePrefix, cat, file))
        this.commands.set(cmd.name, cmd)
        if (cmd.aliases) cmd.aliases.forEach(a => this.aliases.set(a, cmd))
        prefix++
      }
    }

    for (const cat of readdirSync(baseSlash)) {
      for (const file of readdirSync(join(baseSlash, cat)).filter(f => f.endsWith(".js"))) {
        const cmd = require(join(baseSlash, cat, file))
        if (!cmd.name || !cmd.description) continue
        this.slash.set(cmd.name, cmd)
        slash++
      }
    }

    log(`${prefix} prefix commands loaded`, "cmd")
    log(`${slash} slash commands loaded`, "cmd")
  }

  /** Load events dari src/Events/ */
  loadEvents() {
    const base = join(__dirname, "../Events")
    let total = 0
    for (const cat of readdirSync(base)) {
      const catPath = join(base, cat)
      const { statSync } = require("fs")
      if (!statSync(catPath).isDirectory()) continue
      for (const file of readdirSync(catPath).filter(f => f.endsWith(".js"))) {
        const event = require(join(catPath, file))
        if (!event?.name || event.name.startsWith("_")) continue
        if (event.once) this.once(event.name, (...args) => event.run(this, ...args))
        else            this.on(event.name,   (...args) => event.run(this, ...args))
        total++
      }
    }
    log(`${total} events loaded`, "cmd")
  }

  /** Load Kazagumo player events */
  loadPlayers() {
    if (!this.manager) return
    const base = join(__dirname, "../Events/Players")
    let total = 0
    try {
      for (const file of readdirSync(base).filter(f => f.endsWith(".js"))) {
        const ev = require(join(base, file))
        if (!ev?.name) continue
        this.manager.on(ev.name, (...args) => ev.run(this, ...args))
        total++
      }
      log(`${total} player events loaded`, "cmd")
    } catch (e) {
      log("Player events not loaded: " + e.message, "warn")
    }
  }

  /** Deploy slash commands ke Discord */
  async deploySlash() {
    const { REST, Routes } = require("discord.js")
    const token    = process.env.BOT_TOKEN
    const clientId = process.env.CLIENT_ID
    const guildId  = process.env.GUILD_ID
    const rest     = new REST({ version: "10" }).setToken(token)
    const body     = [...this.slash.values()].map(c => ({ name: c.name, description: c.description, options: c.options ?? [] }))

    if (guildId) {
      await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body })
      log(`${body.length} slash commands deployed (guild)`, "ready")
    } else {
      await rest.put(Routes.applicationCommands(clientId), { body })
      log(`${body.length} slash commands deployed (global)`, "ready")
    }
  }

  /** Inisialisasi Kazagumo musik */
  initMusic() {
    const url    = process.env.LAVA_URL
    const auth   = process.env.LAVA_AUTH
    const secure = (process.env.LAVA_SECURE ?? "true") === "true"

    if (!url || !auth) {
      log("Lavalink tidak dikonfigurasi — musik tidak aktif (set LAVA_URL + LAVA_AUTH)", "warn")
      return
    }

    const plugins = []
    if (process.env.SPOTIFY_ID && process.env.SPOTIFY_SECRET) {
      plugins.push(new Spotify({
        clientId: process.env.SPOTIFY_ID,
        clientSecret: process.env.SPOTIFY_SECRET,
        playlistPageLimit: 1, albumPageLimit: 1, searchLimit: 10,
      }))
    }

    this.manager = new Kazagumo({
      defaultSearchEngineType: "youtube",
      send: (guildId, payload) => {
        const guild = this.guilds.cache.get(guildId)
        if (guild) guild.shard.send(payload)
      },
      plugins,
    }, new Connectors.DiscordJS(this), [{ name: process.env.LAVA_NAME ?? "Soraku-Lava", url, auth, secure }])

    log("Kazagumo (Lavalink) initialized", "ready")
  }

  /** Start bot */
  async connect() {
    require("dotenv").config()

    const required = ["BOT_TOKEN", "CLIENT_ID", "GUILD_ID", "SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY", "SORAKU_WEB_URL", "WEBHOOK_SECRET"]
    for (const key of required) {
      if (!process.env[key]) { log(`ENV missing: ${key}`, "error"); process.exit(1) }
    }

    this.initMusic()
    this.loadCommands()
    this.loadEvents()
    this.loadPlayers()
    await this.deploySlash()

    const { startWebhookServer } = require("../Webhooks/server")
    await startWebhookServer(this)

    await this.login(process.env.BOT_TOKEN)
  }
}

module.exports = SorakuClient
