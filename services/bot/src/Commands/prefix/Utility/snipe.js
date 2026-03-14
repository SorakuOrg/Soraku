const { supabase } = require("../../../Schema/db")

module.exports = {
  name: "snipe", aliases: ["s"], category: "Utility",
  description: "Lihat pesan terakhir yang dihapus di channel ini", usage: "snipe",
  execute: async (message, _args, client) => {
    const { data } = await supabase.schema("bot").from("bot_snipe").select("*").eq("channel_id", message.channelId).maybeSingle()
    if (!data) return message.reply({ embeds: [client.embed().setDescription("❌ Tidak ada pesan yang dihapus baru-baru ini.").setFooter({ text: "Soraku Community" })] })
    await message.reply({ embeds: [
      client.embed()
        .setAuthor({ name: data.author_tag, iconURL: data.author_avatar })
        .setDescription(data.content)
        .addFields({ name: "🕐 Dihapus", value: `<t:${Math.floor(new Date(data.deleted_at).getTime()/1000)}:R>`, inline: true })
        .setFooter({ text: "Soraku Community" }).setTimestamp()
    ]})
  },
}
