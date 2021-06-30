import axios from 'axios';

import {Bot} from '../models';
import {BotType, Message} from '../types';

export const postAdded = async (message: Message) => {
  let text = message.body.text;
  if (!text) {
    return; // not a text message
  }
  const botId = message.ownerId;
  const userId = message.body.creatorId;
  if (botId === userId) {
    return; // bot should not talk to itself to avoid dead-loop conversation
  }
  const groupId = message.body.groupId;
  const bot = (await Bot.findByPk(botId)) as unknown as BotType;
  const group = await bot.getGroup(groupId);
  const isPrivateChat = group.members.length <= 2;
  if (
    !isPrivateChat &&
    (message.body.mentions === null ||
      !message.body.mentions.some(m => m.type === 'Person' && m.id === botId))
  ) {
    return;
  }
  const regex = new RegExp(`!\\[:Person\\]\\(${bot.id}\\)`);
  text = text.replace(regex, ' ').trim();
  if (text.startsWith('__rename__')) {
    await bot.rename(text.substring(10).trim());
    return;
  }
  if (text === '__setAvatar__') {
    if ((message.body.attachments || []).length === 0) {
      return;
    }
    const attachment = message.body.attachments![0];
    const r = await axios.get(attachment.contentUri, {
      responseType: 'arraybuffer',
    });
    await bot.setAvatar(r.data, attachment.name);
    return;
  }
  if (text.startsWith('__updateToken__')) {
    await bot.updateToken(text.substring(15).trim());
    return;
  }
  return {text, group, bot, userId, message: message.body};
};
