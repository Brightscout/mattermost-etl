const expect = require('chai').expect
const team = require('../team')
const context = require('./context')

describe('modules.team', function() {
  it('should write a team object', function(done) {
    team(context)
      .then(function (c) {
        expect(c).to.equal(context)
        expect(c.output.write.args[0][0]).to.deep.equal({
          type: 'team',
          team: {
            name: 'test',
            display_name: 'Test Team',
            description: 'Our Test Team',
            type: 'I',
            allow_open_invite: false
          }
        })
        done()
      })
  })

  afterEach(function() {
    context.output.write.reset()
  })
})
