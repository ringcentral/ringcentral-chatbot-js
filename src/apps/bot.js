import express from 'express'

import Bot from '../models/Bot'
import { deleted, postAdded } from '../handlers/bot'

const createApp = handle => {
  const app = express()

  app.all('/oauth', async (req, res) => {
    const bot = await Bot.init({ code: req.query.code, token: req.body })
    await bot.setupWebHook() // this might take a while, depends on when the bot user is ready
    handle({ type: 'BotAdded', bot })
    res.send('')
  })

  app.post('/webhook', async (req, res) => {
    const message = req.body
    console.log('Message received via bot WebHook:', JSON.stringify(message, null, 2))
    const body = message.body
    if (body) {
      switch (body.eventType) {
        case 'Delete':
          const bot = await deleted(message)
          handle({ type: 'BotRemoved', bot })
          break
        case 'PostAdded':
          const result = await postAdded(message)
          if (result) {
            handle({ type: 'Message4Bot', ...result })
          }
          break
        default:
          break
      }
      handle({ type: `WebHook_Event_${body.eventType}`, message })
    }
    res.header('Validation-Token', req.header('Validation-Token'))
    res.send('')
  })
}

export default createApp
