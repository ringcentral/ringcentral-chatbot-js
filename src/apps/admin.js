import express from 'express'
import basicAuth from 'express-basic-auth'
import { Op, JSON, INTEGER, STRING } from 'sequelize'
import moment from 'moment'
import sequelize from '../models/sequelize';

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

  app.put('/migrate-database', async (req, res) => {
    const qi = sequelize.getQueryInterface();
    const desc = await qi.describeTable('bots');
    if (!desc.data) {
      await qi.addColumn('bots', 'data', {type: JSON});
    }

    const schemas = await qi.showAllSchemas();
    if (schemas.filter(schema => schema.name === 'caches').length === 0) {
      await qi.createTable('caches', {
        id: {
          type: INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        key: {
          type: STRING,
        },
        value: {
          type: JSON,
        },
      });
    }

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
