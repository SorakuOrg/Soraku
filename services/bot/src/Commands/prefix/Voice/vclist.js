module.exports = {
  name:"vclist",category:"Voice",description:"Daftar user di semua VC",usage:"vclist",
  execute:async(message,_,client)=>{
    const vcs=message.guild.channels.cache.filter(c=>c.type===2&&c.members.size>0)
    if(!vcs.size)return message.reply({embeds:[client.embed().setDescription("❌ Tidak ada user di VC.").setFooter({text:"Soraku Community"})]})
    const embed=client.embed().setTitle("🔊 Voice Channels")
    for(const[,vc]of vcs)embed.addFields({name:vc.name+" ("+vc.members.size+")",value:vc.members.map(m=>m.user.username).join(", "),inline:false})
    embed.setFooter({text:"Soraku Community"}).setTimestamp()
    message.reply({embeds:[embed]})
  }
}