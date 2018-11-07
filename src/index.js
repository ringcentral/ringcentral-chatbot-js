import express from 'express'
import bodyParser from 'body-parser'

import Bot from './models/Bot'
import bot from './webhook/bot'

(async () => {
  const bots = await Bot.findAll()
  for (const bot of bots) {
    await bot.validate()
  }
})()

const app = express()
app.use(bodyParser.json())

bot.handle(app)

app.listen(3000)
