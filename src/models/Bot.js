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

Bot.authorize = async code => {
  const rc = new RingCentral(
    process.env.RINGCENTRAL_CHATBOT_CLIENT_ID,
    process.env.RINGCENTRAL_CHATBOT_CLIENT_SECRET,
    process.env.RINGCENTRAL_SERVER
  )
  try {
    await rc.authorize({ code, redirectUri: process.env.RINGCENTRAL_CHATBOT_SERVER + '/bot-oauth' })
  } catch (e) {
    console.log('Bot authorize', e.response.data)
    throw e
  }
  const token = rc.token()
  Bot.create({
    id: token.owner_id,
    token
  })
}

Bot.sync()

export default Bot
