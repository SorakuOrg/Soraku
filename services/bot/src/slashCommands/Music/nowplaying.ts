import { convertTime } from "../../utils/convert"
import { progressbar } from "../../utils/progressbar"
module.exports = {
  name:"nowplaying",description:"Info lagu yang sedang diputar 🎶",
  execute:async(interaction:any,client:any)=>{
    const player=client.manager?.players.get(interaction.guild.id)
    const song=player?.queue.current
    if(!song)return interaction.reply({content:"❌ Tidak ada lagu.",ephemeral:true})
    const bar=progressbar(player.position,song.length)
    interaction.reply({embeds:[client.embed().setTitle("🎵 Now Playing").setThumbnail(song.thumbnail)
      .setDescription("[**"+song.title.substring(0,60)+"**]("+song.uri+")\n"+bar+"\n`"+convertTime(player.position)+" / "+convertTime(song.length)+"`")
      .addFields({name:"👤 Requester",value:String(song.requester),inline:true},{name:"🔁 Loop",value:player.loop||"none",inline:true})
      .setFooter({text:"Soraku Community"}).setTimestamp()
    ]})
  }
}