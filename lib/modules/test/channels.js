const expect = require('chai').expect
const channels = require('../channels')
const Fixtures = require('./fixtures')
const context = require('./context')()

describe('modules.channels', function() {

  it('should process channel objects', function(done) {

    context.values.team = context.config.define.team

    context.jabber.fetch.returns(Promise.resolve({
      recordset: Fixtures.channels
    }))

    channels(context)
      .then(function (c) {
        expect(c).to.equal(context)
        expect(Object.keys(c.values.channels).length).equals(5)
        expect(c.output.write.args[0][0]).to.deep.equal({
          type: 'channel',
          channel: {
            team: 'test',
            name: 'admin',
            display_name: 'Admin',
            header: 'Admin Test room',
            purpose: 'Admin Test room',
            type: 'O'
          }
        })
        expect(c.output.write.args[2][0]).to.deep.equal({
          type: 'channel',
          channel: {
            team: 'test',
            name: 'test-room',
            display_name: 'Test Room',
            header: '',
            purpose: '',
            type: 'O'
          }
        })
        expect(c.output.write.args[4][0]).to.deep.equal({
          type: 'channel',
          channel: {
            team: 'test',
            name: 'tonyd_20161206_1432',
            display_name: 'Tonyd 20161206 1432',
            header: '',
            purpose: '',
            type: 'O'
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
