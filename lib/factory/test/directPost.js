const expect = require('chai').expect
const directPost = require('../directPost')

const basic = {
  channel_members: [
    'username1',
    'username2'
  ],
  user: 'username1',
  message: 'carpe diem',
  create_at: new Date().getTime()
}

describe('post factory', function() {

  it('should produce a valid object', function() {
    var p = directPost(basic)
    expect(p).to.be.an('object')
    expect(p).to.deep.equal({
      type: 'direct_post',
      direct_post: basic
    })
  })

  it('should ensure message is not empty', function() {
    try {
      var p = directPost(Object.assign({}, basic, {
        message: ''
      }))
      expect(p).to.be.undefined
    }
    catch (e) {
      expect(e).to.be.an('error')
      expect(e.details[0].message).to.equal('"message" is not allowed to be empty')
    }
  })

  it('should prevent less than 2 members', function() {
    try {
      var p = directPost(Object.assign({}, basic, {
        channel_members:[
          'username1'
        ]
      }))
      expect(p).to.be.undefined
    }
    catch (e) {
      expect(e).to.be.an('error')
      expect(e.details[0].message).to.equal('"channel_members" must contain at least 2 items')
    }
  })

})
