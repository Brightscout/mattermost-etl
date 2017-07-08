const datafile = require('../datafile')

//
// Initialize the child logger for
// the module
//
const log = require('../log').child({
  module: 'start'
})

module.exports = function(context) {
  log.info('connecting to jabber')
  //
  // Connect to the jabber database
  //
  return context.jabber.connect(context.config)
    .then(function() {
      log.info(`creating file '${context.config.target.filename}'`)
      //
      // Create the datafile and add
      // it to the context
      //
      context.output = datafile(
        context.config.target.filename,
        process.exit
      )
      //
      // Resolve the promise
      //
      return context
    })
}
