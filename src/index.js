import express from 'express'
import bodyParser from 'body-parser'

import bot from './handlers/bot'

const app = express()
app.use(bodyParser.json())

bot.handle(app)

app.listen(3000)
