# Integrate with third party services

It is quite common for a bot to integrate with third party services. For example:

- You might want to create a bot reading/writing information from/to Google Sheets.
- Or you might want to your bot to display information about your project which is hosted on GitHub.

In either case, your bot needs to integrate with third party services (Google/GitHub).

Almost all third party services use OAuth for authorization.
So we summarized the best practice for integrating a third party service.


## Database

After you [setup database](./README.md#setup-database), there are two tables: `bots` & `services`.
`services` table is to store information about third party services.

Here is the schema SQL for `services` table:

```sql
CREATE TABLE `services` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `name` VARCHAR(255),
`botId` VARCHAR(255), `groupId` VARCHAR(255), `userId` VARCHAR(255), `data` JSON,
`createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL);
```

### Database table fields

- name: service name, such as "GoogleSheets", "GitHub"...etc. It uniquely identifies a third party service.
- botId: chatbot bot user ID. For a public bot, there will be bot users for each company. Sometimes you need to store bot ID.
- groupId: more often than not, you just want to add a serice to a specific chat group. In this field you can store that group's ID.
- userId: this is the Glip user ID who added the service (to a specific chat group).
- data: this is a JSON field. You can store ANY data, but normally it should contain third party service's access token.


## A real sample

Let's take [Glip GitHub Chatbot](https://github.com/tylerlong/glip-github-chatbot) for example.

In order to integrate a third party service, we need to read its [documentation for authorization](https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps/).

Form its documentation above, we can see that there are 3 steps.

### Step 1: Users are redirected to request their GitHub identity

We need to construct an URI and send it to user:

```js
const sendAuthLink = async (bot, group) => {
  await bot.sendMessage(group.id, {
    text: `Please click [here](https://github.com/login/oauth/authorize?${buildQueryString({
      client_id: process.env.GITHUB_CLIENT_ID,
      redirect_uri: process.env.RINGCENTRAL_CHATBOT_SERVER + '/github/oauth',
      scope: 'read:user',
      state: `${group.id}:${bot.id}`
    })}) to authorize me to access your GitHub data.`
  })
}
```

Note: code snippet above might not be the latest version.
Please refer to [this file](https://github.com/tylerlong/glip-github-chatbot/blob/master/express.js) for the latest code.

![](https://github.com/tylerlong/glip-github-chatbot/blob/master/screenshot1.png)


### Step 2: Users are redirected back to your site by GitHub

We need to define a URI to handle users' redirected-back request:

```js
app.get('/github/oauth', async (req, res) => {
  const { code, state } = req.query
  const [groupId, botId] = state.split(':')
  const r = await axios.post('https://github.com/login/oauth/access_token', {
    client_id: process.env.GITHUB_CLIENT_ID,
    client_secret: process.env.GITHUB_CLIENT_SECRET,
    code,
    state,
    redirect_uri: process.env.RINGCENTRAL_CHATBOT_SERVER + '/github/oauth'
  })
  const accessToken = r.data.split('&')[0].split('=')[1]
  const service = await findService({ id: botId }, { id: groupId })
  if (service === null) {
    Service.create({ name: 'GitHub', groupId, botId, data: { accessToken } })
  } else {
    service.update({ data: { accessToken } })
  }
  res.send('Please close this page')
})
```

Note: code snippet above might not be the latest version.
Please refer to [this file](https://github.com/tylerlong/glip-github-chatbot/blob/master/express.js) for the latest code.

In the code above, we get code parameter and exchange it for access token.
Then we save/update a service in the `services` database table.


### Step 3: Your app accesses the API with the user's access token

```js
const service = await findService(bot, group)
if (service === null) {
  await sendAuthLink(bot, group)
  return
}
const r = await axios.get(`https://api.github.com/user?access_token=${service.data.accessToken}`)
await bot.sendMessage(group.id, { text: `Here is your GitHub profile: [code]${JSON.stringify(r.data, null, 2)}[/code]` })
```

Note: code snippet above might not be the latest version.
Please refer to [this file](https://github.com/tylerlong/glip-github-chatbot/blob/master/express.js) for the latest code.

![](https://github.com/tylerlong/glip-github-chatbot/blob/master/screenshot2.png)
