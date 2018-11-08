import delay from 'timeout-as-promise'
import express from 'express'

import Bot from '../models/Bot'
import { deleted, groupJoined, postAdded } from '../handlers/bot'

const app = express()

// add private bot to Glip
app.post('/oauth', async (req, res) => {
  const token = req.body
  const bot = await Bot.init(token)
  res.send('Bot added')

  // setup WebHook
  let done = false
  while (!done) { // cannot setup WebHook until bot user is ready
    await delay(10000)
    done = await bot.setupWebHook()
  }
})

// add public bot to Glip
app.get('/oauth', async (req, res) => {
  const bot = await Bot.init(req.query.code)
  res.send('Bot added')

  // setup WebHook
  let done = false
  while (!done) { // cannot setup WebHook until bot user is ready
    await delay(10000)
    done = await bot.setupWebHook()
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
