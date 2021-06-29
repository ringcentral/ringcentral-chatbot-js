import {Bot} from '../models';
import {BotType, Message} from '../types';

export const botDeleted = async (message: Message) => {
  const botId = message.body.extensionId;
  console.log(`Event: bot user ${botId} has been deleted`);
  const bot = (await Bot.findByPk(botId)) as unknown as BotType;
  await bot.remove();
  return bot;
};
