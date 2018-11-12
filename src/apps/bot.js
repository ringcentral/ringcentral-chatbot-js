import express from 'express'

import Bot from '../models/Bot'
import { deleted, groupJoined, postAdded } from '../handlers/bot'

const app = express()

app.all('/oauth', async (req, res) => {
  const bot = await Bot.init({ code: req.query.code, token: req.body })
  await bot.setupWebHook() // this might take a while, depends on when the bot user is ready
  res.send('')
})

app.post('/webhook', async (req, res) => {
  const message = req.body
  console.log('Message received via bot WebHook:', JSON.stringify(message, null, 2))
  const body = message.body
  if (body) {
    switch (body.eventType) {
      case 'Delete':
        await deleted(message)
        break
      case 'GroupJoined':
        await groupJoined(message)
        break
      case 'PostAdded':
        await postAdded(message)
        break
      default:
        break
    }
  }
  res.header('validation-token', req.header('validation-token'))
  res.send('')
})

export default app
