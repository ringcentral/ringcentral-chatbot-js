import express from 'express'
import EventEmitter from 'events'

import Bot from '../models/Bot'
import { deleted, postAdded } from '../handlers/bot'

const app = express()

class BotEventEmitter extends EventEmitter {}
const botEventEmitter = new BotEventEmitter()

app.all('/oauth', async (req, res) => {
  const bot = await Bot.init({ code: req.query.code, token: req.body })
  await bot.setupWebHook() // this might take a while, depends on when the bot user is ready
  botEventEmitter.emit('BotAdded', bot)
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
      case 'PostAdded':
        const result = await postAdded(message)
        if (result) {
          botEventEmitter.emit('Message4Bot', result)
        }
        break
      default:
        break
    }
    botEventEmitter.emit(body.eventType, message)
  }
  res.header('Validation-Token', req.header('Validation-Token'))
  res.send('')
})

app.bot = botEventEmitter
export default app
