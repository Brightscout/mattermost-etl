const datafile = require('../datafile')

module.exports = function(context) {
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
  // Return a resolved promise
  //
  return Promise.resolve(context)
}
