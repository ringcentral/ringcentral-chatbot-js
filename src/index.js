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
  const port = process.env.RINGCENTRAL_CHATBOT_EXPRESS_PORT
  app.listen(port, async () => {
    console.log(`Listening on ${port}`)
    await request.put(`http://localhost:${port}/admin/setup-database`)
    await request.put(`http://localhost:${port}/admin/reboot`)
  })
}
