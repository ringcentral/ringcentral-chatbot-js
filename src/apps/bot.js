import express from 'express'

import Bot from '../models/Bot'
import { deleted, groupJoined, postAdded } from '../handlers/bot'

const app = express()

app.all('/oauth', async (req, res) => {
  const bot = await Bot.init({ code: req.query.code, token: req.body })
  res.send('Bot added')
  await bot.setupWebHook()
})

// notification bot for bot users
app.post('/webhook', async (req, res) => {
  const message = req.body
  console.log('Message received via bot WebHook:', JSON.stringify(message, null, 2))
  const body = message.body
  if (body) {
    switch (body.eventType) {
      case 'Delete':
        await deleted(body)
        break
      case 'GroupJoined':
        await groupJoined(body)
        break
      case 'PostAdded':
        await postAdded(body)
        break
      default:
        break
    }
  }

  res.header('validation-token', req.header('validation-token'))
  res.send('bot webhook replied')
})

export default app
