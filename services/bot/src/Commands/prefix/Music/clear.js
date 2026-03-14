module.exports = {
  name:"clear",category:"Music",description:"Bersihkan queue",usage:"clear",player:true,
  execute:async(message,_,client)=>{
    const player=client.manager?.players.get(message.guild.id)
    if(!player)return message.reply({embeds:[client.embed().setDescription("❌ Tidak ada player.").setFooter({text:"Soraku Community"})]})
    player.queue.clear()
    message.reply({embeds:[client.embed().setDescription(client.emoji.stop+" Queue dibersihkan.").setFooter({text:"Soraku Community"})]})
  }
}