import express from 'express'

import Bot from '../models/Bot'
import Service from '../models/Service'

const createApp = handle => {
  const app = express()

  // create database tables if not exists
  app.put('/setup-database', async (req, res) => {
    await Bot.sync()
    await Service.sync()
    res.send('')
  })

  // "reboot": remove dead bots from database, ensure live bots have WebHooks
  app.put('/reboot', async (req, res) => {
    const bots = await Bot.findAll()
    for (const bot of bots) {
      if (await bot.check()) {
        await bot.ensureWebHook()
      }
    }
    const services = await Service.findAll()
    for (const service of services) {
      await service.check()
    }
    res.send('')
  })

  app.get('/diagnostic', async (req, res) => {
    const bots = await Bot.findAll()
    let result = ''
    for (const bot of bots) {
      result += `<pre>\n${JSON.stringify(bot, null, 2)}\n</pre>\n`
      const subscriptions = await bot.getSubscriptions()
      result += `<pre>\n${JSON.stringify(subscriptions, null, 2)}\n</pre>\n`
    }
    res.send(result)
  })

  return app
}

export default createApp
