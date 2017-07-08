const expect = require('chai').expect
const directChannels = require('../directChannels')
const Fixtures = require('./fixtures')
const FakeDB = require('./fakedb')
const sink = require('./sink')
const context = require('./context')()

describe('modules.directChannels', function() {

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
    context.jabber = new FakeDB(Fixtures.directChannels)
    //
    // Process the data
    //
    directChannels(context).then(function(c) {
      expect(c).to.equal(context)
      expect(c.output.write.args).to.deep.equal(
        [
          [
            {
              type: 'direct_channel',
              direct_channel: {
                members: ['person.one', 'person.two']
              }
            }
          ],
          [
            {
              type: 'direct_channel',
              direct_channel: {
                members: ['person.one', 'person.three']
              }
            }
          ]
        ]
      )
      
      done()
    })
  })
})
