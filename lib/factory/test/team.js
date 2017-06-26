const expect = require('chai').expect
const team = require('../team')

const basic = {
  name: 'test-team',
  display_name: 'Test Team',
  description: 'A test team for testing',
  type: 'O',
  allow_open_invite: true
}

describe('team factory', function() {

  it('should produce a valid object', function() {
    var t = team(basic)
    expect(t).to.be.an('object')
    expect(t).to.deep.equal({
      type: 'team',
      team: basic
    })
  })

  it('should prevent an invalid type', function() {
    try {
      team(Object.assign({}, basic, {
        type: 'X'
      }))
    }
    catch (e) {
      expect(e).to.be.an('error')
      expect(e.details[0].message).to.equal('"type" must be one of [O, I]')
    }
  })
})
