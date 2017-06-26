const { spy } = require('sinon')

module.exports = {
  config: {
    source: {
      uri: 'mssql://username:password@server:1433/jabber?encrypt=true'
    },
    target: {
      filename: 'data.json'
    },
    define: {
      team: {
        name: 'test',
        display_name: 'Test Team',
        description: 'Our Test Team',
        type: 'I',
        allow_open_invite: false
      },
      user: {
        auth_service: 'ldap',
        auth_data: 'username-ldap-field'
      }
    }
  },
  values: {

  },
  output: {
    write: spy(),
    end: spy()
  },
}
