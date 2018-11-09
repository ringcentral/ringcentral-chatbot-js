import express from 'express'

import Bot from '../models/Bot'
import Service from '../models/Service'
import OAuth from '../models/OAuth'

const app = express()

app.put('/database', async (req, res) => {
  await Bot.sync()
  await Service.sync()
  await OAuth.sync()
  res.send('database inited')
})

app.put('/webhook', async (req, res) => {
  const bots = await Bot.findAll()
  for (const bot of bots) {
    if (await bot.check()) {
      await bot.ensureWebHook()
    }
  }
  res.send('webhook inited')
})

export default app
