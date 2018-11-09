import express from 'express'

import botApp from './apps/bot'
import initApp from './apps/init'

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/init', initApp)
app.use('/bot', botApp)
app.listen(3000)
