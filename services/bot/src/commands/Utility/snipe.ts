import { supabase } from "../../schema/db"
module.exports = {
  name: "snipe", aliases: ["s"], category: "Utility",
  description: "Lihat pesan terakhir yang dihapus di channel ini", usage: "snipe",
  execute: async (message: any, _: any, client: any) => {
    const { data } = await supabase.schema("bot").from("bot_snipe").select("*").eq("channel_id", message.channelId).maybeSingle()
    if (!data) return message.reply({ embeds: [client.embed().setDescription("❌ Tidak ada pesan yang dihapus baru-baru ini.").setFooter({ text: "Soraku Community" })] })
    const s = data as any
    message.reply({ embeds: [
      client.embed()
        .setAuthor({ name: s.author_tag, iconURL: s.author_avatar })
        .setDescription(s.content)
        .addFields({ name: "🕐 Dihapus", value: `<t:${Math.floor(new Date(s.deleted_at).getTime()/1000)}:R>`, inline: true })
        .setFooter({ text: "Soraku Community" }).setTimestamp(),
    ]})
  },
}
