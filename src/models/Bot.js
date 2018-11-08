import Sequelize from 'sequelize'
import RingCentral from 'ringcentral-js-concise'

import sequelize from './sequelize'

const Bot = sequelize.define('bot', {
  id: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  token: {
    type: Sequelize.JSON
  }
})

Bot.init = async code => {
  const rc = new RingCentral(
    process.env.RINGCENTRAL_CHATBOT_CLIENT_ID,
    process.env.RINGCENTRAL_CHATBOT_CLIENT_SECRET,
    process.env.RINGCENTRAL_SERVER
  )
  if (typeof code === 'string') { // public bot
    try {
      await rc.authorize({ code, redirectUri: process.env.RINGCENTRAL_CHATBOT_SERVER + '/bot/oauth' })
    } catch (e) {
      console.log('Bot authorize', e.response.data)
      throw e
    }
    const token = rc.token()
    return Bot.create({
      id: token.owner_id,
      token
    })
  } else { // private bot
    rc.token(code)
    const r = await rc.get('/restapi/v1.0/account/~/extension/~')
    return Bot.create({
      id: r.data.id,
      token: { ...code, owner_id: r.data.id }
    })
  }
}

Object.defineProperty(Bot.prototype, 'rc', {
  get: function () {
    const rc = new RingCentral(
      process.env.RINGCENTRAL_CHATBOT_CLIENT_ID,
      process.env.RINGCENTRAL_CHATBOT_CLIENT_SECRET,
      process.env.RINGCENTRAL_SERVER
    )
    rc.token(this.token)
    return rc
  }
})

Bot.prototype.check = async function () {
  try {
    await this.rc.get('/restapi/v1.0/account/~/extension/~')
    return true
  } catch (e) {
    if (!e.response) {
      throw e
    }
    const errorCode = e.response.data.errorCode
    if (errorCode === 'OAU-232' || errorCode === 'CMN-405') {
      await this.destroy()
      console.log(`Bot user ${this.id} had been deleted`)
      return false
    }
    throw e
  }
}

Bot.prototype.setupWebHook = async function () {
  try {
    await this.rc.post('/restapi/v1.0/subscription', {
      eventFilters: [
        '/restapi/v1.0/glip/posts',
        '/restapi/v1.0/glip/groups',
        '/restapi/v1.0/account/~/extension/~'
      ],
      expiresIn: 473040000, // 15 years
      deliveryMode: {
        transportType: 'WebHook',
        address: process.env.RINGCENTRAL_CHATBOT_SERVER + '/bot/webhook'
      }
    })
    return true
  } catch (e) {
    const errorCode = e.response.data.errorCode
    if (errorCode === 'SUB-406') {
      return false
    }
    console.log('Bot setupWebHook', e.response.data)
    throw e
  }
}

Bot.sync() // CREATE TABLE IF NOT EXISTS

export default Bot
