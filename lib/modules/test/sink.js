const { spy } = require('sinon')
const { Writable } = require('stream')

//
// Returns a spied writable stream
//
module.exports = function() {

  var writable = new Writable({
    objectMode: true,
    write(chunk, encoding, callback) {
      return callback()
    }
  })
  spy(writable, 'write')

  return writable
}
