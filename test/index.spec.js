/* eslint-env jest */
import sequelize from '../src/models/sequelize'
import Bot from '../src/models/Bot'
import OAuth from '../src/models/OAuth'
import Service from '../src/models/Service'

describe('default', () => {
  test('default', async () => {
    await sequelize.authenticate() // will throw if cannot connect
    await Bot.sync()
    await OAuth.sync()
    await Service.sync()
    await Bot.create({
      id: '1',
      token: {
        hello: 'world'
      }
    })
    const bots = await Bot.findAll()
    console.log(JSON.stringify(bots))
  })
})
