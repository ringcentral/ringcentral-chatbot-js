import express from 'express'

import botApp from './bot'
import adminApp from './admin'

const createApp = handle => {
  const app = express()
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use('/admin', adminApp(handle))
  app.use('/bot', botApp(handle))
  return app
}

export default createApp
