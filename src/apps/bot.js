import express from 'express'

import { Bot } from '../models'
import { botDeleted, postAdded, groupLeft } from '../handlers'

const createApp = handle => {
  const app = express()

  app.all('/oauth', async (req, res) => {
    const bot = await Bot.init({ code: req.query.code, token: req.body })
    await bot.setupWebHook() // this might take a while, depends on when the bot user is ready
    await handle({ type: 'BotAdded', bot })
    res.send('')
  })

  app.post('/webhook', async (req, res) => {
    const message = req.body
    console.log('WebHook payload:', JSON.stringify(message))
    const body = message.body
    if (body) {
      switch (body.eventType) {
        case 'Delete': {
          const deleteBot = await botDeleted(message)
          await handle({ type: 'BotRemoved', bot: deleteBot })
          break
        }
        case 'PostAdded': {
          const result = await postAdded(message)
          if (result) {
            await handle({ type: 'Message4Bot', ...result })
          }
          break
        }
        case 'GroupLeft':
          await groupLeft(message)
          break
        case 'GroupJoined': {
          const botId = message.ownerId
          const joinGroupBot = await Bot.findByPk(botId)
          const groupId = message.body.id
          await handle({ type: 'BotJoinGroup', bot: joinGroupBot, group: { id: groupId } })
          break
        }
        default:
          break
      }
      await handle({ type: body.eventType, message })
    }
    res.header('Validation-Token', req.header('Validation-Token'))
    res.send('')
  })

  return app
}

export default createApp
