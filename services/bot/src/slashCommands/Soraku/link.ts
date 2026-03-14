import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js"
const WEB_URL = process.env.SORAKU_WEB_URL ?? "https://www.soraku.id"
module.exports = {
  name: "link", description: "Dapatkan link Register atau Login ke web Soraku 🔗",
  execute: async (interaction: any, client: any) => {
    const embed = client.embed()
      .setTitle("🌸 Bergabung dengan Soraku Community")
      .setDescription("Daftarkan akun kamu — profil, galeri, blog, event & supporter tier semuanya terhubung dengan Discord kamu!")
      .setThumbnail(`${WEB_URL}/icon.png`)
      .setFooter({ text: "Soraku Community" }).setTimestamp()
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder().setLabel("Daftar").setEmoji("✨").setStyle(ButtonStyle.Link).setURL(`${WEB_URL}/register`),
      new ButtonBuilder().setLabel("Login").setEmoji("🔑").setStyle(ButtonStyle.Link).setURL(`${WEB_URL}/login`),
      new ButtonBuilder().setLabel("Website").setEmoji("🌐").setStyle(ButtonStyle.Link).setURL(WEB_URL),
    )
    await interaction.reply({ embeds: [embed], components: [row], ephemeral: true })
  },
}
