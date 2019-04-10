# Deploying a Bot to AWS Lambda

The following guide builds upon the bot you created using the [Getting Started guide](./get-started). If you have not successfully built and tested your bot locally, we recommend you do that first.

## Install dependencies

```bash
yarn add ringcentral-chatbot pg serverless-http
yarn add --dev serverless
```

We installed pg because we would like to use PostgreSQL as database. In order to deploy to AWS Lambda, you can choose either PostgreSQL or MySQL as database. Install mysql of you use MySQL as database. For local development, you can choose SQLite(refer to Quick start with Express.js).

We use serverless-http to use Express.js code in AWS Lambda. So that we can reuse code between Express.js and AWS Lambda.

We use serverless framework to help us deploy the project to AWS with ease.

## Code the Bot

Create lambda.js file with the following content:

```javascript
const createApp = require('ringcentral-chatbot/dist/apps').default
const { createAsyncProxy } = require('ringcentral-chatbot/dist/lambda')
const serverlessHTTP = require('serverless-http')

const handle = async event => {
  const { type, text, group, bot } = event
  if (type === 'Message4Bot' && text === 'ping') {
    await bot.sendMessage(group.id, { text: 'pong' })
  }
}
const app = createApp(handle)
module.exports.app = serverlessHTTP(app)
module.exports.proxy = createAsyncProxy('app')
```

You may notice that the code is similar to its Express.js version, especially the handle method is identical. This is because we would like to allow for greater code reuse, regardless of whether you are deploying your chatbot as an Express.js server or to AWS Lambda.

## Create and Setup Your Database

If you have access to a MySQL or PostgreSQL database you are free to use that. If you do not, you can use AWS's RDS service to create one through the following steps:

1. Login AWS Console and navigate to RDS. 
2. Create a PostgreSQL database.
3. Configure the security group so that it is publicly accessible with username and password.

Take a note of the database uri, database name, username and password, we will use them soon.

## Create .env.yml

Create `.env.yml` with the following properties (use [this template](https://github.com/tylerlong/ringcentral-chatbot-js/blob/master/.lambda.env.yml) to help):

| Property | Description |
|-|-|
| `RINGCENTRAL_SERVER` | Use https://platform.dev.ringcentral.com for sandbox and https://platform.ringcentral.com for production | 
| `RINGCENTRAL_CHATBOT_DATABASE_CONNECTION_URI` | please sepcify connection URI to a relational database. SQLite, MySQL and PostgreSQL are supported. We specify the AWS RDS we created above. | 
| `RINGCENTRAL_CHATBOT_CLIENT_ID` | Retrieve from the RingCentral Developer Console. | 
| `RINGCENTRAL_CHATBOT_CLIENT_SECRET` | Retrieve from the RingCentral Developer Console. | 
| `RINGCENTRAL_CHATBOT_SERVER` | We don't know until we deploy the project to AWS, let's specify a dummy one for now: https://xxxxxx.execute-api.us-east-1.amazonaws.com/prod | 
| `RINGCENTRAL_CHATBOT_ADMIN_USERNAME` | An admin username of your choice. |
| `RINGCENTRAL_CHATBOT_ADMIN_PASSWORD` | An admin password of your choice. | 

## Create serverless.yml

Create serverless.yml with following content:

```yaml
service:
  name: demo-ping-chatbot
provider:
  stage: ${opt:stage, 'prod'}
  name: aws
  runtime: nodejs8.10
  region: us-east-1
  memorySize: 256
  environment: ${file(./.env.yml)}
  iamRoleStatements:
    - Effect: Allow
      Action:
        - lambda:InvokeFunction
      Resource: "*"
package:
  exclude:
    - ./**
    - '!lambda.js'
    - '!node_modules/**'
  excludeDevDependencies: true
functions:
  app:
    handler: lambda.app
    timeout: 300
  proxy:
    handler: lambda.proxy
    events:
      - http: 'ANY {proxy+}'
```

## Get a Lambda URL

To obtain the public URL of your new chat bot, you must deploy to AWS:

```bash
npx sls deploy
```

## Update .env.yml

Once the project is successfully deployed, a Lambda URL will be provisioned to us. Now we need to edit the `.env.yml` file with this new URL. Change `RINGCENTRAL_CHATBOT_SERVER` accordingly. It should be in the form of:

> https://xxxxxx.execute-api.us-east-1.amazonaws.com/prod

## Redeploy to AWS

We must deploy the bot after we edit `env.yml`:

```bash
npx sls deploy
```

## Set the "OAuth Redirect URI"

Login to https://developer.ringcentral.com, navigate to your bot app, and open the "Settings" tab. Then set "OAuth Redirect URI" to your bot's OAuth endpoint. The URL is your Lambda URL plus "/prod/bot/oauth". For example:

> https://xxxxxx.execute-api.us-east-1.amazonaws.com/prod/bot/oauth

## Create database tables

```
curl -X PUT -u admin:password https://<chatbot-server>/prod/admin/setup-database
```

The access credentials (`-u admin:password`) are defined in the `env.yml` file we created above.

## Install and Test the Bot

Once all of the above is complete, open your Bot in the RingCentral Developer Console. Click "Bot" in the left-hand menu. Set your bot name, then click the button "Add to Glip." Then login to the Glip Sandbox to test. 

## Troubleshooting

- AWS Lambda connects AWS RDS issue
    - If you create an RDS manually and let it create a new security group for you.
        - By default, the security group only allows inbound traffic from your current laptop's public IP address
        - AWS Lambda by default cannot access the newly created AWS RDS
        - We need to update security group to allow inbound traffic from `0.0.0.0/0`
- AWS Lambda and `await` issue
    - AWS Lambda is stateless and it won't keep a background runner
    - So if your code is async, DO remember to `await`. Otherwise that code will not be executed before Lambda invocation terminates
    - I forgot to `await`, a weird phenomenon was: whenever I issued a command, I always got reply of previous command
- AWS Lambda global code dead-lock issue
    - Do NOT invoke lambda functions in global code outside of handlers
    - I tried once and it seemed to case dead-lock. Lots of requests which causes 429 error and database connection exhausted
        - In global code I did `axio.put('https://<bot-server>/admin/maintain')` and it caused dead-lock