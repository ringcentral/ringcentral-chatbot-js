import Bot from './Bot'
import Service from './Service'
import Cache from './Cache'

const setupDatabase = async (force = false) => {
  await Bot.sync({ force })
  await Service.sync({ force })
  await Cache.sync({ force })
}

export {
  Bot, Service, Cache, setupDatabase
}
