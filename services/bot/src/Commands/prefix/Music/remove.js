module.exports = {
  name:"remove",aliases:["rm"],category:"Music",description:"Hapus lagu dari queue",usage:"remove <posisi>",player:true,
  execute:async(message,args,client)=>{
    const player=client.manager?.players.get(message.guild.id)
    if(!player)return message.reply({embeds:[client.embed().setDescription("❌ Tidak ada player.").setFooter({text:"Soraku Community"})]})
    const pos=parseInt(args[0])-1
    if(isNaN(pos)||pos<0||pos>=player.queue.length)return message.reply({embeds:[client.embed().setDescription(client.emoji.cross+" Posisi tidak valid.").setFooter({text:"Soraku Community"})]})
    const removed=player.queue[pos];player.queue.remove(pos)
    message.reply({embeds:[client.embed().setDescription(client.emoji.tick+" Dihapus: **"+removed.title.substring(0,40)+"**").setFooter({text:"Soraku Community"})]})
  }
}