const { PermissionFlagsBits } = require("discord.js")
const { Guild } = require("../../../Schema/db")
module.exports = {
  name:"setprefix",aliases:["prefix","sp"],category:"Config",description:"Ganti prefix bot untuk server ini",usage:"setprefix <prefix>",
  execute:async(message,args,client)=>{
    if(!message.member.permissions.has(PermissionFlagsBits.ManageGuild))return message.reply({embeds:[client.embed().setDescription(client.emoji.cross+" Butuh izin **Manage Server**.").setFooter({text:"Soraku Community"})]})
    const p=args[0]
    if(!p||p.length>5)return message.reply({embeds:[client.embed().setDescription(client.emoji.cross+" Prefix harus 1-5 karakter.").setFooter({text:"Soraku Community"})]})
    await Guild.setPrefix(message.guild.id,p)
    message.reply({embeds:[client.embed().setDescription(client.emoji.tick+" Prefix diubah ke `"+p+"`").setFooter({text:"Soraku Community"})]})
  }
}