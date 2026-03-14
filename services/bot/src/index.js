require("dotenv").config()
const SorakuClient = require("./Structures/SorakuClient")

const client = new SorakuClient()

client.connect().catch(err => {
  console.error("[bot] 💥 Fatal:", err)
  process.exit(1)
})

module.exports = client
