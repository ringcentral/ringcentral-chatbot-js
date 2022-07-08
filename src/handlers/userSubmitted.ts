import {Bot} from '../models';
import {BotType} from '../types';

export const userSubmitted = async (message: any) => {
  if (message.type !== 'button_submit') {
    return;
  }
  const botId = message.bot.id;
  const userId = message.user.extId;
  const groupId = message.conversation.id;
  const bot = (await Bot.findByPk(botId)) as unknown as BotType;
  const group = await bot.getGroup(groupId);
  return {group, bot, userId, message: message};
};
