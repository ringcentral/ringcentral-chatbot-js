import express from 'express';
import basicAuth from 'express-basic-auth';
import {Op, JSON as SQ_JSON, INTEGER, STRING} from 'sequelize';
import moment from 'moment';
import sequelize from '../models/sequelize';

import {Bot, Service, Cache, setupDatabase} from '../models';
import {BotType, ServiceType} from '../types';

const createApp = (handle: Function) => {
  const app = express();
  app.use(
    basicAuth({
      users: {
        [process.env.RINGCENTRAL_CHATBOT_ADMIN_USERNAME!]:
          process.env.RINGCENTRAL_CHATBOT_ADMIN_PASSWORD!,
      },
      unauthorizedResponse: () => '401 Unauthorized',
    })
  );

  // create database tables
  // ?force=true to delete existing tables
  app.put('/setup-database', async (req, res) => {
    await setupDatabase(req.query.force === 'true');
    await handle({type: 'SetupDatabase'});
    res.send('');
  });

  app.put('/update-token', async (req, res) => {
    const bot = (await Bot.findByPk(
      req.query.id as string
    )) as unknown as BotType;
    if (bot !== null) {
      await bot.updateToken((req.query.token as string).trim());
    }
    res.send('');
  });

  app.put('/migrate-database', async (req, res) => {
    const qi = sequelize.getQueryInterface();
    const desc = await qi.describeTable('bots');
    if (!desc.data) {
      await qi.addColumn('bots', 'data', {type: SQ_JSON});
    }

    const schemas = (await qi.showAllSchemas()) as {name: string}[];
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
          type: SQ_JSON,
        },
      });
    }
    res.send('');
  });

  // "maintain": remove dead bots from database, ensure live bots have WebHooks, destroy very old cache data
  app.put('/maintain', async (req, res) => {
    const bots = (await Bot.findAll()) as unknown as BotType[];
    for (const bot of bots) {
      if (await bot.check()) {
        await bot.ensureWebHook();
      }
    }
    const services = (await Service.findAll()) as unknown as ServiceType[];
    for (const service of services) {
      await service.check();
    }
    await Cache.destroy({
      where: {
        updatedAt: {
          [Op.lt]: moment().subtract(365, 'days').toDate(),
        },
      },
    });
    await handle({type: 'Maintain'});
    res.send('');
  });

  // provide administrator with database data for troubleshooting
  app.get('/dump-database', async (req, res) => {
    const bots = (await Bot.findAll()) as unknown as BotType[];
    let result = '';
    for (const bot of bots) {
      result += '*****************\n';
      result += `<pre>\n${JSON.stringify(bot, null, 2)}\n</pre>\n`;
      result += '*****************\n';
    }
    result += '\n<hr/>\n\n';
    const services = await Service.findAll();
    for (const service of services) {
      result += `<pre>\n${JSON.stringify(service, null, 2)}}\n</pre>\n`;
    }
    result += '\n<hr/>\n\n';
    const caches = await Cache.findAll();
    for (const cache of caches) {
      result += `<pre>\n${JSON.stringify(cache, null, 2)}}\n</pre>\n`;
    }
    res.send(result);
  });

  // provide administrator with subscriptions data for troubleshooting
  app.get('/list-subscriptions', async (req, res) => {
    const bots = (await Bot.findAll()) as unknown as BotType[];
    let result = '';
    for (const bot of bots) {
      result += '*****************\n';
      const subscriptions = await bot.getSubscriptions();
      result += `<pre>\n${JSON.stringify(subscriptions, null, 2)}\n</pre>\n`;
      result += '*****************\n';
    }
    res.send(result);
  });

  // create db tables if not exist
  setupDatabase();

  return app;
};

export default createApp;
