import { Afk } from "../../schema/db"
module.exports = {
  name: "afk", aliases: ["away"], category: "Utility",
  description: "Set status AFK — otomatis hapus saat kirim pesan", usage: "afk [alasan]",
  execute: async (message: any, args: string[], client: any) => {
    const reason = args.join(" ") || "Tidak ada alasan"
    await Afk.set(message.guild.id, message.author.id, reason)
    message.reply({ embeds: [client.embed().setDescription(`${client.emoji.tick} **${message.author.username}** kini AFK\n💬 **Alasan:** ${reason}`).setFooter({ text: "Soraku Community" })] })
  },
}
