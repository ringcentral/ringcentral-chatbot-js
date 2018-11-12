import express from 'express'

import Bot from '../models/Bot'
import Service from '../models/Service'
import OAuth from '../models/OAuth'

const app = express()

// create database tables if not exists
app.put('/setup-database', async (req, res) => {
  await Bot.sync()
  await Service.sync()
  await OAuth.sync()
  res.send('')
})

// "reboot": remove dead bots from database, ensure live bots have WebHooks
app.put('/reboot', async (req, res) => {
  const bots = await Bot.findAll()
  for (const bot of bots) {
    if (await bot.check()) {
      await bot.ensureWebHook()
    }
  }
  res.send('')
})

export default app
