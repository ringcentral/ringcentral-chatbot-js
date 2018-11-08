import Sequelize from 'sequelize'

import sequelize from './sequelize'

const OAuth = sequelize.define('oauth', {
  vendorName: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  ownerId: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  token: {
    type: Sequelize.JSON
  }
})

OAuth.sync() // CREATE TABLE IF NOT EXISTS

export default OAuth
