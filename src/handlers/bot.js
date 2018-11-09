import Bot from '../models/Bot'

export const groupJoined = async message => {
  console.log('The bot joins a new chat group')
}

export const postAdded = async message => {
  console.log('The bot received a new message')
  if (message.body.text === 'ping') {
    const botId = message.ownerId
    const bot = await Bot.findByPk(botId)
    await bot.sendMessage(message.body.groupId, { text: 'pong' })
  }
}

export const deleted = async message => {
  const bot = await Bot.findByPk(message.body.extensionId)
  await bot.destroy()
  console.log(`Bot user ${message.body.extensionId} has been deleted`)
}
