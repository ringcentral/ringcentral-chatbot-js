import Bot from './Bot'
import Service from './Service'
import Cache from './Cache'

const setupDatabase = async () => {
  await Bot.sync()
  await Service.sync()
  await Cache.sync()
}

export {
  Bot, Service, Cache, setupDatabase
}
