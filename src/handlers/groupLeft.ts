import {Service} from '../models';
import {Message} from '../types';

export const groupLeft = async (message: Message) => {
  const botId = message.ownerId;
  const groupId = message.body.id;
  await Service.destroy({where: {botId, groupId}});
};
