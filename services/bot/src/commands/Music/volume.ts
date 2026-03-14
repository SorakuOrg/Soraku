module.exports = {
  name:"volume",aliases:["vol","v"],category:"Music",description:"Atur volume (0-200)",usage:"volume [0-200]",player:true,inVoiceChannel:true,sameVoiceChannel:true,
  execute:async(message:any,args:string[],client:any)=>{
    const player=client.manager.players.get(message.guild.id)
    if(!player)return message.reply({embeds:[client.embed().setDescription("❌ Tidak ada player.").setFooter({text:"Soraku Community"})]})
    if(!args[0])return message.reply({embeds:[client.embed().setDescription(client.emoji.volume+" Volume sekarang: **"+player.volume+"**").setFooter({text:"Soraku Community"})]})
    const vol=Math.min(Math.max(parseInt(args[0]),0),200)
    if(isNaN(vol))return message.reply({embeds:[client.embed().setDescription(client.emoji.cross+" Masukkan angka 0-200.").setFooter({text:"Soraku Community"})]})
    await player.setVolume(vol)
    message.reply({embeds:[client.embed().setDescription(client.emoji.volume+" Volume diset ke **"+vol+"%**").setFooter({text:"Soraku Community"})]})
  }
}