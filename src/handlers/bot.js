import delay from 'timeout-as-promise'

import Bot from '../models/Bot'

const handle = app => {
  // add bot to Glip
  app.get('/bot-oauth', async (req, res) => {
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
  app.post('/bot-webhook', async (req, res) => {
    const message = req.body
    console.log('Message received via bot WebHook:', JSON.stringify(message, null, 2))
    const body = message.body
    if (body) {
      switch (body.eventType) {
        case 'Delete':
          if (body.extensionId) {
            const bot = await Bot.findByPk(body.extensionId)
            await bot.destroy()
            console.log(`Bot user ${body.extensionId} has been deleted`)
          }
          break
        default:
          break
      }
    }

    res.header('validation-token', req.header('validation-token'))
    res.send('/bot-webhook replied')
  })
}

const botHandler = { handle }

export default botHandler
