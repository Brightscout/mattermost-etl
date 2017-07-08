const expect = require('chai').expect
const directPosts = require('../directPosts')
const Fixtures = require('./fixtures')
const FakeDB = require('./fakedb')
const sink = require('./sink')
const context = require('./context')()

describe('modules.directPosts', function() {

  before(function() {
    //
    // Set up context values
    //
    context.values = {
      users: {
        'person.one@example.com': {
          username: 'person.one'
        },
        'person.two@example.com': {
          username: 'person.two'
        },
        'person.three@example.com': {
          username: 'person.three'
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

  it('should process direct channel objects', function(done) {
    //
    // Set up the DB
    //
    context.jabber = new FakeDB(Fixtures.directPosts)
    //
    // Process the data
    //
    directPosts(context).then(function(c) {
      expect(c).to.equal(context)
      expect(c.output.write.args).to.deep.equal([
        [
          {
            type: 'direct_post',
            direct_post: {
              channel_members: [
                'person.one', 'person.two'
              ],
              user: 'person.two',
              message: 'message 01',
              create_at: 1497066628513
            }
          }
        ],
        [
          {
            type: 'direct_post',
            direct_post: {
              channel_members: [
                'person.one', 'person.three'
              ],
              user: 'person.three',
              message: 'message 02',
              create_at: 1497066628514
            }
          }
        ],
        [
          {
            type: 'direct_post',
            direct_post: {
              channel_members: [
                'person.one', 'person.two'
              ],
              user: 'person.one',
              message: 'message 03',
              create_at: 1497066628515
            }
          }
        ]
      ])

      done()
    })
  })
})
