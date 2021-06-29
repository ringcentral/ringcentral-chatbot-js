import * as R from 'ramda';

import sequelize from '../src/models/sequelize';
import {Bot, Service, Cache} from '../src/models';
import { BotType } from '../src/types';

describe('models', () => {
  test('default', async () => {
    await sequelize.authenticate();
    await Bot.sync({force: true});
    await Service.sync({force: true});
    await Cache.sync({force: true});
    await Bot.create({
      id: '1',
      token: {
        hello: 'world',
      },
    });
    let bots = await Bot.findAll() as unknown as BotType[];
    expect(
      bots.map(bot =>
        R.dissoc<any, any>('updatedAt', R.dissoc<any, any>('createdAt', bot.toJSON()))
      )
    ).toEqual([{id: '1', token: {hello: 'world'}, data: null}]);
    expect(bots[0].token).toEqual({hello: 'world'});
    const bot = (await Bot.findByPk('1'))!;
    expect(R.dissoc<any, any>('updatedAt', R.dissoc<any, any>('createdAt', bot.toJSON()))).toEqual({
      id: '1',
      token: {hello: 'world'},
      data: null,
    });

    bots = await Bot.findAll({where: {id: 1}}) as unknown as BotType[];
    expect(bots.length).toBe(1);

    bots = await Bot.findAll({where: {id: 2}}) as unknown as BotType[];
    expect(bots.length).toBe(0);
  });
});
