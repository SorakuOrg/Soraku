const { PermissionFlagsBits } = require("discord.js")
const { Welcome } = require("../../Schema/db")
module.exports = {
  name:"welcome",aliases:["setwlc"],category:"Welcome",description:"Konfigurasi sistem welcome member",usage:"welcome <enable|disable|channel|test>",
  execute:async(message,args,client)=>{
    if(!message.member.permissions.has(PermissionFlagsBits.ManageGuild))return message.reply({embeds:[client.embed().setDescription(client.emoji.cross+" Butuh izin **Manage Server**.").setFooter({text:"Soraku Community"})]})
    const opt=args[0]?.toLowerCase()
    const cfg=await Welcome.get(message.guild.id)
    if(!opt||opt==="status")return message.reply({embeds:[client.embed().setTitle("👋 Welcome System").addFields({name:"Status",value:cfg?.is_enabled?"✅ Aktif":"❌ Nonaktif",inline:true},{name:"Channel",value:cfg?.channel_id?"<#"+cfg.channel_id+">":"Belum diset",inline:true}).setFooter({text:"Soraku Community"})]})
    if(opt==="enable"||opt==="on"){await Welcome.upsert(message.guild.id,{is_enabled:true});return message.reply({embeds:[client.embed().setDescription(client.emoji.tick+" Welcome system **diaktifkan**.").setFooter({text:"Soraku Community"})]})}
    if(opt==="disable"||opt==="off"){await Welcome.upsert(message.guild.id,{is_enabled:false});return message.reply({embeds:[client.embed().setDescription(client.emoji.tick+" Welcome system **dinonaktifkan**.").setFooter({text:"Soraku Community"})]})}
    if(opt==="channel"){const ch=message.mentions.channels.first()??message.channel;await Welcome.upsert(message.guild.id,{channel_id:ch.id});return message.reply({embeds:[client.embed().setDescription(client.emoji.tick+" Welcome channel: "+ch).setFooter({text:"Soraku Community"})]})}
    if(opt==="test"){client.emit("guildMemberAdd",message.member);return message.reply({embeds:[client.embed().setDescription(client.emoji.tick+" Test welcome dikirim.").setFooter({text:"Soraku Community"})]})}
  }
}