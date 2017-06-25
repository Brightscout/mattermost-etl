const datafile = require('../datafile')

module.exports = function(context) {
  console.log(`start: connecting to jabber`)
  //
  // Connect to the jabber database
  //
  return context.jabber.connect(context.config)
    .then(function() {
      console.log(`start: creating file '${context.config.target.filename}'`)
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
