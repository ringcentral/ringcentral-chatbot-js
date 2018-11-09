import express from 'express'

import Bot from './models/Bot'
import botApp from './apps/bot'

(async () => {
  const bots = await Bot.findAll()
  for (const bot of bots) {
    await bot.check()
    await bot.ensureWebHook()
  }
})()

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/bot', botApp)
app.listen(3000)
