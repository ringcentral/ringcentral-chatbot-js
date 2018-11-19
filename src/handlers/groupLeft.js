import { Service } from '../models'

export const groupLeft = async message => {
  const botId = message.ownerId
  const groupId = message.body.id
  await Service.destroy({ where: { botId, groupId } })
}
