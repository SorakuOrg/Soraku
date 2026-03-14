const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")
const { SorakuUser } = require("../../../Schema/db")
const ROLE = { OWNER:"👑",MANAGER:"⭐",ADMIN:"🛡️",AGENSI:"🎭",KREATOR:"🎨",USER:"👤" }
const TIER = { VVIP:"💎 VVIP",VIP:"💜 VIP",DONATUR:"💙 Donatur" }
module.exports = {
  name:"profile",description:"Lihat profil Soraku Community 👤",
  options:[{name:"username",description:"Username Soraku (kosong = profil kamu)",type:3,required:false}],
  execute:async(interaction,client)=>{
    await interaction.deferReply()
    const input=interaction.options.getString("username")
    let user=input?null:await SorakuUser.get(interaction.user.id)
    if(input){
      try{
        const res=await fetch((process.env.SORAKU_API_URL??client.webUrl)+"/api/users/"+encodeURIComponent(input),{headers:{"x-soraku-secret":process.env.SORAKU_API_SECRET??""}})
        user=(await res.json()).data
      }catch{}
    }
    if(!user){
      const row=new ActionRowBuilder().addComponents(new ButtonBuilder().setLabel("Daftar Sekarang").setEmoji("✨").setStyle(ButtonStyle.Link).setURL(client.webUrl+"/register"))
      return interaction.editReply({content:input?"❌ User **"+input+"** tidak ditemukan.":"Kamu belum punya akun Soraku! Daftar dulu~ ✨",components:[row]})
    }
    const embed=client.embed()
      .setTitle((ROLE[user.role]??"👤")+" "+(user.displayname??user.username))
      .setURL(client.webUrl+"/profile/"+user.username)
      .setThumbnail(user.avatarurl??interaction.user.displayAvatarURL())
      .addFields({name:"Username",value:"@"+(user.username??"—"),inline:true},{name:"Role",value:user.role,inline:true})
    if(user.supporterrole)embed.addFields({name:"Supporter",value:TIER[user.supporterrole]??user.supporterrole,inline:true})
    embed.setFooter({text:"Soraku Community"}).setTimestamp()
    const row=new ActionRowBuilder().addComponents(new ButtonBuilder().setLabel("Lihat Profil").setEmoji("🔗").setStyle(ButtonStyle.Link).setURL(client.webUrl+"/profile/"+user.username))
    if(!input)row.addComponents(new ButtonBuilder().setLabel("Edit").setEmoji("✏️").setStyle(ButtonStyle.Link).setURL(client.webUrl+"/dash/profile/me"))
    await interaction.editReply({embeds:[embed],components:[row]})
  }
}