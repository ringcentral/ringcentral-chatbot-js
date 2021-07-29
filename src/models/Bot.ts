import Sequelize from 'sequelize';
import RingCentral from '@rc-ex/core';
import waitFor from 'wait-for-async';
import FormData from 'form-data';
import {TokenInfo} from '@rc-ex/core/lib/definitions';
import RestException from '@rc-ex/core/lib/RestException';

import sequelize from './sequelize';
import Service from './Service';

const Bot = sequelize.define('bot', {
  id: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  token: {
    type: Sequelize.JSON,
  },
  data: {
    // all other data associated with this bot
    type: Sequelize.JSON,
  },
});

type InitOptions = {
  code: string;
  token: TokenInfo;
};

(Bot as any).init = async (initOptions: InitOptions) => {
  const code = initOptions.code;
  const token = initOptions.token;
  const rc = new RingCentral({
    clientId: process.env.RINGCENTRAL_CHATBOT_CLIENT_ID,
    clientSecret: process.env.RINGCENTRAL_CHATBOT_CLIENT_SECRET,
    server: process.env.RINGCENTRAL_SERVER,
  });
  if (code) {
    // public bot
    await rc.authorize({
      code,
      redirect_uri: process.env.RINGCENTRAL_CHATBOT_SERVER + '/bot/oauth',
    });
    const token = rc.token!;
    /*
    {
      access_token: 'xxxxxx',
      token_type: 'bearer',
      expires_in: 2147483647,
      scope: 'EditExtensions SubscriptionWebhook Glip Accounts',
      owner_id: '266262004',
      endpoint_id: 'p7GZlEVHRwKDwbx6UkH0YQ'
    }
    */
    return Bot.create({
      id: token.owner_id,
      token,
    });
  } else if (token) {
    // private bot
    /*
    {
      access_token: 'xxxxxx',
      creator_extension_id: '230919004',
      creator_account_id: '230919004',
      client_id: 'zNzIRgPiSbylEoW89Daffg'
    }
    */
    rc.token = token;
    const r = await rc.get('/restapi/v1.0/account/~/extension/~');
    const id = r.data.id.toString();
    return Bot.create({
      id,
      token: {...token, owner_id: id},
    });
  }
  return undefined;
};

Object.defineProperty(Bot.prototype, 'rc', {
  get: function () {
    const rc = new RingCentral({
      clientId: process.env.RINGCENTRAL_CHATBOT_CLIENT_ID,
      clientSecret: process.env.RINGCENTRAL_CHATBOT_CLIENT_SECRET,
      server: process.env.RINGCENTRAL_SERVER,
    });
    rc.token = this.token;
    return rc;
  },
});

Bot.prototype.check = async function () {
  try {
    await (this.rc as RingCentral).restapi().account().extension().get();
    return true;
  } catch (e) {
    if (!(e instanceof RestException)) {
      throw e;
    }
    const err = e as RestException;
    if (!err.response.data) {
      throw e;
    }
    const errorCode = e.response.data.errorCode;
    if (errorCode === 'OAU-232' || errorCode === 'CMN-405') {
      await this.remove();
      console.log(`Bot check: bot user ${this.id} had been deleted`);
      return false;
    }
    throw e;
  }
};

Bot.prototype.ensureWebHook = async function () {
  const subs = (
    await (this.rc as RingCentral).restapi().subscription().list()
  ).records!.filter(
    sub =>
      sub.deliveryMode?.address ===
      process.env.RINGCENTRAL_CHATBOT_SERVER + '/bot/webhook'
  );
  let hasActiveSub = false;
  for (const sub of subs) {
    if (hasActiveSub || sub.status !== 'Active') {
      await this.rc.delete(`/restapi/v1.0/subscription/${sub.id}`);
    } else {
      hasActiveSub = true;
    }
  }
  if (!hasActiveSub) {
    await this.setupWebHook();
  }
};
Bot.prototype.setupWebHook = async function () {
  let done = false;
  while (!done) {
    try {
      await this.rc.post('/restapi/v1.0/subscription', {
        eventFilters: [
          '/restapi/v1.0/glip/posts',
          '/restapi/v1.0/glip/groups',
          '/restapi/v1.0/account/~/extension/~',
        ],
        expiresIn: 473040000, // 15 years
        deliveryMode: {
          transportType: 'WebHook',
          address: process.env.RINGCENTRAL_CHATBOT_SERVER + '/bot/webhook',
        },
      });
      done = true;
    } catch (e) {
      if (!(e instanceof RestException)) {
        throw e;
      }
      const err = e as RestException;
      if (!err.response.data) {
        throw e;
      }
      const errorCode = e.response.data.errorCode;
      if (errorCode === 'SUB-406') {
        await waitFor({interval: 10000});
        continue;
      }
      throw e;
    }
  }
};

Bot.prototype.sendMessage = async function (groupId: string, messageObj: any) {
  const r = await this.rc.post(
    `/restapi/v1.0/glip/groups/${groupId}/posts`,
    messageObj
  );
  return r.data;
};

Bot.prototype.sendAdaptiveCard = async function (groupId: string, body: any) {
  const r = await this.rc.post(
    `/restapi/v1.0/glip/chats/${groupId}/adaptive-cards`,
    body
  );
  return r.data;
};

Bot.prototype.getGroup = async function (groupId: string) {
  try {
    const r = await this.rc.get(`/restapi/v1.0/glip/groups/${groupId}`);
    return r.data;
  } catch (e) {
    if (e.status === 404) {
      return undefined;
    }
    throw e;
  }
};

Bot.prototype.remove = async function () {
  const services = await Service.findAll({where: {botId: this.id}});
  for (const service of services) {
    await service.destroy();
  }
  await this.destroy();
};

Bot.prototype.rename = async function (newName: string) {
  await this.rc.put('/restapi/v1.0/account/~/extension/~', {
    contact: {firstName: newName},
  });
};

Bot.prototype.setAvatar = async function (data: any, name: string) {
  const formData = new FormData();
  formData.append('image', data, name);
  await this.rc.put(
    '/restapi/v1.0/account/~/extension/~/profile-image',
    formData,
    {
      headers: formData.getHeaders(),
    }
  );
};

Bot.prototype.getUser = async function (userId: string) {
  let r = await this.rc.get(`/restapi/v1.0/glip/persons/${userId}`);
  const glip = r.data;
  let rc;
  if (!glip.id.startsWith('glip-')) {
    r = await this.rc.get(
      `/restapi/v1.0/account/${glip.companyId}/extension/${glip.id}`
    );
    rc = r.data;
  }
  return {glip, rc};
};

Bot.prototype.getSubscriptions = async function () {
  const r = await this.rc.get('/restapi/v1.0/subscription');
  return r.data.records;
};

Bot.prototype.updateToken = async function (token: string) {
  this.token.access_token = token;
  this.changed('token', true);
  await this.save();
};

export default Bot;
