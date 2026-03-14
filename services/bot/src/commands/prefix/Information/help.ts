import type { Message } from "discord.js"
import {
  EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder, ComponentType, type StringSelectMenuInteraction,
} from "discord.js"

const PREFIX = process.env.BOT_PREFIX ?? "!"
const WEB_URL = process.env.SORAKU_WEB_URL ?? "https://www.soraku.id"

const CATEGORIES: Record<string, { emoji: string; color: number; commands: { name: string; desc: string }[] }> = {
  Information: {
    emoji: "📋", color: 0x7c3aed,
    commands: [
      { name: `${PREFIX}help`,       desc: "Tampilkan menu bantuan ini" },
      { name: `${PREFIX}ping`,       desc: "Cek latency bot" },
      { name: `${PREFIX}about`,      desc: "Info Soraku Community" },
      { name: `${PREFIX}serverinfo`, desc: "Info server Discord" },
      { name: `${PREFIX}userinfo`,   desc: "Info user Discord" },
      { name: `${PREFIX}avatar`,     desc: "Lihat avatar user" },
    ],
  },
  Utility: {
    emoji: "🔧", color: 0x3b82f6,
    commands: [
      { name: `${PREFIX}afk`,      desc: "Set status AFK" },
      { name: `${PREFIX}snipe`,    desc: "Lihat pesan yang baru dihapus" },
      { name: `${PREFIX}roleinfo`, desc: "Info detail role" },
    ],
  },
  Moderation: {
    emoji: "🛡️", color: 0xef4444,
    commands: [
      { name: `${PREFIX}ban`,    desc: "Ban member dari server" },
      { name: `${PREFIX}kick`,   desc: "Kick member dari server" },
      { name: `${PREFIX}mute`,   desc: "Timeout member" },
      { name: `${PREFIX}unmute`, desc: "Hapus timeout member" },
      { name: `${PREFIX}purge`,  desc: "Hapus banyak pesan sekaligus" },
    ],
  },
  "Slash Commands": {
    emoji: "⚡", color: 0xf59e0b,
    commands: [
      { name: "/link",    desc: "Dapatkan link Register / Login Soraku" },
      { name: "/profile", desc: "Lihat profil Soraku Community" },
      { name: "/about",   desc: "Info lengkap Soraku + stats server" },
      { name: "/event",   desc: "Event Soraku yang akan datang" },
      { name: "/help",    desc: "Bantuan slash commands" },
      { name: "/ping",    desc: "Cek latency bot (slash)" },
      { name: "/member",  desc: "Jumlah member server" },
    ],
  },
}

export default {
  name:        "help",
  aliases:     ["h", "cmds", "commands"],
  description: "Tampilkan semua command Soraku Bot",
  category:    "Information",
  usage:       "!help",

  async execute(message: Message) {
    const overviewEmbed = new EmbedBuilder()
      .setColor(0x7c3aed)
      .setAuthor({ name: "SorakuBot — Help", iconURL: message.client.user.displayAvatarURL(), url: WEB_URL })
      .setTitle("🤖 Daftar Command SorakuBot")
      .setDescription(`Prefix: \`${PREFIX}\` — Pilih kategori di dropdown untuk detail command.`)
      .addFields(
        { name: "📋 Information",  value: `\`ping\` \`help\` \`about\` \`serverinfo\` \`userinfo\` \`avatar\``, inline: false },
        { name: "🔧 Utility",      value: `\`afk\` \`snipe\` \`roleinfo\``, inline: false },
        { name: "🛡️ Moderation",   value: `\`ban\` \`kick\` \`mute\` \`unmute\` \`purge\``, inline: false },
        { name: "⚡ Slash Commands",value: `\`/link\` \`/profile\` \`/about\` \`/event\` \`/help\` \`/ping\` \`/member\``, inline: false },
      )
      .setThumbnail(message.client.user.displayAvatarURL())
      .setFooter({ text: "Soraku Community" })
      .setTimestamp()

    const buildMenu = (selected?: string) => {
      const menu = new StringSelectMenuBuilder()
        .setCustomId("prefix_help_cat")
        .setPlaceholder("✨ Pilih kategori command...")
      for (const [key, cat] of Object.entries(CATEGORIES)) {
        const opt = new StringSelectMenuOptionBuilder()
          .setValue(key).setLabel(key)
          .setDescription(`${cat.commands.length} command`)
          .setEmoji(cat.emoji)
        if (key === selected) opt.setDefault(true)
        menu.addOptions(opt)
      }
      return new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(menu)
    }

    const reply = await message.reply({ embeds: [overviewEmbed], components: [buildMenu()] })

    const collector = reply.createMessageComponentCollector({
      componentType: ComponentType.StringSelect,
      time: 5 * 60 * 1000,
      filter: i => i.customId === "prefix_help_cat" && i.user.id === message.author.id,
    })

    collector.on("collect", async (i: StringSelectMenuInteraction) => {
      const cat = CATEGORIES[i.values[0]]
      const embed = new EmbedBuilder()
        .setColor(cat.color)
        .setTitle(`${cat.emoji} ${i.values[0]}`)
        .setDescription(cat.commands.map(c => `\`${c.name}\` — ${c.desc}`).join("\n"))
        .setFooter({ text: "Soraku Community" })
        .setTimestamp()
      await i.update({ embeds: [embed], components: [buildMenu(i.values[0])] })
    })

    collector.on("end", async () => {
      const disabled = new StringSelectMenuBuilder()
        .setCustomId("expired").setPlaceholder("⏱️ Sesi berakhir — ketik !help lagi")
        .setDisabled(true).addOptions(new StringSelectMenuOptionBuilder().setValue("x").setLabel("Berakhir"))
      await reply.edit({ components: [new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(disabled)] }).catch(() => {})
    })
  },
}
