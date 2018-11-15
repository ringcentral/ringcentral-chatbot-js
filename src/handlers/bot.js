import Bot from '../models/Bot'
import commandHandler from './command'

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
  const groupId = message.body.groupId
  const bot = await Bot.findByPk(botId)
  const group = await bot.getGroup(groupId)
  const isPrivateChat = group.members.length <= 2
  if (!isPrivateChat && (
    message.body.mentions === null ||
    !message.body.mentions.some(m => m.type === 'Person' && m.id === botId)
  )) {
    return
  }
  let text = message.body.text
  text = text.replace(/!\[:Person\]\(\d+\)/g, ' ').trim()
  const command = text.split(/\s+/)[0]
  const args = text.split(/\s+(.+)/)[1]
  let replies = await commandHandler(command, args, { botId, groupId, userId })
  if (replies) {
    if (!Array.isArray(replies)) {
      replies = [replies]
    }
    for (const reply of replies) {
      await bot.sendMessage(groupId, reply)
    }
  }
}

export const deleted = async message => {
  console.log(`Bot user ${message.body.extensionId} has been deleted`)
  const bot = await Bot.findByPk(message.body.extensionId)
  await bot.destroy()
}
