no_breadcrumb: True

# Getting Started

To get started we recommend developing a bot on your local development machine or laptop. That can be done quickly and easily using the RingCentral Team Messaging Quick Start below.

<a href="https://developers.ringcentral.com/guide/team-messaging/manual/node" class="btn btn-primary">Read the Chatbot Quick Start &raquo;</a>

## Hello World: What a bot looks like

In the Quick Start above you will learn how to create and define bot behavior in just 10 lines of code. Here is the source code needed to create a "Ping Bot" - a bot that responds with "pong" whenever it hears someone say "ping."

```javascript linenums="1"
const createApp = require('ringcentral-chatbot/dist/apps').default

const handle = async event => {
  const { type, text, group, bot } = event
  if (type === 'Message4Bot' && text === 'ping') {
    await bot.sendMessage(group.id, { text: 'pong' })
  }
}
const app = createApp(handle)
app.listen(process.env.RINGCENTRAL_CHATBOT_EXPRESS_PORT)
```

You can checkout other [sample bots](../../samples/) to see more complex behaviors. 