import RingCentral from '@rc-ex/core';

export type BotType = {
  id: string;
  check: Function;
  ensureWebHook: Function;
  getSubscriptions: Function;
  setupWebHook: Function;
  remove: Function;
  getGroup: Function;
  rename: Function;
  setAvatar: Function;
  toJSON: Function;
  token: any;
  rc: RingCentral;
  updateToken: Function;
};

export type ServiceType = {
  id: number;
  name: string;
  botId: string;
  groupId: string;
  userId: string;
  data: any;
  check: Function;
};

export type Message = {
  body: {
    id: string;
    extensionId: string;
    text: string;
    creatorId: string;
    groupId: string;
    mentions:
      | null
      | {
          id: string;
          type: string;
        }[];
    attachments?: AttachmentType[];
  };
  ownerId: string;
};

export type AttachmentType = {
  type: string;
  contentUri: string;
  name: string;
};
