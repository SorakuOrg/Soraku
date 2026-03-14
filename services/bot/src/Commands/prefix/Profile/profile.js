const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")
const { SorakuUser } = require("../../Schema/db")
const ROLE = { OWNER:"👑 Owner",MANAGER:"⭐ Manager",ADMIN:"🛡️ Admin",AGENSI:"🎭 Agensi",KREATOR:"🎨 Kreator",USER:"👤 Member" }
const TIER = { VVIP:"💎 VVIP",VIP:"💜 VIP",DONATUR:"💙 Donatur" }
module.exports = {
  name:"profile",aliases:["p","profil"],category:"Profile",description:"Lihat profil Soraku Community",usage:"profile [@user]",
  execute:async(message,_,client)=>{
    const target=message.mentions.users.first()??message.author
    const user=await SorakuUser.get(target.id)
    if(!user){
      const row=new ActionRowBuilder().addComponents(new ButtonBuilder().setLabel("Daftar Sekarang").setEmoji("✨").setStyle(ButtonStyle.Link).setURL(client.webUrl+"/register"))
      return message.reply({embeds:[client.embed().setDescription((target.id===message.author.id?"Kamu":"**"+target.username+"**")+" belum punya akun Soraku.").setFooter({text:"Soraku Community"})],components:[row]})
    }
    const embed=client.embed()
      .setTitle((ROLE[user.role]?.split(" ")[0]??"👤")+" "+(user.displayname??user.username))
      .setURL(client.webUrl+"/profile/"+user.username)
      .setThumbnail(user.avatarurl??target.displayAvatarURL())
      .addFields({name:"Username",value:"@"+(user.username??"—"),inline:true},{name:"Role",value:ROLE[user.role]??"👤 Member",inline:true})
    if(user.supporterrole)embed.addFields({name:"Supporter",value:TIER[user.supporterrole]??user.supporterrole,inline:true})
    embed.setFooter({text:"Soraku Community"}).setTimestamp()
    const row=new ActionRowBuilder().addComponents(new ButtonBuilder().setLabel("Lihat Profil").setEmoji("🔗").setStyle(ButtonStyle.Link).setURL(client.webUrl+"/profile/"+user.username))
    message.reply({embeds:[embed],components:[row]})
  }
}