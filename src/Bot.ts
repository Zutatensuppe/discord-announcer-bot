import { Client, Events } from "discord.js";
import express from 'express'
import config from "./config";

const log = {
  log: console.log,
}

log.log("Bot is starting...");

const client = new Client({
  intents: []
})
client.once(Events.ClientReady, async c => {
  log.log(`Ready! Logged in as ${c.user.tag}`);

  const app = express()
  app.post('/announce', express.json(), async (req, res) => {
    console.log(req.body)
    const guildId = req.body.guildId
    const channelId = req.body.channelId
    const message = req.body.message

    const guild = await client.guilds.fetch(guildId)
    if (!guild) {
      log.log(`guild not found: ${guildId}`)
      res.status(404).send({ reason: 'guild not found' })
      return
    }

    const channel = await guild.channels.fetch(channelId)
    if (!channel) {
      log.log(`channel not found: ${channelId}`)
      res.status(404).send({ reason: 'channel not found' })
      return
    }

    // @ts-ignore
    channel.send(message)
  })

  app.listen(
    config.http.port,
    config.http.hostname,
    () => log.log(`server running on http://${config.http.hostname}:${config.http.port}`)
  )
});
client.login(config.token);
