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
    log.log(req.body)
    const guildId = req.body.guildId
    const channelId = req.body.channelId
    const message = req.body.message

    let guild
    try {
      guild = await client.guilds.fetch(guildId)
      if (!guild || !guild.channels) {
        log.log(`guild not found: ${guildId}`)
        res.status(404).send({ reason: 'guild not found' })
        return
      }
    } catch (e) {
      res.status(400).send({ reason: 'bad guildId' })
      return
    }

    let channel
    try {
      channel = await guild.channels.fetch(channelId)
      if (!channel) {
        log.log(`channel not found: ${channelId}`)
        res.status(404).send({ reason: 'channel not found' })
        return
      }
    } catch (e) {
      res.status(400).send({ reason: 'bad channelId' })
      return
    }

    try {
      log.log(`announcing: ${message}`)
      // @ts-ignore
      channel.send(message)
      res.status(200).send({ success: true })
    } catch (e) {
      log.log(e)
      res.status(500).send({ reason: 'unknown' })
    }
  })

  app.listen(
    config.http.port,
    config.http.hostname,
    () => log.log(`server running on http://${config.http.hostname}:${config.http.port}`)
  )
});
client.login(config.token);
