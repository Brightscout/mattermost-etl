module.exports = {
  source: {
    uri: 'mssql://dbscout:dbscout17@hsin.csrzizhdewvn.us-east-1.rds.amazonaws.com:1433/jabber?encrypt=true'
  },
  target: {
    filename: 'data.json'
  },
  define: {
    team: {
      name: 'hsin',
      display_name: 'HSIN',
      description: 'Homeland Security Information Network',
      type: 'I',
      allow_open_invite: false
    }
  }
}
