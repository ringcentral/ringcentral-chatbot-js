import express from 'express'
import bodyParser from 'body-parser'

import Bot from './models/Bot'
import botApp from './apps/bot'

(async () => {
  const bots = await Bot.findAll()
  for (const bot of bots) {
    await bot.check()
  }
})()

const app = express()
app.use(bodyParser.json())
app.use('/bot', botApp)
app.listen(3000)
