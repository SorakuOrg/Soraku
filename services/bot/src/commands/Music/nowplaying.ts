import { convertTime } from "../../utils/convert"
import { progressbar } from "../../utils/progressbar"
module.exports = {
  name:"nowplaying",aliases:["np"],category:"Music",description:"Info lagu yang sedang diputar",usage:"nowplaying",player:true,
  execute:async(message:any,_:any,client:any)=>{
    const player=client.manager.players.get(message.guild.id)
    const song=player?.queue.current
    if(!song)return message.reply({embeds:[client.embed().setDescription(client.emoji.cross+" Tidak ada lagu.").setFooter({text:"Soraku Community"})]})
    const bar=progressbar(player.position,song.length)
    message.reply({embeds:[client.embed()
      .setTitle(client.emoji.music+" Now Playing")
      .setThumbnail(song.thumbnail)
      .setDescription("**["+song.title.substring(0,60)+"]("+song.uri+")**
"+bar+"
`"+convertTime(player.position)+" / "+convertTime(song.length)+"`")
      .addFields({name:"👤 Requester",value:String(song.requester),inline:true},{name:"🎤 Artist",value:song.author||"—",inline:true},{name:"🔁 Loop",value:player.loop||"none",inline:true})
      .setFooter({text:"Soraku Community"}).setTimestamp()
    ]})
  }
}