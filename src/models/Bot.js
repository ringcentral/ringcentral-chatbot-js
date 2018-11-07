import Sequelize from 'sequelize'

import sequelize from './sequelize'

const Bot = sequelize.define('bots', {
  id: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  token: {
    type: Sequelize.JSON
  }
})

export default Bot
