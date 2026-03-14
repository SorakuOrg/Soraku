module.exports = {
  name:"event",description:"Event Soraku yang akan datang 🎌",
  execute:async(interaction,client)=>{
    await interaction.deferReply()
    const API=process.env.SORAKU_API_URL??client.webUrl
    let events=[]
    try{
      const r=await fetch(API+"/api/events?status=online&limit=5",{headers:{"x-soraku-secret":process.env.SORAKU_API_SECRET??""}})
      events=((await r.json()).data)??[]
    }catch{}
    const embed=client.embed().setTitle("🎌 Event Soraku yang Akan Datang").setFooter({text:"Soraku Community"}).setTimestamp()
    if(!events.length)embed.setDescription("Belum ada event mendatang. Pantau terus ya~")
    else for(const ev of events)embed.addFields({name:ev.title,value:"📅 <t:"+Math.floor(new Date(ev.startdate).getTime()/1000)+":F>\n🔗 [Detail]("+client.webUrl+"/events/"+ev.slug+")",inline:false})
    await interaction.editReply({embeds:[embed]})
  }
}