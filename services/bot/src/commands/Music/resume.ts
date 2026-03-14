module.exports = {
  name:"resume",category:"Music",description:"Resume lagu yang dijeda",usage:"resume",player:true,
  execute:async(message:any,_:any,client:any)=>{
    const player=client.manager.players.get(message.guild.id)
    if(!player?.paused)return message.reply({embeds:[client.embed().setDescription("❌ Lagu tidak sedang dijeda.").setFooter({text:"Soraku Community"})]})
    player.pause(false)
    message.reply({embeds:[client.embed().setDescription(client.emoji.playing+" Lagu dilanjutkan.").setFooter({text:"Soraku Community"})]})
  }
}