module.exports = {
  name:"shuffle",category:"Music",description:"Acak urutan queue",usage:"shuffle",player:true,inVoiceChannel:true,sameVoiceChannel:true,
  execute:async(message:any,_:any,client:any)=>{
    const player=client.manager.players.get(message.guild.id)
    if(!player||!player.queue.length)return message.reply({embeds:[client.embed().setDescription("❌ Queue kosong.").setFooter({text:"Soraku Community"})]})
    player.queue.shuffle()
    message.reply({embeds:[client.embed().setDescription(client.emoji.shuffle+" Queue diacak!").setFooter({text:"Soraku Community"})]})
  }
}