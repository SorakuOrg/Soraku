module.exports = {
  name:"pause",category:"Music",description:"Pause/resume lagu",usage:"pause",player:true,inVoiceChannel:true,sameVoiceChannel:true,
  execute:async(message:any,_:any,client:any)=>{
    const player=client.manager.players.get(message.guild.id)
    if(!player?.queue.current)return message.reply({embeds:[client.embed().setDescription("❌ Tidak ada lagu.").setFooter({text:"Soraku Community"})]})
    const paused=!player.paused;player.pause(paused)
    message.reply({embeds:[client.embed().setDescription((paused?client.emoji.pause:client.emoji.playing)+" Lagu "+(paused?"dijeda":"dilanjutkan")+".").setFooter({text:"Soraku Community"})]})
  }
}