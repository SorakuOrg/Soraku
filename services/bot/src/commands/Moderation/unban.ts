import { PermissionFlagsBits } from "discord.js"
module.exports = {
  name:"unban",category:"Moderation",description:"Unban user",usage:"unban <userId>",
  execute:async(message:any,args:string[],client:any)=>{
    if(!message.member.permissions.has(PermissionFlagsBits.BanMembers))
      return message.reply({embeds:[client.embed().setDescription(client.emoji.cross+" Butuh izin **Ban Members**.").setFooter({text:"Soraku Community"})]})
    const id=args[0]
    if(!id)return message.reply({embeds:[client.embed().setDescription(client.emoji.cross+" Masukkan ID user.").setFooter({text:"Soraku Community"})]})
    await message.guild.members.unban(id)
    message.reply({embeds:[client.embed().setDescription(client.emoji.tick+" User `"+id+"` berhasil di-unban.").setFooter({text:"Soraku Community"})]})
  }
}