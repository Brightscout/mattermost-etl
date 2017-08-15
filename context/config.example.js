module.exports = {
  source: {
    uri: 'mssql://username:password@server:1433/database?encrypt=true&requestTimeout=30000'
  },
  target: {
    filename: 'data.json'
  },
  define: {
    team: {
      name: 'my-team-name',
      display_name: 'My Team Name',
      description: 'An example of a team',
      type: 'I',
      allow_open_invite: false
    },
    user: {
      auth_service: 'ldap',
    }
  }
}
