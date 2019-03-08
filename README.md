# RingCentral chatbot framework for JavaScript

## Philosophy

- Let developers focus on business logic instead of RingCentral/Glip Platform implementation details


## Quick start

- If you want to create a Glip chatbot and deploy it to your own server, please [read this tutorial](https://github.com/tylerlong/glip-ping-chatbot/tree/express) or [watch this video](https://youtu.be/CR66cwHvsOI).
- If you want to create a Glip chatbot and deploy it to AWS Lambda, please [read this tutorial](https://github.com/tylerlong/glip-ping-chatbot/tree/lambda) or [watch this video](https://youtu.be/JoEMXYmtn4Y).


## Advanced Demo bots

- [Glip Crontab Chatbot](https://github.com/tylerlong/glip-crontab-chatbot)
    - Allow Glip users to create cron jobs to send notifications
    - [Try it](https://www.ringcentral.com/apps/glip-crontab-chatbot)
    - By reading its source code, you will get how to handle messages from users and how to reply.
- [Glip RC Assistant Chatbot](https://github.com/tylerlong/rc-assistant)
    - Allow Glip users to query/edit their RingCentral data via Glip.
    - [Try it](https://www.ringcentral.com/apps/glip-rc-assistant-chatbot)
    - It is a demo for integrating Glip chatbot with RingCentral platform.
- [Glip Google Drive Chatbot](https://github.com/tylerlong/glip-google-drive-chatbot)
    - Allow Glip users to monitor their Google Drive events.
    - [Try it](https://www.ringcentral.com/apps/glip-google-drive-chatbot)
    - It is a demo for integrating Glip chatbot with a third party service (Google Drive)
    - It is also a demo for chatbot skills


## Create a RingCentral app


Click the link below to create a RingCentral app quickly:

[Create Bot App](https://developer.ringcentral.com/new-app?name=Sample+Bot+App&desc=A+sample+app+created+for+the+javascript+chatbot+framework&public=true&type=ServerBot&permissions=ReadAccounts,EditExtensions,SubscriptionWebhook,Glip&redirectUri=https://<chatbot-server>/bot/oauth)

Do remember to change redirect uri from `https://<chatbot-server>/bot/oauth` to the real uri.
If you don't have a public uri, leave that field blank.


## Supported features

- Bot token management
- Bot WebHook management
- Remove & re-add bot
- Deploy to AWS Lambda
- Update bot name and avatar
- Bot join & leave group


## Setup database

The first time you setup the bot, the database is empty, you need to create tables.

There is an easy way:

```
curl -X PUT -u admin:password https://<bot-server>/admin/setup-database
```


## Maintain

"Maintain" is useful in the following cases:

- If for reason bot server changed, you need to re-setup WebHooks
- You bot server was down for quite a while and your WebHooks have been blacklisted
- There is orphan data in database

You can "maintain" to resolve the issues above:

```
curl -X PUT -u admin:password https://<bot-server>/admin/maintain
```

It is recommended that you create a cron job to run this command daily.


## Diagnostic

Sometimes there are issues and you don't know what happened. This framework provides an interface for diagnostic:

```
curl -X GET -u admin:password https://<bot-server>/admin/diagnostic
```


## Hidden commands

The following commands are considered "hidden" or "easter eggs":

- `__rename__ <newName>`: rename bot to `newName`
- A message with text `__setAvatar__` and an attached image file: set bot avatar to the attached image


## Skills

"Skill" is a mechanism to reuse chatbot code.
If there is a chatbot feature which is common enough, you might want to build a skill.

A skill is just a plain JavaScript object with two optional properties:

- handle
    - a function which will be invoked when there is an event
- app
    - an express app


### Code samples

#### Create a skill

```js
const handle = async event => {
  const { type, text, group, bot } = event
  if (type === 'Message4Bot' && text === 'ping') {
    await bot.sendMessage(group.id, { text: 'pong' })
    return true // event handled
  }
  return false // event not handled
}
const app = express()
app.get('/hello', async (req, res) => {
  res.send('world')
})
const myCoolSkill = { handle, app }
```

`myCoolSkill` has the following behavior:

- Whenever it receives "ping" from an user, it will reply with "pong"
- It also create a new page at uri path '/hello', when visited it will display "world".

#### Use the skill

```js
import createApp from 'ringcentral-chatbot/dist/apps'

const app = createApp(undefined, [
    myCoolSkill
])
```

`app` above is a chatbot app, and it has all the behaviors of `myCoolSkill`.

#### "catch-all" skill

You may need a catch-all skill

```js
const handle = async (event, handled) => {
    if (!handled) {
      console.log(`This is an unhandled event`)
    } else {
      // event has been handled by other skills already
    }
}
const catchAllSkill = { handle }
```

Catch-all skill should be the last in the skills list


### Real projects

#### Ping skill and bot

- [ping skill](https://github.com/tylerlong/ringcentral-chatbot-skill-ping)
- [The bot](https://github.com/tylerlong/ringcentral-chatbot-skills-demo) using the ping skill


#### Google Drive skill and bot

- [Google Drive skill](https://github.com/tylerlong/ringcentral-chatbot-skill-google-drive)
- [Google Drive chatbot](https://github.com/tylerlong/glip-google-drive-chatbot)


## Todo

- Create a website to auto generate code for developer to download
    - let developer select what he wants to do, what programming language to use, and finally generate the code for him


## Notes

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
