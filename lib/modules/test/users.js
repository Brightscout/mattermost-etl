const expect = require('chai').expect
const users = require('../users')
const Fixtures = require('./fixtures')
const context = require('./context')()

describe('modules.users', function() {

  before(function(){
    context.values = {
      team: context.config.define.team,
      channels: {
        'admin@conference.example.com': {
          team: 'test',
          name: 'admin',
          display_name: 'Admin',
          header: 'Admin Test room',
          purpose: 'Admin Test room',
          type: 'O'
        },
        'uat-appsupport@conference.example.com': {
          team: 'hsin',
          name: 'uat-appsupport',
          display_name: 'Uat Appsupport',
          header: '',
          purpose: '',
          type: 'P'
        }
      }
    }
  })

  it('should process user objects', function(done) {

    context.jabber.fetch.returns(Promise.resolve({recordset: Fixtures.users}))

    users(context).then(function(c) {
      expect(c).to.equal(context)
      expect(Object.keys(c.values.users).length).equals(13)
      expect(c.output.write.args[0][0]).to.deep.equal({
        type: 'user',
        user: {
          username: 'micahel.cross',
          email: 'micahel.cross@example.com',
          auth_service: 'ldap',
          teams: [
            {
              name: 'test',
              channels: [
                {
                  name: 'admin'
                }, {
                  name: 'uat-appsupport'
                }
              ]
            }
          ]
        }
      })
      expect(c.output.write.args[1][0]).to.deep.equal({
        type: 'user',
        user: {
          username: 'sbarclay',
          email: 'sbarclay@example.com',
          auth_service: 'ldap',
          teams: [
            {
              name: 'test',
              channels: [
                {
                  name: 'admin'
                }
              ]
            }
          ]
        }
      })

      done()
    })
  })

  afterEach(function() {
    context.jabber.fetch.reset()
    context.output.write.reset()
  })
})
