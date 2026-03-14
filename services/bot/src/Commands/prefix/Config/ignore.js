const { PermissionFlagsBits } = require("discord.js")
const { IgnoreChan } = require("../../Schema/db")
module.exports = {
  name:"ignore",aliases:["ignorechan"],category:"Config",description:"Toggle ignore prefix di channel ini",usage:"ignore",
  execute:async(message,_,client)=>{
    if(!message.member.permissions.has(PermissionFlagsBits.ManageGuild))return message.reply({embeds:[client.embed().setDescription(client.emoji.cross+" Butuh izin **Manage Server**.").setFooter({text:"Soraku Community"})]})
    const all=await IgnoreChan.getAll(message.guild.id)
    const isIgnored=all.some(r=>r.channel_id===message.channelId)
    if(isIgnored){await IgnoreChan.remove(message.guild.id,message.channelId);message.reply({embeds:[client.embed().setDescription(client.emoji.tick+" Channel tidak lagi diabaikan.").setFooter({text:"Soraku Community"})]})}
    else{await IgnoreChan.add(message.guild.id,message.channelId);message.reply({embeds:[client.embed().setDescription(client.emoji.tick+" Channel sekarang diabaikan dari prefix command.").setFooter({text:"Soraku Community"})]})}
  }
}