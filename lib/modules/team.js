const Factory = require('../factory')

module.exports = function(context) {
  console.log(`team: writing team '${context.config.define.team.name}'`)
  //
  // Store the team object for use
  // by other modules
  //
  context.values.team = context.config.define.team
  //
  // Write the team object to the
  // output
  //
  context.output.write(Factory.team(
    context.config.define.team
  ))
  //
  // Return a resolved promise
  //
  return Promise.resolve(context)
}
