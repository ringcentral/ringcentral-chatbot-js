import express from 'express'
import serverlessExpress from 'aws-serverless-express'
import request from 'request-promise'

import botApp from './apps/bot'
import adminApp from './apps/admin'

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/admin', adminApp)
app.use('/bot', botApp)

if (process.env.LAMBDA_TASK_ROOT) { // AWS Lambda
  const server = serverlessExpress.createServer(app)
  exports.main = (event, context) => serverlessExpress.proxy(server, event, context)
} else {
  app.listen(3000, async () => {
    console.log(`Listening on 3000`)
    await request.put('http://localhost:3000/admin/setup-database')
    await request.put('http://localhost:3000/admin/reboot')
  })
}
