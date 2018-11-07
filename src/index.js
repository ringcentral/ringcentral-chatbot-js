import sequelize from './models/sequelize'
import Bot from './models/Bot'
import OAuth from './models/OAuth'
import Service from './models/Service'

(async () => {
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
  const bots = await Bot.findAll({ attributes: ['id', 'token'] })
  console.log(JSON.stringify(bots))
})()
