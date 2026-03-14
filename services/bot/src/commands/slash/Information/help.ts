import {
  SlashCommandBuilder, EmbedBuilder,
  ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder,
  ComponentType, type ChatInputCommandInteraction, type StringSelectMenuInteraction,
} from "discord.js"

const WEB_URL = process.env.SORAKU_WEB_URL ?? "https://www.soraku.id"
const PREFIX  = process.env.BOT_PREFIX ?? "!"

const CATEGORIES: Record<string, { emoji: string; color: number; desc: string; commands: { name: string; usage: string; desc: string }[] }> = {
  "Soraku": {
    emoji: "🌸", color: 0x7c3aed, desc: "Command khusus platform Soraku",
    commands: [
      { name: "/link",    usage: "/link",              desc: "Link Register / Login ke web Soraku" },
      { name: "/profile", usage: "/profile [username]",desc: "Lihat profil Soraku Community" },
    ],
  },
  "Information": {
    emoji: "📋", color: 0x3b82f6, desc: "Command informasi umum",
    commands: [
      { name: "/about",  usage: "/about",  desc: "Info Soraku Community + stats server" },
      { name: "/ping",   usage: "/ping",   desc: "Cek latency bot" },
      { name: "/member", usage: "/member", desc: "Jumlah member server" },
      { name: "/event",  usage: "/event",  desc: "Event Soraku yang akan datang" },
      { name: "/help",   usage: "/help",   desc: "Tampilkan bantuan ini" },
    ],
  },
  "Prefix — Information": {
    emoji: "💬", color: 0x22c55e, desc: `Prefix commands \`${PREFIX}\` kategori Information`,
    commands: [
      { name: "ping",       usage: `${PREFIX}ping`,             desc: "Cek latency bot" },
      { name: "help",       usage: `${PREFIX}help`,             desc: "Tampilkan menu bantuan" },
      { name: "about",      usage: `${PREFIX}about`,            desc: "Info Soraku Community" },
      { name: "serverinfo", usage: `${PREFIX}serverinfo`,       desc: "Info detail server" },
      { name: "userinfo",   usage: `${PREFIX}userinfo [@user]`, desc: "Info detail user" },
      { name: "avatar",     usage: `${PREFIX}avatar [@user]`,   desc: "Lihat avatar user" },
    ],
  },
  "Prefix — Utility": {
    emoji: "🔧", color: 0xf59e0b, desc: `Prefix commands \`${PREFIX}\` kategori Utility`,
    commands: [
      { name: "afk",      usage: `${PREFIX}afk [alasan]`,  desc: "Set status AFK" },
      { name: "snipe",    usage: `${PREFIX}snipe`,          desc: "Lihat pesan yang dihapus" },
      { name: "roleinfo", usage: `${PREFIX}roleinfo @role`, desc: "Info detail role" },
    ],
  },
  "Prefix — Moderation": {
    emoji: "🛡️", color: 0xef4444, desc: `Prefix commands \`${PREFIX}\` kategori Moderation`,
    commands: [
      { name: "ban",    usage: `${PREFIX}ban @user [alasan]`,      desc: "Ban member" },
      { name: "kick",   usage: `${PREFIX}kick @user [alasan]`,     desc: "Kick member" },
      { name: "mute",   usage: `${PREFIX}mute @user [menit]`,      desc: "Timeout member" },
      { name: "unmute", usage: `${PREFIX}unmute @user`,            desc: "Hapus timeout member" },
      { name: "purge",  usage: `${PREFIX}purge [jumlah]`,          desc: "Hapus banyak pesan" },
    ],
  },
}

export const helpCommand = {
  data: new SlashCommandBuilder().setName("help").setDescription("Tampilkan semua command SorakuBot 📖"),

  async execute(interaction: ChatInputCommandInteraction) {
    const overview = new EmbedBuilder()
      .setColor(0x7c3aed)
      .setAuthor({ name: "SorakuBot — Help", iconURL: interaction.client.user.displayAvatarURL(), url: WEB_URL })
      .setTitle("🤖 Daftar Command SorakuBot")
      .setDescription(`Prefix: \`${PREFIX}\` · Pilih kategori di dropdown untuk detail.\n\nBot resmi **Soraku Community** 🇮🇩`)
      .addFields(
        { name: "🌸 Soraku",             value: "`/link` `/profile`",                              inline: false },
        { name: "📋 Information",         value: "`/about` `/ping` `/member` `/event` `/help`",     inline: false },
        { name: "💬 Prefix — Info",       value: `\`ping\` \`help\` \`about\` \`serverinfo\` \`userinfo\` \`avatar\``, inline: false },
        { name: "🔧 Prefix — Utility",    value: `\`afk\` \`snipe\` \`roleinfo\``,                 inline: false },
        { name: "🛡️ Prefix — Moderation", value: `\`ban\` \`kick\` \`mute\` \`unmute\` \`purge\``, inline: false },
      )
      .setThumbnail(interaction.client.user.displayAvatarURL())
      .setFooter({ text: "Soraku Community" })
      .setTimestamp()

    const buildMenu = (selected?: string) => {
      const menu = new StringSelectMenuBuilder().setCustomId("slash_help_cat").setPlaceholder("✨ Pilih kategori command...")
      for (const [key, cat] of Object.entries(CATEGORIES)) {
        const opt = new StringSelectMenuOptionBuilder()
          .setValue(key).setLabel(key).setDescription(cat.desc).setEmoji(cat.emoji)
        if (key === selected) opt.setDefault(true)
        menu.addOptions(opt)
      }
      return new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(menu)
    }

    const reply = await interaction.reply({ embeds: [overview], components: [buildMenu()], fetchReply: true })

    const collector = reply.createMessageComponentCollector({
      componentType: ComponentType.StringSelect,
      time: 5 * 60 * 1000,
      filter: i => i.customId === "slash_help_cat" && i.user.id === interaction.user.id,
    })

    collector.on("collect", async (i: StringSelectMenuInteraction) => {
      const cat = CATEGORIES[i.values[0]]
      const embed = new EmbedBuilder()
        .setColor(cat.color)
        .setTitle(`${cat.emoji} ${i.values[0]}`)
        .setDescription(cat.commands.map(c => `**\`${c.usage}\`**\n${c.desc}`).join("\n\n"))
        .setFooter({ text: "Soraku Community" }).setTimestamp()
      await i.update({ embeds: [embed], components: [buildMenu(i.values[0])] })
    })

    collector.on("end", async () => {
      const disabled = new StringSelectMenuBuilder().setCustomId("expired")
        .setPlaceholder("⏱️ Sesi berakhir — ketik /help lagi").setDisabled(true)
        .addOptions(new StringSelectMenuOptionBuilder().setValue("x").setLabel("Berakhir"))
      await interaction.editReply({ components: [new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(disabled)] }).catch(() => {})
    })
  },
}
