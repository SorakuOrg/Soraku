import { PermissionFlagsBits } from "discord.js"
module.exports = {
  name:"ban",aliases:["b"],category:"Moderation",description:"Ban member dari server",usage:"ban @user [alasan]",
  execute:async(message:any,args:string[],client:any)=>{
    if(!message.member.permissions.has(PermissionFlagsBits.BanMembers))
      return message.reply({embeds:[client.embed().setDescription(client.emoji.cross+" Butuh izin **Ban Members**.").setFooter({text:"Soraku Community"})]})
    const t=message.mentions.members?.first()
    if(!t)return message.reply({embeds:[client.embed().setDescription(client.emoji.cross+" Sebutkan user-nya!").setFooter({text:"Soraku Community"})]})
    if(!t.bannable)return message.reply({embeds:[client.embed().setDescription(client.emoji.cross+" Tidak bisa ban user ini.").setFooter({text:"Soraku Community"})]})
    const reason=args.slice(1).join(" ")||"Tidak ada alasan"
    await t.ban({reason:`${message.author.tag}: ${reason}`})
    message.reply({embeds:[client.embed().setTitle("🔨 Member Dibanned").addFields({name:"👤 User",value:t.user.tag,inline:true},{name:"👮 Oleh",value:message.author.tag,inline:true},{name:"📋 Alasan",value:reason}).setFooter({text:"Soraku Community"}).setTimestamp()]})
  }
}