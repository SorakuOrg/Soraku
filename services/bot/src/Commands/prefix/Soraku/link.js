const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")

module.exports = {
  name: "link", aliases: ["daftar", "register"], category: "Soraku",
  description: "Hubungkan akun Discord kamu ke Soraku Community", usage: "link",
  execute: async (message, _args, client) => {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setLabel("Daftar Akun").setEmoji("✨").setStyle(ButtonStyle.Link).setURL(client.webUrl + "/register"),
      new ButtonBuilder().setLabel("Login").setEmoji("🔑").setStyle(ButtonStyle.Link).setURL(client.webUrl + "/login"),
      new ButtonBuilder().setLabel("Website").setEmoji("🌐").setStyle(ButtonStyle.Link).setURL(client.webUrl),
    )
    message.reply({
      embeds: [
        client.embed()
          .setTitle("🌸 Bergabung dengan Soraku Community")
          .setDescription(
            `Hubungkan akun Discord kamu dengan **Soraku Community**:\n\n` +
            `💜 **Profile** — tampil di website\n` +
            `🎨 **Galeri** — upload & share karya\n` +
            `📖 **Blog & Event** — ikuti kegiatan komunitas\n` +
            `👑 **Supporter tier** — DONATUR / VIP / VVIP\n\n` +
            `Klik tombol di bawah untuk login atau daftar via Discord! ✨`
          )
          .setThumbnail(client.user.displayAvatarURL())
          .addFields({ name: "🌐 Website", value: `[${client.webUrl.replace("https://", "")}](${client.webUrl})`, inline: true })
          .setFooter({ text: "Soraku Community" })
          .setTimestamp()
      ],
      components: [row],
    })
  },
}
