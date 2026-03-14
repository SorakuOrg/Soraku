module.exports = {
  name:"skip",aliases:["s","fs"],category:"Music",description:"Skip lagu sekarang",usage:"skip",player:true,
  execute:async(message,_,client)=>{
    const player=client.manager?.players.get(message.guild.id)
    if(!player?.queue.current)return message.reply({embeds:[client.embed().setDescription("❌ Tidak ada lagu.").setFooter({text:"Soraku Community"})]})
    player.skip()
    message.reply({embeds:[client.embed().setDescription(client.emoji.skip+" Lagu di-skip.").setFooter({text:"Soraku Community"})]})
  }
}