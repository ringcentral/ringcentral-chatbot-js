import Sequelize from 'sequelize'
import path from 'path'

const sequelize = new Sequelize(
  `sqlite:///${path.join(__dirname, '..', 'db.sqlite')}`,
  {
    operatorsAliases: false,
    define: {
      timestamps: false
    }
  }
)

const Bot = sequelize.define('bots', {
  id: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  token: {
    type: Sequelize.JSON
  }
})

;(async () => {
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
