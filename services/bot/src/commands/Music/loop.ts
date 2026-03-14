module.exports = {
  name:"loop",aliases:["repeat"],category:"Music",description:"Toggle loop (none/track/queue)",usage:"loop [track|queue|none]",player:true,inVoiceChannel:true,sameVoiceChannel:true,
  execute:async(message:any,args:string[],client:any)=>{
    const player=client.manager.players.get(message.guild.id)
    if(!player)return message.reply({embeds:[client.embed().setDescription("❌ Tidak ada player.").setFooter({text:"Soraku Community"})]})
    const modes=["none","track","queue"]
    const req=(args[0]||"").toLowerCase()
    const mode=modes.includes(req)?req:player.loop==="none"?"track":player.loop==="track"?"queue":"none"
    player.setLoop(mode)
    message.reply({embeds:[client.embed().setDescription(client.emoji.loop+" Loop: **"+mode+"**").setFooter({text:"Soraku Community"})]})
  }
}