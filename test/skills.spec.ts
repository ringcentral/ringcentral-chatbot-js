import express from 'express';

import createApp from '../src/apps';

let output: string[] = [];

const coolSkillHandle = async (event: any) => {
  const {type, text} = event;
  if (type === 'Message4Bot' && text === 'ping') {
    output.push('pong');
    return true; // event handled
  }
  return false; // event not handled
};
const coolSkillApp = express();
coolSkillApp.get('/hello', async (req, res) => {
  res.send('world');
});
const myCoolSkill = {handle: coolSkillHandle, app: coolSkillApp};
const myCoolSkill2 = {handle: coolSkillHandle}; // two skills could handle the same event

const catchAllHandle = async (event: any, handled: boolean) => {
  if (!handled) {
    output.push('unhandled');
  } else {
    // event has been handled by other skills already
  }
};
const catchAllSkill = {handle: catchAllHandle};

const app = createApp(undefined, [myCoolSkill, myCoolSkill2, catchAllSkill]);

describe('skills', () => {
  test('ping pong', async () => {
    output = [];
    await (app as any).mergedHandle({type: 'Message4Bot', text: 'ping'});
    expect(output).toEqual(['pong', 'pong']); // all the skills have chance to handle an event
  });
  test('catch all', async () => {
    output = [];
    await (app as any).mergedHandle({type: 'Message4Bot', text: 'run'});
    expect(output).toEqual(['unhandled']);
    output = [];
    await (app as any).mergedHandle({type: 'GroupJoined', text: 'ping'});
    expect(output).toEqual(['unhandled']);
  });
});
