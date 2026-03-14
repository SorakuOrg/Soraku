module.exports = {
  name:"stop",category:"Music",description:"Stop dan hapus queue",usage:"stop",player:true,inVoiceChannel:true,sameVoiceChannel:true,
  execute:async(message:any,_:any,client:any)=>{
    const player=client.manager.players.get(message.guild.id)
    if(!player)return message.reply({embeds:[client.embed().setDescription("❌ Tidak ada player aktif.").setFooter({text:"Soraku Community"})]})
    player.queue.clear();player.data.delete("autoplay");player.loop="none";await player.skip()
    message.reply({embeds:[client.embed().setDescription(client.emoji.stop+" Player dihentikan dan queue dibersihkan.").setFooter({text:"Soraku Community"})]})
  }
}