# Advanced topics

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



## Integrate with third party services

It is quite common for a bot to integrate with third party services. For example:

- You might want to create a bot reading/writing information from/to Google Sheets.
- Or you might want to your bot to display information about your project which is hosted on GitHub.

In either case, your bot needs to integrate with third party services (Google/GitHub).

Almost all third party services use OAuth for authorization.
So we summarized the best practice for integrating a third party service.


### Database

After you [setup database](./README.md#setup-database), there are two tables: `bots` & `services`.
`services` table is to store information about third party services.

Here is the schema SQL for `services` table:

```sql
CREATE TABLE `services` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `name` VARCHAR(255), `botId` VARCHAR(255), `groupId` VARCHAR(255), `userId` VARCHAR(255), `data` JSON, `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL);
```

#### Database table fields

- name: service name, such as "GoogleSheets", "GitHub"...etc. It uniquely identifies a third party service.
- botId: chatbot bot user ID. For a public bot, there will be bot users for each company. Sometimes you need to store bot ID.
- groupId: more often than not, you just want to add a serice to a specific chat group. In this field you can store that group's ID.
- userId: this is the Glip user ID who added the service (to a specific chat group).
- data: this is a JSON field. You can store ANY data, but normally it should contain third party service's access token.


### A real sample

To be continued.
