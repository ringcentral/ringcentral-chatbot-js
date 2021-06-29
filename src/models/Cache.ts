import Sequelize from 'sequelize';

import sequelize from './sequelize';

const Cache = sequelize.define('cache', {
  id: {
    // cache ID
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  key: {
    // cache key
    type: Sequelize.STRING,
  },
  value: {
    // cache value
    type: Sequelize.JSON,
  },
});

export default Cache;
