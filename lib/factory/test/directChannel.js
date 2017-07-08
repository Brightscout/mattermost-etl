const expect = require('chai').expect
const directChannel = require('../directChannel')

const basic = {
  members:[
    'username1',
    'username2'
  ]
}

describe('team factory', function() {

  it('should produce a valid object', function() {
    var c = directChannel(basic)
    expect(c).to.be.an('object')
    expect(c).to.deep.equal({
      type: 'direct_channel',
      direct_channel: basic
    })
  })

  it('should prevent less than 2 members', function() {
    try {
      directChannel(Object.assign({}, basic, {
        members:[
          'username1'
        ]
      }))
    }
    catch (e) {
      expect(e).to.be.an('error')
      expect(e.details[0].message).to.equal('"members" must contain at least 2 items')
    }
  })
})
