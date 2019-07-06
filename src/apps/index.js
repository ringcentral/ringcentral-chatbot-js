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
        const result = await skill.handle(event, handled)
        handled = handled || result
      }
    }
  }
  const app = express()
  app.use((req, res, next) => { // for log purpose
    console.log(req.path)
    next()
  })
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use('/admin', adminApp(mergedHandle))
  app.use('/bot', botApp(mergedHandle))
  for (const skill of skills) {
    if (skill.app) {
      app.use('/', skill.app)
    }
  }
  app.mergedHandle = mergedHandle // for unit testing
  return app
}

export default createApp
