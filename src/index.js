import express from 'express'
import serverlessHTTP from 'serverless-http'

import botApp from './apps/bot'
import adminApp from './apps/admin'

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/admin', adminApp)
app.use('/bot', botApp)

const port = process.env.RINGCENTRAL_CHATBOT_EXPRESS_PORT
if (port) { // express.js
  app.listen(port, async () => {
    console.log(`Listening on ${port}`)
    const request = require('request-promise')
    await request.put(`http://localhost:${port}/admin/setup-database`)
    await request.put(`http://localhost:${port}/admin/reboot`)
  })
} else { // AWS lambda
  module.exports.handler = serverlessHTTP(app)
  module.exports.proxy = (event, context, callback) => {
    console.log(JSON.stringify(event, null, 2))
    const Lambda = require('aws-sdk/clients/lambda')
    const lambda = new Lambda({ region: process.env.AWS_REGION })
    lambda.invoke({
      FunctionName: process.env.AWS_LAMBDA_FUNCTION_NAME.replace(/-proxy$/, '-app'),
      InvocationType: 'Event', // so `lambda.invoke` is async
      Payload: JSON.stringify(event)
    }, (error, data) => {
      console.log(error, data)
    })
    callback(null, { statusCode: 200, body: '', headers: { 'Validation-Token': event.headers['Validation-Token'] } })
  }
}
