/* eslint-env jest */
import * as R from 'ramda'

import sequelize from '../src/models/sequelize'
import { Bot, Service, Cache } from '../src/models'

describe('models', () => {
  test('default', async () => {
    await sequelize.authenticate()
    await Bot.sync({ force: true })
    await Service.sync({ force: true })
    await Cache.sync({ force: true })
    await Bot.create({
      id: '1',
      token: {
        hello: 'world'
      }
    })
    let bots = await Bot.findAll()
    expect(bots.map(bot => R.dissoc('updatedAt', R.dissoc('createdAt', bot.toJSON())))).toEqual([{ id: '1', token: { hello: 'world' } }])
    expect(bots[0].token).toEqual({ hello: 'world' })
    const bot = await Bot.findByPk('1')
    expect(R.dissoc('updatedAt', R.dissoc('createdAt', bot.toJSON()))).toEqual({ id: '1', token: { hello: 'world' } })

    bots = await Bot.findAll({ where: { id: 1 } })
    expect(bots.length).toBe(1)

    bots = await Bot.findAll({ where: { id: 2 } })
    expect(bots.length).toBe(0)
  })
})
