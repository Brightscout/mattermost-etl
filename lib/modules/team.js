const Streams = require('../streams')
const Factory = require('../factory')

module.exports = function(context) {
  //
  // Write the team object
  //
  context.datafile.write(Factory.team(
    context.team
  ));
  //
  // Return a resolved promise
  //
  return Promise.resolve(context)
}
