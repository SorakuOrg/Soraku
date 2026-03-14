module.exports = {
  name:"stop",category:"Music",description:"Stop dan hapus queue",usage:"stop",player:true,
  execute:async(message,_,client)=>{
    const player=client.manager?.players.get(message.guild.id)
    if(!player)return message.reply({embeds:[client.embed().setDescription("❌ Tidak ada player.").setFooter({text:"Soraku Community"})]})
    player.queue.clear();player.data.delete("autoplay");player.loop="none";await player.skip()
    message.reply({embeds:[client.embed().setDescription(client.emoji.stop+" Musik dihentikan.").setFooter({text:"Soraku Community"})]})
  }
}