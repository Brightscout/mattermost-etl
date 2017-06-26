const expect = require('chai').expect
const version = require('../version')
const context = require('./context')

describe('modules.version', function() {
  it('should write a version object', function(done) {
    version(context)
      .then(function (c) {
        expect(c).to.equal(context)
        expect(c.output.write.args[0][0]).to.deep.equal({
          type: 'version',
          version: 1
        })
        done()
      })
  })

  afterEach(function() {
    context.output.write.reset()
  })
})
