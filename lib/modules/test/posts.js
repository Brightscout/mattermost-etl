const expect = require('chai').expect
const { spy } = require('sinon')
const { Writable } = require('stream')
const posts = require('../posts')
const Fixtures = require('./fixtures')
const context = require('./context')()

describe('modules.posts', function() {

  it('should process post objects', function(done) {
    //
    // Set up context values
    //
    context.values = {
      team: context.config.define.team,
      channels: {
        'hsinuat-appsupport@conference.chat.hsinuat.dhs.gov': {
          team: 'hsin',
          name: 'hsinuat-appsupport',
          display_name: 'Hsinuat Appsupport',
          header: '',
          purpose: '',
          type: 'P'
        }
      },
      users: {
        'micahel.cross@chat.hsinuat.dhs.gov': {
          username: 'micahel.cross',
          email: 'micahel.cross@chat.hsinuat.dhs.gov',
          auth_service: 'ldap',
          teams: [
            {
              name: 'hsin',
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
      }
    }
    //
    // Stub the data source
    //
    context.jabber.pipe.callsFake(function(query, writable) {
      Fixtures.posts.ok.forEach(function(post) {
        writable.write(post)
      })
      writable.end()
      return writable
    })
    //
    // Stub the output stream
    //
    context.output = new Writable({
      objectMode: true,
      write(chunk, encoding, callback) {
        return callback()
      }
    })
    spy(context.output, 'write')
    //
    // Process the posts
    //
    posts(context).then(function(c) {
      expect(c).to.equal(context)
      expect(context.output.write.callCount).to.equal(2)

      let post = c.output.write.args[0][0]
      expect(post).to.deep.equal({
        type: 'post',
        post: {
          team: 'test',
          channel: 'hsinuat-appsupport',
          user: 'micahel.cross',
          message: 'I meant thick',
          create_at: 1496693318263
        }
      })
      expect(new Date(post.post.create_at).toISOString()).to.equal('2017-06-05T20:08:38.263Z')
      done()
    }).catch(function(e){
      expect(e).to.be.undefined
    })
  })

  afterEach(function() {
    context.jabber.pipe.reset()
  })
})
