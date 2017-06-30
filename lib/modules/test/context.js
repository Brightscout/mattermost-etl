const { spy, stub } = require('sinon')

module.exports = function() {
  return {
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
        }
      }
    },
    jabber: {
      connect: stub().returns(Promise.resolve()),
      fetch: stub(),
      pipe: stub()
    },
    values: {

    },
    output: {
      write: spy(),
      end: spy()
    }
  }
}
