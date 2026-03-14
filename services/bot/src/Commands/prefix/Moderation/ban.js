const { PermissionFlagsBits } = require("discord.js")
module.exports = {
  name:"ban",aliases:["b"],category:"Moderation",description:"Ban member dari server",usage:"ban @user [alasan]",
  execute:async(message,args,client)=>{
    if(!message.member.permissions.has(PermissionFlagsBits.BanMembers))return message.reply({embeds:[client.embed().setDescription(client.emoji.cross+" Butuh izin **Ban Members**.").setFooter({text:"Soraku Community"})]})
    const t=message.mentions.members?.first()
    if(!t||!t.bannable)return message.reply({embeds:[client.embed().setDescription(client.emoji.cross+" User tidak valid atau tidak bisa di-ban.").setFooter({text:"Soraku Community"})]})
    const reason=args.slice(1).join(" ")||"Tidak ada alasan"
    await t.ban({reason:`${message.author.tag}: ${reason}`})
    message.reply({embeds:[client.embed().setTitle("🔨 Member Dibanned").addFields({name:"👤 User",value:t.user.tag,inline:true},{name:"👮 Oleh",value:message.author.tag,inline:true},{name:"📋 Alasan",value:reason}).setFooter({text:"Soraku Community"}).setTimestamp()]})
  }
}