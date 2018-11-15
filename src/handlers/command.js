import cronParser from 'cron-parser'

import Service from '../models/Service'

const help = args => {
  if (!args) {
    return { text: `
- **help [command]**: show help message [about command]
- **new / add / create <cron> <message>**: add a cron job
- **list / ls**: list all cron jobs
- **remove / rm / delete <ID>**: delete a cron job by ID
`.trim()
    }
  }
  const command = args.split(/\s+/)[0]
  switch (command) {
    case 'help':
      return { text: `**help [command]**: show help message [about command]` }
    case 'new':
    case 'add':
    case 'create':
      return { text: `**new / add / create <cron> <message>**: add a cron job. Example:

      [code]new */2 * * * * hello world[/code]
Example above created a cron job sending "hello world" to Glip every 2 minutes.

For cron job syntax, please check https://cdn.filestackcontent.com/gE30XyppQqyNCnNB4a5c
` }
    case 'list':
    case 'ls':
      return { text: '**list / ls**: list all cron jobs' }
    case 'remove':
    case 'rm':
    case 'delete':
      return { text: '**remove / rm / delete <ID>**: delete a cron job by ID' }
    default:
      return [{ text: `unkown command "${command}", list of known commands:` }, help(undefined)]
  }
}

const handler = async (command, args, options) => {
  switch (command.toLowerCase()) {
    case 'help':
      return help(args)
    case 'new':
    case 'add':
    case 'create':
      const tokens = args.split(/\s+/)
      if (tokens.length < 6) {
        return { text: 'Cron job syntax is invalid. Please check https://cdn.filestackcontent.com/gE30XyppQqyNCnNB4a5c' }
      }
      const expression = tokens.slice(0, 5).join(' ')
      try {
        cronParser.parseExpression(expression, { utc: true })
      } catch (e) {
        return { text: 'Cron job syntax is invalid. Please check https://cdn.filestackcontent.com/gE30XyppQqyNCnNB4a5c' }
      }
      const message = tokens.slice(5).join(' ')
      await Service.create({
        name: 'Crontab',
        botId: options.botId,
        groupId: options.groupId,
        userId: options.userId,
        data: { expression, message }
      })
      return { text: `cron job added: [code]${expression} ${message}[/code]` }
    case 'list':
    case 'ls':
      // todo: list all cron jobs
      return { text: 'all cron jobs' }
    case 'remove':
    case 'rm':
    case 'delete':
      // todo: delete cron job
      return { text: 'cron job deleted' }
    default:
      return [{ text: 'Sorry, I don\'t understand, please check the manual:' }, help(undefined)]
  }
}

export default handler
