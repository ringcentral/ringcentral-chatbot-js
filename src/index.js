import sequelize from './models/sequelize'
import Bot from './models/Bot'

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
  console.log(bots)
  console.log(JSON.stringify(bots))
  console.log(bots[0].id)
  console.log(bots[0].token)
})()
