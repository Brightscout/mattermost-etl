const expect = require('chai').expect
const fs = require('fs')
const datafile = require('../datafile')

const filename = 'test.json'

describe('datafile', function() {

  it('should write objects to a file', function(done) {
    var d = datafile(filename, () => {
      expect(fs.existsSync(filename)).to.be.true
      done()
    })

    d.write({
      foo: 'bar'
    })

    d.end()
  })

  after(function() {
    fs.unlink(filename)
  })
})
