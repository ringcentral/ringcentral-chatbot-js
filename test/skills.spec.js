/* eslint-env jest */
import express from 'express'

import createApp from '../src/apps'

let output

const coolSkillHandle = async event => {
  const { type, text } = event
  if (type === 'Message4Bot' && text === 'ping') {
    output = 'pong'
    return true // event handled
  }
  return false // event not handled
}
const coolSkillApp = express()
coolSkillApp.get('/hello', async (req, res) => {
  res.send('world')
})
const myCoolSkill = { handle: coolSkillHandle, app: coolSkillApp }

const catchAllHandle = async (event, handled) => {
  if (!handled) {
    output = 'unhandled'
  } else {
    // event has been handled by other skills already
  }
}
const catchAllSkill = { handle: catchAllHandle }

const app = createApp(undefined, [
  myCoolSkill,
  catchAllSkill
])

describe('skills', () => {
  test('ping pong', async () => {
    output = null
    await app.mergedHandle({ type: 'Message4Bot', text: 'ping' })
    expect(output).toBe('pong')
  })
  test('catch all', async () => {
    output = null
    await app.mergedHandle({ type: 'Message4Bot', text: 'run' })
    expect(output).toBe('unhandled')
    output = null
    await app.mergedHandle({ type: 'GroupJoined', text: 'ping' })
    expect(output).toBe('unhandled')
  })
})
