module.exports = {
  name:"leave",aliases:["dc","disconnect"],category:"Music",description:"Bot keluar dari voice channel",usage:"leave",
  execute:async(message:any,_:any,client:any)=>{
    if(!client.manager)return message.reply({embeds:[client.embed().setDescription("❌ Musik tidak aktif.").setFooter({text:"Soraku Community"})]})
    const player=client.manager.players.get(message.guild.id)
    if(!player)return message.reply({embeds:[client.embed().setDescription("❌ Bot tidak di voice channel.").setFooter({text:"Soraku Community"})]})
    await player.destroy()
    message.reply({embeds:[client.embed().setDescription(client.emoji.leave+" Keluar dari voice channel.").setFooter({text:"Soraku Community"})]})
  }
}