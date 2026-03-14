module.exports = {
  name:"autoplay",aliases:["ap"],category:"Music",description:"Toggle autoplay",usage:"autoplay",player:true,
  execute:async(message,_,client)=>{
    const player=client.manager?.players.get(message.guild.id)
    if(!player)return message.reply({embeds:[client.embed().setDescription("❌ Tidak ada player.").setFooter({text:"Soraku Community"})]})
    const cur=player.data.get("autoplay")??false;player.data.set("autoplay",!cur)
    message.reply({embeds:[client.embed().setDescription(client.emoji.dot+" Autoplay: **"+(!cur?"ON":"OFF")+"**").setFooter({text:"Soraku Community"})]})
  }
}