const expect = require('chai').expect
const end = require('../end')
const context = require('./context')()

describe('modules.end', function() {
  it('should close the output stream', function() {
    end(context)
    expect(context.output.end.called).to.be.true
  })

  afterEach(function() {
    context.output.end.reset()
  })
})
