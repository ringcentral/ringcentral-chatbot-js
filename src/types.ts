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
};

export type ServiceType = {
  check: Function;
  data: any;
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
