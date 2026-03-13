/**
 * /about — Informasi tentang Soraku Community.
 *
 * Menampilkan:
 * - Deskripsi platform
 * - Statistik Discord server realtime
 * - Link penting (web, gallery, events, donate)
 * - Info tim inti
 */
import {
  SlashCommandBuilder,
  type ChatInputCommandInteraction,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js"

const WEB_URL = process.env.SORAKU_WEB_URL ?? "https://www.soraku.id"
const DISCORD_INVITE = process.env.DISCORD_INVITE
  ? `https://discord.gg/${process.env.DISCORD_INVITE}`
  : "https://discord.gg/qm3XJvRa6B"

export const aboutCommand = {
  data: new SlashCommandBuilder()
    .setName("about")
    .setDescription("Tentang Soraku Community 空"),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({ ephemeral: false })

    // Ambil statistik server Discord secara realtime
    const guild   = interaction.guild
    let memberCount  = 0
    let onlineCount  = 0
    let humanCount   = 0

    if (guild) {
      try {
        // Fetch full member list (bot harus punya intent GuildMembers)
        await guild.members.fetch()
        memberCount = guild.memberCount
        humanCount  = guild.members.cache.filter(m => !m.user.bot).size
        onlineCount = guild.members.cache.filter(
          m => !m.user.bot && m.presence?.status !== "offline" && m.presence !== null
        ).size
      } catch {
        // Fallback kalau intent kurang
        memberCount = guild.memberCount
      }
    }

    const embed = new EmbedBuilder()
      .setColor(0x7c3aed)  // Soraku purple
      .setAuthor({
        name:    "Soraku Community",
        iconURL: "https://www.soraku.id/icon.png",
        url:     WEB_URL,
      })
      .setTitle("空 Tentang Soraku Community")
      .setDescription([
        "**Soraku** adalah komunitas online untuk penggemar **anime, manga, VTuber, cosplay,**",
        "dan **budaya populer Jepang** di Indonesia.",
        "",
        "Kami percaya bahwa passion terhadap budaya Jepang bisa menyatukan orang-orang",
        "dari berbagai latar belakang menjadi satu komunitas yang hangat dan positif.",
        "",
        "✦ Berbagi karya fanart & cosplay di **Galeri**",
        "✦ Update event & info terbaru di **Blog**",
        "✦ Nonton stream bareng di **Soraku Stream** _(coming soon)_",
        "✦ Support komunitas lewat **Donasi**",
      ].join("\n"))

    // Stats fields
    if (memberCount > 0) {
      embed.addFields({
        name: "📊 Statistik Server",
        value: [
          `👥 **${memberCount.toLocaleString("id-ID")}** total member`,
          `👤 **${humanCount.toLocaleString("id-ID")}** member (non-bot)`,
          onlineCount > 0 ? `🟢 **${onlineCount.toLocaleString("id-ID")}** sedang online` : "",
        ].filter(Boolean).join("\n"),
        inline: true,
      })
    }

    embed.addFields({
      name:  "🌐 Platform",
      value: [
        `[🏠 Web Komunitas](${WEB_URL})`,
        `[🖼️ Galeri Karya](${WEB_URL}/gallery)`,
        `[📅 Events](${WEB_URL}/events)`,
        `[📝 Blog](${WEB_URL}/blog)`,
        `[💜 Donate](${WEB_URL}/donate)`,
      ].join("\n"),
      inline: true,
    })

    embed.addFields({
      name:  "👥 Tim Inti",
      value: [
        "🎯 **Riu** — Owner & Koordinator",
        "🎨 **Bubu** — Front-end",
        "⚙️ **Kaizo** — Back-end",
        "🤖 **Sora** — AI Core & Full Stack",
      ].join("\n"),
      inline: false,
    })

    embed.addFields({
      name:  "📱 Sosial Media",
      value: [
        "[@soraku.moe](https://www.instagram.com/soraku.moe) Instagram",
        "[@chsoraku](https://youtube.com/@chsoraku) YouTube",
        "[@soraku.id](https://www.tiktok.com/@soraku.id) TikTok",
        "[@AppSora](https://twitter.com/@AppSora) X (Twitter)",
      ].join(" · "),
      inline: false,
    })

    embed.setImage("https://www.soraku.id/banner.png")  // banner komunitas (kalau ada)
    embed.setFooter({ text: "Soraku Community · Versi 1.0 · Made with ❤️ in Indonesia" })
    embed.setTimestamp()

    // Buttons
    const row1 = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setLabel("Website")
        .setEmoji("🌐")
        .setStyle(ButtonStyle.Link)
        .setURL(WEB_URL),
      new ButtonBuilder()
        .setLabel("Galeri")
        .setEmoji("🖼️")
        .setStyle(ButtonStyle.Link)
        .setURL(`${WEB_URL}/gallery`),
      new ButtonBuilder()
        .setLabel("Events")
        .setEmoji("📅")
        .setStyle(ButtonStyle.Link)
        .setURL(`${WEB_URL}/events`),
      new ButtonBuilder()
        .setLabel("Donate")
        .setEmoji("💜")
        .setStyle(ButtonStyle.Link)
        .setURL(`${WEB_URL}/donate`),
    )

    const row2 = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setLabel("Join Discord")
        .setEmoji("🎮")
        .setStyle(ButtonStyle.Link)
        .setURL(DISCORD_INVITE),
      new ButtonBuilder()
        .setLabel("Daftar / Login")
        .setEmoji("🔑")
        .setStyle(ButtonStyle.Link)
        .setURL(`${WEB_URL}/login`),
    )

    await interaction.editReply({ embeds: [embed], components: [row1, row2] })
  },
}
