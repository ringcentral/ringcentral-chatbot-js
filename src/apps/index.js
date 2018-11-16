import express from 'express'

import botApp from './bot'
import adminApp from './admin'

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/admin', adminApp)
app.use('/bot', botApp)

app.bot = botApp.bot
export default app
