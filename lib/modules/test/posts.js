const expect = require('chai').expect
const posts = require('../posts')
const Fixtures = require('./fixtures')
const FakeDB = require('./fakedb')
const sink = require('./sink')
const context = require('./context')()

describe('modules.posts', function() {

  before(function() {
    //
    // Set up context values
    //
    context.values = {
      team: context.config.define.team,
      channels: {
        'uat-appsupport@conference.example.com': {
          team: 'test',
          name: 'uat-appsupport',
          display_name: 'Uat Appsupport',
          header: '',
          purpose: '',
          type: 'P'
        }
      },
      users: {
        'micahel.cross@example.com': {
          username: 'micahel.cross',
          email: 'micahel.cross@example.com',
          auth_service: 'ldap',
          teams: [
            {
              name: 'test',
              channels: [
                {
                  name: 'uat-appsupport'
                }
              ]
            }
          ]
        }
      }
    }
  })

  beforeEach(function() {
    //
    // Stub the output stream
    //
    context.output = sink()
  })

  it('should process post objects', function(done) {
    //
    // Set up the DB
    //
    context.jabber = new FakeDB(Fixtures.posts.ok)
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
          channel: 'uat-appsupport',
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


  it('should fail on user not found', function(done) {
    //
    // Set up the DB
    //
    context.jabber = new FakeDB(Fixtures.posts.userNotFound)
    //
    // Process the posts
    //
    posts(context).then(function(c) {
      expect(c).to.equal(context)
      expect(c.output.write.callCount).to.equal(1)
      let post = c.output.write.args[0][0]
      expect(post).to.deep.equal({
        type: 'post',
        post: {
          team: 'test',
          channel: 'uat-appsupport',
          user: 'micahel.cross',
          message: 'I meant thick',
          create_at: 1496693318263
        }
      })
      done()
    }).catch(function(e){
      expect(e).to.be.null
      done()
    })
  })


  it('should fail on body not found', function(done) {
    //
    // Set up the DB
    //
    context.jabber = new FakeDB(Fixtures.posts.bodyNotFound)
    //
    // Process the posts
    //
    posts(context).then(function(c) {
      expect(c).to.equal(context)
      expect(c.output.write.callCount).to.equal(0)
      done()
    }).catch(function(e){
      expect(e).to.be.null
      done()
    })
  })
})
