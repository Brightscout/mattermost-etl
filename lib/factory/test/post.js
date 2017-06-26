const expect = require('chai').expect
const post = require('../post')

const basic = {
  team: 'test',
  channel: 'channel',
  user: 'user',
  message: 'carpe diem',
  create_at: new Date().getTime()
}

describe('post factory', function() {

  it('should produce a valid object', function() {
    var p = post(basic)
    expect(p).to.be.an('object')
    expect(p).to.deep.equal({
      type: 'post',
      post: basic
    })
  })

  it('should ensure message is not empty', function() {
    try {
      var p = post(Object.assign({}, basic, {
        message: ''
      }))
      expect(p).to.be.undefined
    }
    catch (e) {
      expect(e).to.be.an('error')
      expect(e.details[0].message).to.equal('"message" is not allowed to be empty')
    }
  })
})
