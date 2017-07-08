const { Transform } = require('stream')
// const log = require('../log')

module.exports = function(transform, callback) {
  return new Transform({
    readableObjectMode: true,
    writableObjectMode: true,
    transform
    // transform: function(object, encoding, callback) {
    //   try {
    //     transform(object, encoding, callback)
    //   }
    //   catch(err) {
    //     log.error(err)
    //     throw err
    //   }
    // }

  }).on('finish', callback)
}
