const expect = require('chai').expect
const fs = require('fs')
const start = require('../start')
const context = require('./context')()

describe('modules.start', function() {
  var resultHandler = function(err) { 
    if(err) {
      console.log('unlink failed', err)
    } else {
      console.log('file deleted')
    }
  }
  
  it('should set up the source and output', function(done) {
    start(context)
      .then(function (c) {
        expect(c).to.equal(context)
        expect(fs.existsSync(context.config.target.filename)).to.be.true
        done()
      })
      .catch(function(err){
        console.log(err)
      })
  })

  afterEach(function() {
    fs.unlink(context.config.target.filename, resultHandler)
  })
})
