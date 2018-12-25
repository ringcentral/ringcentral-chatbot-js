import express from 'express'

import botApp from './bot'
import adminApp from './admin'

const createApp = (handle, skills = []) => {
  const mergedHandle = async (...args) => {
    await handle(...args)
    for (const skill of skills) {
      await skill.handle(...args)
    }
  }
  const app = express()
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use('/admin', adminApp(mergedHandle))
  app.use('/bot', botApp(mergedHandle))
  return app
}

export default createApp
