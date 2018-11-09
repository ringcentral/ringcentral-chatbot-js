import Bot from '../models/Bot'

export const groupJoined = async message => {
  console.log('The bot joins a new chat group')
}

export const postAdded = async message => {
  console.log('The bot received a new message')
  const botId = message.ownerId
  const userId = message.body.creatorId
  if (botId === userId) {
    return // bot should not talk to itself to avoid dead-loop conversation
  }
  if (message.body.text === 'ping') {
    const bot = await Bot.findByPk(botId)
    await bot.sendMessage(message.body.groupId, { text: 'pong' })
  }
}

export const deleted = async message => {
  const bot = await Bot.findByPk(message.body.extensionId)
  await bot.destroy()
  console.log(`Bot user ${message.body.extensionId} has been deleted`)
}
