import Sequelize from 'sequelize'
import path from 'path'

const sequelize = new Sequelize(
  `sqlite:///${path.join(__dirname, '..', 'db.sqlite')}`,
  { operatorsAliases: false }
)

const Bot = sequelize.define('bots', {
  id: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  token: {
    type: Sequelize.STRING
  }
})

;(async () => {
  try {
    await Bot.sync()
  } catch (e) {
    console.log(e)
    throw e
  }
})()
