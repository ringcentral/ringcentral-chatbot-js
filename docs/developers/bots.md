# Building Bots

## Sending Messages

Every event handler receives as input a `bot` object. That object can then be used to send messages. For example:

```javascript
bot.sendMessage(group.id, { text: 'Hello World' })
```

In the above example the bot responds with simple text only. Bots can also respond with more formatted messages, which is achieved through the use of a message attachment. The RingCentral Developer Guide discussed [message attachments](https://developers.ringcentral.com/guide/team-messaging/manual/attachments) in more detail. 

## Event Handling

A bot handler takes as input an "event." Based on the type of the event, you can trigger different actions and behaviors. Here is a simple switch statement for handling different events:

```javascript
export const handle = async event => {
    console.log(event.type, 'event')
    switch (event.type) {
    case 'Message4Bot':
	break
    case 'BotJoinGroup': // bot user joined a new group
	break
    default:
	break
    }
}
```

### Event Types

| Event | Description |
|-|-|
| `Message4Bot` | Triggered when a message is posted to a team/conversation the bot belongs to. **This event is NOT triggered for messages posted by the bot, to prevent the bot from responding to itself.** |
| `BotRemoved` | Trigger when a bot is removed from a team/conversation. |
| `BotJoinGroup` | Trigger when a bot joins a team/conversation. |

### Message4Bot

When the Message4Bot event is triggered, the following parameters are passed to the handler:

* `text` - The text/message posted. This should be parsed by the handler to determine what action to perform.
* `group` - A group object representing the group/team/conversion the message was posted to. 
* `bot` - A bot object representing the bot receiving the message. 
* `userId` - The id of the user who sent the message. 