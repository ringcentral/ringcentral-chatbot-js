import express from 'express'
import morgan from 'morgan'

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
  app.use(morgan('tiny'))
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

  const listen = app.listen.bind(app)
  app.listen = (port, callback) => {
    console.log(`Bot service listening on port ${port}
Please set your RingCentral app redirect URI to ${process.env.RINGCENTRAL_CHATBOT_SERVER}/bot/oauth`)
    listen(port, callback)
  }

  return app
}

export default createApp
