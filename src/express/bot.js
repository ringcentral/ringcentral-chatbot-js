import delay from 'timeout-as-promise'
import express from 'express'

import Bot from '../models/Bot'
import { deleted, groupJoined, postAdded } from '../handlers/bot'

const app = express()

// add bot to Glip
app.get('/oauth', async (req, res) => {
  const bot = await Bot.authorize(req.query.code)
  res.send('Bot added')

  // setup WebHook
  let done = false
  while (!done) { // cannot setup WebHook until bot user is ready
    await delay(10000)
    done = bot.setupWebHook()
  }
})

// notification bot for bot users
app.post('/webhook', async (req, res) => {
  const message = req.body
  console.log('Message received via bot WebHook:', JSON.stringify(message, null, 2))
  const body = message.body
  if (body) {
    switch (body.eventType) {
      case 'Delete':
        deleted(body)
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
