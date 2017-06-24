const Streams = require('../streams')

module.exports = function(context) {
  console.log('end')
  context.datafile.end()
}
