import express from 'express'
import { Subject } from 'rxjs'

import Bot from '../models/Bot'
import { deleted, postAdded } from '../handlers/bot'

const app = express()
app.$ = new Subject()

app.all('/oauth', async (req, res) => {
  const bot = await Bot.init({ code: req.query.code, token: req.body })
  await bot.setupWebHook() // this might take a while, depends on when the bot user is ready
  app.$.next({ type: 'BotAdded', bot })
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
          app.$.next({ type: 'Message4Bot', message: result })
        }
        break
      default:
        break
    }
    app.$.next({ type: body.eventType, message })
  }
  res.header('Validation-Token', req.header('Validation-Token'))
  res.send('')
})

export default app
