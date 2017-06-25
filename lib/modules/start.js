const datafile = require('../datafile')

module.exports = function(context) {
  return new Promise(
    function (resolve, reject) {
      console.log(`start: connecting to jabber`)
      //
      // Connect to the jabber database
      //
      context.jabber.connect(context.config)
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
          resolve(context)
        })
        .catch(function(err) {
          reject(err)
        })
    }
  )
}
