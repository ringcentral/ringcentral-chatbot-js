import Sequelize from 'sequelize'
import RingCentral from 'ringcentral-js-concise'
import delay from 'timeout-as-promise'
import FormData from 'form-data'

import sequelize from './sequelize'
import Service from './Service'

const Bot = sequelize.define('bot', {
  id: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  token: {
    type: Sequelize.JSON
  }
})

Bot.init = async ({ code, token }) => {
  const rc = new RingCentral(
    process.env.RINGCENTRAL_CHATBOT_CLIENT_ID,
    process.env.RINGCENTRAL_CHATBOT_CLIENT_SECRET,
    process.env.RINGCENTRAL_SERVER
  )
  if (code) { // public bot
    await rc.authorize({ code, redirectUri: process.env.RINGCENTRAL_CHATBOT_SERVER + '/bot/oauth' })
    const token = rc.token()
    return Bot.create({
      id: token.owner_id,
      token
    })
  } else if (token) { // private bot
    rc.token(token)
    const r = await rc.get('/restapi/v1.0/account/~/extension/~')
    return Bot.create({
      id: r.data.id,
      token: { ...token, owner_id: r.data.id }
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
    if (!e.data) {
      throw e
    }
    const errorCode = e.data.errorCode
    if (errorCode === 'OAU-232' || errorCode === 'CMN-405') {
      await this.remove()
      console.log(`Bot user ${this.id} had been deleted`)
      return false
    }
    throw e
  }
}

Bot.prototype.ensureWebHook = async function () {
  const r = await this.rc.get('/restapi/v1.0/subscription')
  for (const sub of r.data.records) {
    if (sub.deliveryMode.address === process.env.RINGCENTRAL_CHATBOT_SERVER + '/bot/webhook') {
      if (sub.status !== 'Active') {
        await this.rc.delete(`/restapi/v1.0/subscription/${sub.id}`)
      } else {
        return
      }
    }
  }
  await this.setupWebHook()
}
Bot.prototype.setupWebHook = async function () {
  let done = false
  while (!done) {
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
      done = true
    } catch (e) {
      const errorCode = e.data.errorCode
      if (errorCode === 'SUB-406') {
        await delay(10000)
        continue
      }
      throw e
    }
  }
}

Bot.prototype.sendMessage = async function (groupId, messageObj) {
  const r = await this.rc.post(`/restapi/v1.0/glip/groups/${groupId}/posts`, messageObj)
  return r.data
}

Bot.prototype.getGroup = async function (groupId) {
  const r = await this.rc.get(`/restapi/v1.0/glip/groups/${groupId}`)
  return r.data
}

Bot.prototype.remove = async function () {
  const services = await Service.findAll({ where: { botId: this.id } })
  for (const service of services) {
    await service.destroy()
  }
  await this.destroy()
}

Bot.prototype.rename = async function (newName) {
  await this.rc.put('/restapi/v1.0/account/~/extension/~', {
    contact: { firstName: newName }
  })
}

Bot.prototype.setAvatar = async function (data, name) {
  const formData = new FormData()
  formData.append('image', data, name)
  await this.rc.put('/restapi/v1.0/account/~/extension/~/profile-image', formData, {
    headers: formData.getHeaders()
  })
}

export default Bot
