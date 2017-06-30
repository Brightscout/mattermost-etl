const expect = require('chai').expect
const users = require('../users')
const Fixtures = require('./fixtures')
const context = require('./context')()

describe('modules.users', function() {

  it('should process user objects', function(done) {

    context.values = {
      team: context.config.define.team,
      channels: {
        'admin@conference.chat.hsinuat.dhs.gov': {
          team: 'test',
          name: 'admin',
          display_name: 'Admin',
          header: 'Admin Test room',
          purpose: 'Admin Test room',
          type: 'O'
        },
        'hsinuat-appsupport@conference.chat.hsinuat.dhs.gov': {
          team: 'hsin',
          name: 'hsinuat-appsupport',
          display_name: 'Hsinuat Appsupport',
          header: '',
          purpose: '',
          type: 'P'
        }
      }
    }

    context.jabber.fetch.returns(Promise.resolve({recordset: Fixtures.users}))

    users(context).then(function(c) {
      expect(c).to.equal(context)
      expect(Object.keys(c.values.users).length).equals(12)
      expect(c.output.write.args[0][0]).to.deep.equal({
        type: 'user',
        user: {
          username: 'micahel.cross',
          email: 'micahel.cross@chat.hsinuat.dhs.gov',
          auth_service: 'ldap',
          teams: [
            {
              name: 'test',
              channels: [
                {
                  name: 'admin'
                }, {
                  name: 'hsinuat-appsupport'
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
          email: 'sbarclay@chat.hsinuat.dhs.gov',
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
