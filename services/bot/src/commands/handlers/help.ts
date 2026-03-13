/**
 * /help — Bantuan lengkap SorakuBot dengan dropdown interaktif.
 * User pilih kategori → bot tampilkan daftar command di kategori itu.
 */
import {
  SlashCommandBuilder,
  type ChatInputCommandInteraction,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  type StringSelectMenuInteraction,
  ComponentType,
} from "discord.js"

const WEB_URL = process.env.SORAKU_WEB_URL ?? "https://www.soraku.id"

// ── Data command per kategori ──────────────────────────────────
const CATEGORIES = {
  umum: {
    label:       "📋 Umum",
    description: "Command dasar SorakuBot",
    emoji:       "📋",
    color:       0x7c3aed as number,
    commands: [
      { name: "/help",   desc: "Tampilkan menu bantuan ini",                   usage: "/help" },
      { name: "/about",  desc: "Info lengkap Soraku Community + stats server", usage: "/about" },
      { name: "/ping",   desc: "Cek latency bot ke Discord",                   usage: "/ping" },
      { name: "/member", desc: "Lihat jumlah member server saat ini",          usage: "/member" },
    ],
  },
  akun: {
    label:       "👤 Akun & Profil",
    description: "Command untuk akun Soraku Community",
    emoji:       "👤",
    color:       0x3b82f6 as number,
    commands: [
      { name: "/link",    desc: "Dapatkan link Register atau Login ke web Soraku", usage: "/link" },
      { name: "/profile", desc: "Lihat profil Soraku kamu",                        usage: "/profile" },
      { name: "/profile [username]", desc: "Lihat profil user lain",               usage: "/profile username:namauser" },
    ],
  },
  komunitas: {
    label:       "🎌 Komunitas",
    description: "Command event & komunitas Soraku",
    emoji:       "🎌",
    color:       0x22c55e as number,
    commands: [
      { name: "/event", desc: "Lihat event Soraku yang akan datang", usage: "/event" },
    ],
  },
} as const

type CategoryKey = keyof typeof CATEGORIES

// ── Helper: build embed untuk satu kategori ───────────────────
function buildCategoryEmbed(key: CategoryKey): EmbedBuilder {
  const cat = CATEGORIES[key]
  const embed = new EmbedBuilder()
    .setColor(cat.color)
    .setAuthor({
      name:    "SorakuBot — Help",
      iconURL: "https://www.soraku.id/icon.png",
      url:     WEB_URL,
    })
    .setTitle(`${cat.emoji} ${cat.label}`)
    .setDescription(cat.description)

  for (const cmd of cat.commands) {
    embed.addFields({
      name:   cmd.name,
      value:  `${cmd.desc}\n\`\`${cmd.usage}\`\``,
      inline: false,
    })
  }

  embed
    .setFooter({ text: "Soraku Community · soraku.id" })
    .setTimestamp()

  return embed
}

// ── Helper: build dropdown ─────────────────────────────────────
function buildSelectMenu(selected?: CategoryKey) {
  const menu = new StringSelectMenuBuilder()
    .setCustomId("help_category")
    .setPlaceholder("✨ Pilih kategori command...")

  for (const [key, cat] of Object.entries(CATEGORIES)) {
    const opt = new StringSelectMenuOptionBuilder()
      .setValue(key)
      .setLabel(cat.label.replace(/^\S+\s/, "")) // hapus emoji dari label
      .setDescription(cat.description)
      .setEmoji(cat.emoji)

    if (key === selected) opt.setDefault(true)
    menu.addOptions(opt)
  }

  return new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(menu)
}

// ── Overview embed (tampil sebelum user pilih kategori) ────────
function buildOverviewEmbed(): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(0x7c3aed)
    .setAuthor({
      name:    "SorakuBot — Help",
      iconURL: "https://www.soraku.id/icon.png",
      url:     WEB_URL,
    })
    .setTitle("🤖 SorakuBot — Daftar Command")
    .setDescription(
      "Bot resmi **Soraku Community** — komunitas anime, manga, VTuber & budaya Jepang Indonesia.\n\n" +
      "Pilih kategori di dropdown di bawah untuk melihat detail command."
    )
    .addFields(
      { name: "📋 Umum",          value: "`/help` `/about` `/ping` `/member`", inline: true },
      { name: "👤 Akun & Profil", value: "`/link` `/profile`",                  inline: true },
      { name: "🎌 Komunitas",     value: "`/event`",                            inline: true },
    )
    .addFields({
      name:   "🌐 Web Komunitas",
      value:  `[soraku.id](${WEB_URL}) — daftar, profil, blog, galeri & event`,
      inline: false,
    })
    .setFooter({ text: "Gunakan dropdown di bawah untuk detail setiap command" })
    .setTimestamp()
}

// ── Command ───────────────────────────────────────────────────
export const helpCommand = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Tampilkan daftar command SorakuBot 📖"),

  async execute(interaction: ChatInputCommandInteraction) {
    const row = buildSelectMenu()

    const reply = await interaction.reply({
      embeds:     [buildOverviewEmbed()],
      components: [row],
      ephemeral:  false,
    })

    // Collector — dengarkan pilihan dropdown selama 5 menit
    const collector = reply.createMessageComponentCollector({
      componentType: ComponentType.StringSelect,
      time:          5 * 60 * 1000,
      filter:        i => i.customId === "help_category" && i.user.id === interaction.user.id,
    })

    collector.on("collect", async (i: StringSelectMenuInteraction) => {
      const selected = i.values[0] as CategoryKey
      await i.update({
        embeds:     [buildCategoryEmbed(selected)],
        components: [buildSelectMenu(selected)],
      })
    })

    collector.on("end", async () => {
      // Matikan dropdown setelah timeout
      const disabledMenu = new StringSelectMenuBuilder()
        .setCustomId("help_category_disabled")
        .setPlaceholder("⏱️ Sesi berakhir — ketik /help untuk membuka lagi")
        .setDisabled(true)
        .addOptions(
          new StringSelectMenuOptionBuilder()
            .setValue("expired")
            .setLabel("Sesi berakhir")
        )

      await interaction.editReply({
        components: [
          new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(disabledMenu),
        ],
      }).catch(() => {})
    })
  },
}
