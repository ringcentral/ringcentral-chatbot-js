import {Bot} from '../models';
import {BotType} from '../types';

// todo: define a new type for message
export const userSubmitted = async (message: any) => {
  const type = message.type;
  if (!type) {
    return; // not a submit btn
  }
  const botId = message.data.bot_id; // replace this with official bot extension id once it is included in the payload
  const userId = message.user.extId;
  const groupId = message.conversation.id;
  const bot = (await Bot.findByPk(botId)) as unknown as BotType;
  const group = await bot.getGroup(groupId);
  return {group, bot, userId, message: message};
};
