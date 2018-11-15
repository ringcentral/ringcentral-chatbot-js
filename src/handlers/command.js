const handler = (command, args) => {
  switch (command.toLowerCase()) {
    case 'help':
      return { text: `- **help**: Show this help message
- **new / add / create**: add a cron job` }
    case 'new':
    case 'add':
    case 'create':
      return { text: 'cron job added' }
    default:
      break
  }
}

export default handler
