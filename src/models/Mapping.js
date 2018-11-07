import Sequelize from 'sequelize'

import sequelize from './sequelize'

const Mapping = sequelize.define('mappings', {
  serviceName: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  serviceId: {
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

export default Mapping
