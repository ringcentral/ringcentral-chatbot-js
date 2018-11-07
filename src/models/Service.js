import Sequelize from 'sequelize'

import sequelize from './sequelize'

const Service = sequelize.define('services', {
  name: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  id: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  token: {
    type: Sequelize.JSON
  }
})

export default Service
