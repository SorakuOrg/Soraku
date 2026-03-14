module.exports = {
  name:"shuffle",category:"Music",description:"Acak queue",usage:"shuffle",player:true,
  execute:async(message,_,client)=>{
    const player=client.manager?.players.get(message.guild.id)
    if(!player||!player.queue.length)return message.reply({embeds:[client.embed().setDescription("❌ Queue kosong.").setFooter({text:"Soraku Community"})]})
    player.queue.shuffle()
    message.reply({embeds:[client.embed().setDescription(client.emoji.shuffle+" Queue diacak!").setFooter({text:"Soraku Community"})]})
  }
}