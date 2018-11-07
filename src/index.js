import sequelize from './models/sequelize'
import Bot from './models/Bot'
import Service from './models/Service'
import Mapping from './models/Mapping'

(async () => {
  await sequelize.authenticate() // will throw if cannot connect
  await Bot.sync()
  await Bot.create({
    id: '1',
    token: {
      hello: 'world'
    }
  })
  const bots = await Bot.findAll({ attributes: ['id', 'token'] })
  console.log(JSON.stringify(bots))
  await Service.sync()
  await Mapping.sync()
})()
