# Skills

"Skill" is a mechanism to reuse chatbot code.
If there is a chatbot feature which is common enough, you might want to build a skill.

A skill is just a plain JavaScript object with two optional properties:

- handle
    - a function which will be invoked when there is an event
- app
    - an express app


## Code samples

### Create a skill

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

### Use the skill

```js
import createApp from 'ringcentral-chatbot/dist/apps'

const app = createApp(undefined, [
    myCoolSkill
])
```

`app` above is a chatbot app, and it has all the behaviors of `myCoolSkill`.

### "catch-all" skill

You may need a catch-all skill

```js
const handle = async (event, handled) => {
    if (!handled) {
      // This is an unhandled event
    } else {
      // event has been handled by other skills already
    }
    return true
}
const catchAllSkill = { handle }
```

Catch-all skill should be the last in the skills list


## Real projects

### Ping skill and bot

- [ping skill](https://github.com/tylerlong/ringcentral-chatbot-skill-ping)
- [The bot](https://github.com/tylerlong/ringcentral-chatbot-skills-demo) using the ping skill


### Google Drive skill and bot

- [Google Drive skill](https://github.com/tylerlong/ringcentral-chatbot-skill-google-drive)
- [Google Drive chatbot](https://github.com/tylerlong/glip-google-drive-chatbot)
