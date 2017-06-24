const Factory = require('../factory')

module.exports = function(context) {
  //
  // Write the version object
  //
  context.datafile.write(Factory.version());
  //
  // Return a resolved promise
  //
  return Promise.resolve(context)
}
