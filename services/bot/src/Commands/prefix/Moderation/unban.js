const { PermissionFlagsBits } = require("discord.js")
module.exports = {
  name:"unban",category:"Moderation",description:"Unban user berdasarkan ID",usage:"unban <userId>",
  execute:async(message,args,client)=>{
    if(!message.member.permissions.has(PermissionFlagsBits.BanMembers))return message.reply({embeds:[client.embed().setDescription(client.emoji.cross+" Butuh izin **Ban Members**.").setFooter({text:"Soraku Community"})]})
    if(!args[0])return message.reply({embeds:[client.embed().setDescription(client.emoji.cross+" Masukkan ID user.").setFooter({text:"Soraku Community"})]})
    await message.guild.members.unban(args[0]).catch(e=>{throw e})
    message.reply({embeds:[client.embed().setDescription(client.emoji.tick+" User `"+args[0]+"` berhasil di-unban.").setFooter({text:"Soraku Community"})]})
  }
}