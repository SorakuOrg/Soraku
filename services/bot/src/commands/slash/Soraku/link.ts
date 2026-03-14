import {
  SlashCommandBuilder, EmbedBuilder,
  ActionRowBuilder, ButtonBuilder, ButtonStyle,
  type ChatInputCommandInteraction,
} from "discord.js"

const WEB_URL = process.env.SORAKU_WEB_URL ?? "https://www.soraku.id"

export const linkCommand = {
  data: new SlashCommandBuilder()
    .setName("link")
    .setDescription("Dapatkan link Register atau Login ke web Soraku 🔗"),

  async execute(interaction: ChatInputCommandInteraction) {
    const embed = new EmbedBuilder()
      .setColor(0x7c3aed)
      .setTitle("🌸 Bergabung dengan Soraku Community")
      .setDescription(
        "Daftarkan akun kamu di **Soraku Community** — komunitas anime, manga, VTuber & budaya Jepang Indonesia.\n\n" +
        "✨ Profil publik · 🖼️ Galeri · 📝 Blog · 🎌 Event · 💎 Supporter"
      )
      .setThumbnail(`${WEB_URL}/icon.png`)
      .setFooter({ text: "Soraku Community" })
      .setTimestamp()

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder().setLabel("Daftar Sekarang").setEmoji("✨").setStyle(ButtonStyle.Link).setURL(`${WEB_URL}/register`),
      new ButtonBuilder().setLabel("Login").setEmoji("🔑").setStyle(ButtonStyle.Link).setURL(`${WEB_URL}/login`),
      new ButtonBuilder().setLabel("Website").setEmoji("🌐").setStyle(ButtonStyle.Link).setURL(WEB_URL),
    )

    await interaction.reply({ embeds: [embed], components: [row], ephemeral: true })
  },
}
