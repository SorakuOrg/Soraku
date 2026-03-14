module.exports = {
  name:"autoplay",aliases:["ap"],category:"Music",description:"Toggle autoplay — lanjut putar lagu serupa",usage:"autoplay",player:true,inVoiceChannel:true,sameVoiceChannel:true,
  execute:async(message:any,_:any,client:any)=>{
    const player=client.manager.players.get(message.guild.id)
    if(!player)return message.reply({embeds:[client.embed().setDescription("❌ Tidak ada player.").setFooter({text:"Soraku Community"})]})
    const current=player.data.get("autoplay")??false
    player.data.set("autoplay",!current)
    message.reply({embeds:[client.embed().setDescription(client.emoji.dot+" Autoplay: **"+(!current?"ON":"OFF")+"**").setFooter({text:"Soraku Community"})]})
  }
}