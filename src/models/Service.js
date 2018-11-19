import Sequelize from 'sequelize'

import sequelize from './sequelize'
import { Bot } from './Bot'

export const Service = sequelize.define('service', {
  id: { // service ID
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: { // service name
    type: Sequelize.STRING
  },
  botId: { // Glip bot ID
    type: Sequelize.STRING
  },
  groupId: { // Glip group ID
    type: Sequelize.STRING
  },
  userId: { // Glip user ID
    type: Sequelize.STRING
  },
  data: { // all other data associcated with this service
    type: Sequelize.JSON
  }
})

Service.prototype.check = async function () {
  const services = await Service.findAll()
  for (const service of services) {
    const bot = Bot.findByPk(service.botId)
    if (!bot) {
      service.destroy()
      continue
    }
    const group = await bot.getGroup(service.groupId)
    if (!group || group.members.indexOf(bot.id) === -1) {
      service.destroy()
      continue
    }
  }
}
