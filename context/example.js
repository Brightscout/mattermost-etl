module.exports = {
  config: {
    source: {
      uri: 'mssql://username:password@server:1433/jabber?encrypt=true'
    },
    target: {
      filename: 'data.json'
    }
  },
  team: {
    name: 'some-name',
    display_name: 'Some Name',
    description: 'Some Description',
    type: 'I',
    allow_open_invite: false
  }
}
