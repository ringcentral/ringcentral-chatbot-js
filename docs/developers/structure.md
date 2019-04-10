no_breadcrumb: True

# Structuring Your Bot Project

We recommend structuring your project to encapsulate your bot's logic and behavior independently from the hosting container, e.g. Express and Lambda. A project might therefore have this structure:

* `bot.js` - This file contains just your bot logic, the messages it sends, the events it listens for, etc. 
* `app.js` - This file the logic for handling web requests, such as processing webhooks from third parties, and any other web content that could be served. 
* `express.js` - This file wraps `app.js` to host in an Express container for hosting on your laptop or your own infrastructure. 
* `lambda.js` - This file wraps `app.js` to host on AWS Lambda. 

## bot.js

```javascript
import { Service } from 'ringcentral-chatbot/dist/models'
export const handle = async event => {
    console.log(event.type, 'event')
    switch (event.type) {
    case 'Message4Bot':
        // bot logic
        break
    default:
        break
    }
}
```

### app.js

```javascript
import createApp from 'ringcentral-chatbot/dist/apps'
import { Service, Bot } from 'ringcentral-chatbot/dist/models'
import { handle } from './bot'
const app = createApp(handle)
// app logic, for example...
// app.get('/webhook-handler', async (req, res) => { })
export default app
```

### express.js

```javascript
import axios from 'axios'
import app from './bot'
let PORT = process.env.RINGCENTRAL_CHATBOT_SERVER
if (process.env.PORT) {
    PORT = process.env.PORT
}
app.listen( PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
```

### lambda.js

```javascript
const serverlessHTTP = require('serverless-http')
const { createAsyncProxy } = require('ringcentral-chatbot/dist/lambda')
const createApp = require('ringcentral-chatbot/dist/apps').default
const app = require('./app').default
module.exports.app = serverlessHTTP(app)
module.exports.proxy = createAsyncProxy('app')
```

