module.exports = {
  name:"volume",aliases:["vol","v"],category:"Music",description:"Atur volume (0-200)",usage:"volume [0-200]",player:true,
  execute:async(message,args,client)=>{
    const player=client.manager?.players.get(message.guild.id)
    if(!player)return message.reply({embeds:[client.embed().setDescription("❌ Tidak ada player.").setFooter({text:"Soraku Community"})]})
    if(!args[0])return message.reply({embeds:[client.embed().setDescription(client.emoji.volume+" Volume: **"+player.volume+"**").setFooter({text:"Soraku Community"})]})
    const vol=Math.min(Math.max(parseInt(args[0]),0),200)
    if(isNaN(vol))return message.reply({embeds:[client.embed().setDescription(client.emoji.cross+" Masukkan angka 0-200.").setFooter({text:"Soraku Community"})]})
    await player.setVolume(vol)
    message.reply({embeds:[client.embed().setDescription(client.emoji.volume+" Volume: **"+vol+"%**").setFooter({text:"Soraku Community"})]})
  }
}