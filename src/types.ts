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
};

export type ServiceType = {
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
    attachments?: {
      contentUri: string;
      name: string;
    }[];
  };
  ownerId: string;
};
