module.exports = {
  name:"vclist",category:"Voice",description:"Daftar user di semua voice channel",usage:"vclist",
  execute:async(message:any,_:any,client:any)=>{
    const vcs=message.guild.channels.cache.filter((c:any)=>c.type===2&&c.members.size>0)
    if(!vcs.size)return message.reply({embeds:[client.embed().setDescription("❌ Tidak ada user di VC manapun.").setFooter({text:"Soraku Community"})]})
    const embed=client.embed().setTitle("🔊 Voice Channels")
    for(const [,vc] of vcs){
      const members=(vc as any).members.map((m:any)=>m.user.username).join(", ")
      embed.addFields({name:(vc as any).name+" ("+( vc as any).members.size+")",value:members,inline:false})
    }
    embed.setFooter({text:"Soraku Community"}).setTimestamp()
    message.reply({embeds:[embed]})
  }
}