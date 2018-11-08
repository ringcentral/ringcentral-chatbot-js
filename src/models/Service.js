import Sequelize from 'sequelize'

import sequelize from './sequelize'

const Service = sequelize.define('service', {
  name: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  vendorName: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  ownerId: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  botId: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  groupId: {
    type: Sequelize.STRING,
    primaryKey: true
  }
})

Service.sync() // CREATE TABLE IF NOT EXISTS

export default Service
