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
Example above created a cron job sending "hello world" to Glip every 2 minutes
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

const handler = (command, args) => {
  switch (command.toLowerCase()) {
    case 'help':
      return help(args)
    case 'new':
    case 'add':
    case 'create':
      return { text: 'cron job added' }
    case 'list':
    case 'ls':
      return { text: 'all cron jobs' }
    case 'remove':
    case 'rm':
    case 'delete':
      return { text: 'cron job deleted' }
    default:
      return [{ text: 'Sorry, I don\'t understand, please check the manual:' }, help(undefined)]
  }
}

export default handler
