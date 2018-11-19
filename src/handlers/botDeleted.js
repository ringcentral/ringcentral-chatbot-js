import { Bot } from '../models'

export const botDeleted = async message => {
  const botId = message.body.extensionId
  console.log(`Bot user ${botId} has been deleted`)
  const bot = await Bot.findByPk(botId)
  await bot.remove()
  return bot
}
