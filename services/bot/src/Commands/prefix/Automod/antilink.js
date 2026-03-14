const { PermissionFlagsBits } = require("discord.js")
const { Antilink } = require("../../Schema/db")
module.exports = {
  name:"antilink",aliases:["al"],category:"Automod",description:"Konfigurasi antilink",usage:"antilink <enable|disable>",
  execute:async(message,args,client)=>{
    if(!message.member.permissions.has(PermissionFlagsBits.ManageGuild))return message.reply({embeds:[client.embed().setDescription(client.emoji.cross+" Butuh izin **Manage Server**.").setFooter({text:"Soraku Community"})]})
    const opt=args[0]?.toLowerCase()
    const cfg=await Antilink.get(message.guild.id)
    if(!opt)return message.reply({embeds:[client.embed().setTitle("🤖 Antilink").addFields({name:"Status",value:cfg?.is_enabled?"✅ Aktif":"❌ Nonaktif",inline:true}).setFooter({text:"Soraku Community"})]})
    const enabled=opt==="enable"||opt==="on"
    await Antilink.upsert(message.guild.id,{is_enabled:enabled})
    message.reply({embeds:[client.embed().setDescription(client.emoji.tick+" Antilink **"+(enabled?"diaktifkan":"dinonaktifkan")+"**.").setFooter({text:"Soraku Community"})]})
  }
}