import express from 'express'
import basicAuth from 'express-basic-auth'
import { Op } from 'sequelize'
import moment from 'moment'

import { Bot, Service, Cache, setupDatabase } from '../models'

const createApp = handle => {
  const app = express()
  app.use(basicAuth({
    users: {
      [process.env.RINGCENTRAL_CHATBOT_ADMIN_USERNAME]: process.env.RINGCENTRAL_CHATBOT_ADMIN_PASSWORD
    },
    unauthorizedResponse: req => '401 Unauthorized'
  }))

  // create database tables
  // ?force=true to delete existing tables
  app.put('/setup-database', async (req, res) => {
    await setupDatabase(req.query.force === 'true')
    await handle({ type: 'SetupDatabase' })
    res.send('')
  })

  // "maintain": remove dead bots from database, ensure live bots have WebHooks, destroy very old cache data
  app.put('/maintain', async (req, res) => {
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
    await Cache.destroy({
      where: {
        updatedAt: {
          [Op.lt]: moment().subtract(365, 'days').toDate()
        }
      }
    })
    await handle({ type: 'Maintain' })
    res.send('')
  })

  // provide administrator with diagnostic information for troubleshooting
  app.get('/diagnostic', async (req, res) => {
    const bots = await Bot.findAll()
    let result = ''
    for (const bot of bots) {
      result += '*****************\n'
      result += `<pre>\n${JSON.stringify(bot, null, 2)}\n</pre>\n`
      const subscriptions = await bot.getSubscriptions()
      result += `<pre>\n${JSON.stringify(subscriptions, null, 2)}\n</pre>\n`
      result += '*****************\n'
    }
    result += '\n<hr/>\n\n'
    const services = await Service.findAll()
    for (const service of services) {
      result += `<pre>\n${JSON.stringify(service, null, 2)}}\n</pre>\n`
    }
    result += '\n<hr/>\n\n'
    const caches = await Cache.findAll()
    for (const cache of caches) {
      result += `<pre>\n${JSON.stringify(cache, null, 2)}}\n</pre>\n`
    }
    res.send(result)
  })

  // create db tables if not exist
  setupDatabase()

  return app
}

export default createApp
