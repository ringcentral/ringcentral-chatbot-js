import express from 'express'

import botApp from './bot'
import adminApp from './admin'

const createApp = (handle, skills = []) => {
  const mergedHandle = async event => {
    let handled = false
    if (handle) {
      handled = await handle(event, handled)
    }
    for (const skill of skills) {
      if (skill.handle) {
        handled = handled || await skill.handle(event, handled)
      }
    }
  }
  const app = express()
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use('/admin', adminApp(mergedHandle))
  app.use('/bot', botApp(mergedHandle))
  for (const skill of skills) {
    if (skill.app) {
      app.use('/', skill.app)
    }
  }
  return app
}

export default createApp
