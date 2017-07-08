const { Transform } = require('stream')

module.exports = function(transform, callback) {
  return new Transform({
    readableObjectMode: true,
    writableObjectMode: true,
    transform
  }).on('finish', callback)
}
