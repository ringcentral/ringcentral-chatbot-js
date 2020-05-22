import Sequelize from 'sequelize'

import sequelize from './sequelize'
import Bot from './Bot'

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
  const bot = await Bot.findByPk(this.botId)
  if (!bot) {
    await this.destroy()
    return
  }
  const group = await bot.getGroup(this.groupId)
  if (!group || group.members.indexOf(bot.id) === -1) {
    await this.destroy()
  }
}

export default Service
