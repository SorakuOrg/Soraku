import { Client, GatewayIntentBits, Collection, EmbedBuilder, type ColorResolvable } from "discord.js"
import { Kazagumo, Plugins } from "kazagumo"
import { Connectors } from "shoukaku"
import Spotify from "kazagumo-spotify"
import { readdirSync } from "fs"
import { join } from "path"

export interface PrefixCommand {
  name:              string
  aliases?:          string[]
  category:          string
  description:       string
  usage?:            string
  args?:             boolean
  cooldown?:         number
  userPerms?:        string[]
  botPerms?:         string[]
  owner?:            boolean
  inVoiceChannel?:   boolean
  sameVoiceChannel?: boolean
  player?:           boolean
  execute:           (message: import("discord.js").Message, args: string[], client: SorakuClient, prefix: string) => Promise<unknown>
}

export interface SlashCommand {
  name:        string
  description: string
  options?:    unknown[]
  execute:     (interaction: import("discord.js").ChatInputCommandInteraction, client: SorakuClient) => Promise<unknown>
}

export class SorakuClient extends Client {
  commands     = new Collection<string, PrefixCommand>()
  aliases      = new Collection<string, PrefixCommand>()
  slashCommands= new Collection<string, SlashCommand>()
  cooldowns    = new Collection<string, Collection<string, number>>()
  spamMap      = new Map<string, number[]>()
  manager!:      Kazagumo

  readonly prefix      = process.env.BOT_PREFIX ?? "!"
  readonly ownerID     = process.env.OWNER_ID    ?? process.env.GUILD_ID ?? ""
  readonly embedColor: ColorResolvable = "#7c3aed"
  readonly webUrl      = process.env.SORAKU_WEB_URL ?? "https://www.soraku.id"
  readonly support     = "https://discord.gg/qm3XJvRa6B"
  readonly invite      = `https://discord.com/api/oauth2/authorize?client_id=${process.env.CLIENT_ID}&permissions=8&scope=bot%20applications.commands`

  // Emoji map — bisa di-extend dari Railway ENV
  readonly emoji = {
    tick:    "✅", cross:   "❌", warn:    "⚠️",  dot:     "•",
    loading: "⏳", music:   "🎵", playing: "▶️",  pause:   "⏸️",
    stop:    "⏹️", skip:    "⏭️", queue:   "📋", volume:  "🔊",
    loop:    "🔁", shuffle: "🔀", join:    "🔊", leave:   "🔇",
    filter:  "🎛️", search:  "🔍", star:    "⭐", crown:   "👑",
  }

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
  }

  /** Buat embed dengan warna default Soraku */
  embed() {
    return new EmbedBuilder().setColor(this.embedColor)
  }

  /** Inisialisasi Kazagumo (Lavalink music manager) */
  initMusic() {
    const nodeUrl  = process.env.LAVA_URL   ?? ""
    const nodeAuth = process.env.LAVA_AUTH  ?? ""
    const nodeSecure = (process.env.LAVA_SECURE ?? "true") === "true"

    if (!nodeUrl || !nodeAuth) {
      console.log("[bot] ⚠️ Lavalink tidak dikonfigurasi — musik tidak aktif")
      return
    }

    const plugins: ConstructorParameters<typeof Kazagumo>[0]["plugins"] = []

    if (process.env.SPOTIFY_ID && process.env.SPOTIFY_SECRET) {
      plugins.push(new Spotify({
        clientId:     process.env.SPOTIFY_ID,
        clientSecret: process.env.SPOTIFY_SECRET,
        playlistPageLimit: 1,
        albumPageLimit:    1,
        searchLimit:       10,
      }))
    }

    this.manager = new Kazagumo({
      defaultSearchEngineType: "youtube",
      send: (guildId, payload) => {
        const guild = this.guilds.cache.get(guildId)
        if (guild) guild.shard.send(payload)
      },
      plugins,
    }, new Connectors.DiscordJS(this), [{
      name:   process.env.LAVA_NAME ?? "Soraku-Lava",
      url:    nodeUrl,
      auth:   nodeAuth,
      secure: nodeSecure,
    }])

    console.log("[bot] 🎵 Kazagumo (Lavalink) diinisialisasi")
  }
}
