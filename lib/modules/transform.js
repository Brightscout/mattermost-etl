const { Transform } = require('stream')

module.exports = function(name, transform, callback) {
  return new Transform({
    readableObjectMode: true,
    writableObjectMode: true,
    transform,
  }).on('finish', function() {
    console.log(`${name} ... finished`)
    callback(context)
  })
}
