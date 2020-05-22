import Sequelize from 'sequelize'

import sequelize from './sequelize'

export const Service = sequelize.define('cache', {
  id: { // cache ID
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  key: { // cache key
    type: Sequelize.STRING
  },
  value: { // cache value
    type: Sequelize.JSON
  }
})
