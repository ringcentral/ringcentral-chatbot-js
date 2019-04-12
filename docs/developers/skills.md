no_breadcrumb: True

# Developing Custom Bot Skills

A "skill" is a mechanism to reuse chatbot code that can be shared across multiple bots. A skill is just a plain JavaScript object with two optional properties:

- `handle` - a function which will be invoked when there is an event
- `app` - an express app

## Example Skills

### Ping Skill

The following shows the structure of a "Ping Skill" which will reply "pong" to anyone who types "ping." 

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
const pingSkill = { handle, app }
```

In addition to containing the simple messaging logic, the above skill exposes a new page at uri path '/hello', which, when visited, will display "world".

### Install the Skill

```js
import createApp from 'ringcentral-chatbot/dist/apps'

const app = createApp(undefined, [
    pingSkill
])
```

In the sample above `app` above is a chatbot app, and it has all the behaviors of `pingSkill`.

### "catch-all" skill

This following "Catch All" skill defines default behavior for your bot for all commands it does not recognize. 

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

## Real projects

### Ping Skill

- [Ping Skill](https://github.com/tylerlong/ringcentral-chatbot-skill-ping)
- [The Bot](https://github.com/tylerlong/ringcentral-chatbot-skills-demo) which uses the Ping Skill

### Google Drive Skill

- [Google Drive Skill](https://github.com/tylerlong/ringcentral-chatbot-skill-google-drive)
- [Google Drive Chatbot](https://github.com/tylerlong/glip-google-drive-chatbot)