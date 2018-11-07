import Bot from '../models/Bot'

const handle = app => {
  // add bot to Glip
  app.get('/bot-oauth', async (req, res) => {
    await Bot.authorize(req.query.code)
    res.send('Bot added')
  })
}

const bot = { handle }

export default bot
