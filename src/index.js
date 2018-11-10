import express from 'express'
import serverlessExpress from 'aws-serverless-express'

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
  app.listen(3000, () => console.log(`Listening on 3000`))
}
