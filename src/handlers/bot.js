import Bot from '../models/Bot'

export const groupJoined = async event => {
  console.log('The bot joins a new chat group')
}

export const postAdded = async event => {
  console.log('The bot received a new message')
}

export const deleted = async event => {
  const bot = await Bot.findByPk(event.extensionId)
  await bot.destroy()
  console.log(`Bot user ${event.extensionId} has been deleted`)
}
