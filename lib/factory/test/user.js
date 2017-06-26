const expect = require('chai').expect
const user = require('../user')

const basic = {
  username: 'user.name',
  email: 'user@example.gov',
  auth_service: 'ldap',
  auth_data: 'username-field-reference',
  teams: [{
    name: 'test',
    channels: [{
      name: 'channel-1'
    }, {
      name: 'channel-2'
    }]
  }]
}

describe('user factory', function() {

  it('should produce a valid object', function() {
    var u = user(basic)
    expect(u).to.be.an('object')
    expect(u).to.deep.equal({
      type: 'user',
      user: basic
    })
  })

  it('should ensure email is valid', function() {
    try {
      var u = user(Object.assign({}, basic, {
        email: 'foo@bar'
      }))
      expect(u).to.be.undefined
    }
    catch (e) {
      expect(e).to.be.an('error')
      expect(e.details[0].message).to.equal('"email" must be a valid email')
    }
  })
})
