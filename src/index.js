import express from 'express'
import bodyParser from 'body-parser'

import Bot from './models/Bot'
import bot from './express/bot'

(async () => {
  const bots = await Bot.findAll()
  for (const bot of bots) {
    await bot.check()
  }
})()

const app = express()
app.use(bodyParser.json())
app.use('/bot', bot)
app.listen(3000)
