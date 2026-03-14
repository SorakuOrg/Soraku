module.exports = {
  name:"leave",aliases:["dc","disconnect"],category:"Music",description:"Bot keluar VC",usage:"leave",
  execute:async(message,_,client)=>{
    const player=client.manager?.players.get(message.guild.id)
    if(!player)return message.reply({embeds:[client.embed().setDescription("❌ Bot tidak di VC.").setFooter({text:"Soraku Community"})]})
    await player.destroy()
    message.reply({embeds:[client.embed().setDescription(client.emoji.leave+" Keluar dari VC.").setFooter({text:"Soraku Community"})]})
  }
}