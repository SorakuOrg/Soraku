/**
 * /link — Dapatkan link untuk Register atau Login di Soraku Community.
 *
 * Flow:
 * 1. User ketik /link di Discord
 * 2. Bot tanya: sudah punya akun? (Login / Register)
 * 3. Bot kirim link langsung dengan ephemeral (hanya user yang lihat)
 */
import {
  SlashCommandBuilder,
  type ChatInputCommandInteraction,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js"

const WEB_URL = process.env.SORAKU_API_URL?.replace("/api", "") 
  ?? process.env.SORAKU_WEB_URL 
  ?? "https://soraku.vercel.app"

export const linkCommand = {
  data: new SlashCommandBuilder()
    .setName("link")
    .setDescription("Dapatkan link untuk Register atau Login di Soraku Community 🔗")
    .addStringOption(opt =>
      opt
        .setName("aksi")
        .setDescription("Mau login atau daftar akun baru?")
        .setRequired(false)
        .addChoices(
          { name: "🆕  Daftar akun baru (Register)", value: "register" },
          { name: "🔑  Login ke akun saya",          value: "login"    },
        )
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const aksi = interaction.options.getString("aksi") ?? "login"

    const embed = new EmbedBuilder()
      .setColor(aksi === "register" ? 0x7c3aed : 0x3b82f6)  // purple / blue
      .setAuthor({
        name: "Soraku Community",
        iconURL: "https://soraku.vercel.app/icon.png",
        url: WEB_URL,
      })
      .setTitle(
        aksi === "register"
          ? "✨ Daftar Akun Soraku"
          : "🔑 Login ke Soraku"
      )
      .setDescription(
        aksi === "register"
          ? [
              "Buat akun Soraku Community gratis!",
              "",
              "**Tersedia login via:**",
              "- <:discord:1176099273994547230> **Discord** ← Satu klik, langsung terhubung",
              "- 🟦 **Google**",
              "- 📧 **Email & Password**",
              "",
              "Setelah daftar, profil Discord kamu otomatis tersinkron.",
            ].join("\n")
          : [
              "Selamat datang kembali di **Soraku Community**!",
              "",
              "Login pakai akun yang sudah kamu daftarkan:",
              "- <:discord:1176099273994547230> **Discord** ← Cepat & mudah",
              "- 🟦 **Google**",
              "- 📧 **Email & Password**",
            ].join("\n")
      )
      .setFooter({ text: "Link ini hanya bisa dilihat oleh kamu • Soraku Community" })
      .setTimestamp()

    const registerBtn = new ButtonBuilder()
      .setLabel("Daftar Sekarang")
      .setEmoji("✨")
      .setStyle(ButtonStyle.Link)
      .setURL(`${WEB_URL}/register`)

    const loginBtn = new ButtonBuilder()
      .setLabel("Login")
      .setEmoji("🔑")
      .setStyle(ButtonStyle.Link)
      .setURL(`${WEB_URL}/login`)

    const discordLoginBtn = new ButtonBuilder()
      .setLabel("Login via Discord")
      .setEmoji("🎮")
      .setStyle(ButtonStyle.Link)
      .setURL(`${WEB_URL}/login?provider=discord`)

    const row = aksi === "register"
      ? new ActionRowBuilder<ButtonBuilder>().addComponents(registerBtn, loginBtn)
      : new ActionRowBuilder<ButtonBuilder>().addComponents(loginBtn, discordLoginBtn, registerBtn)

    await interaction.reply({
      embeds:    [embed],
      components: [row],
      ephemeral: true,  // hanya user yang kirim command yang bisa lihat
    })
  },
}
