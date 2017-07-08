const Factory = require('../factory')
const transform = require('./transform')
const Utils = require('./utils')

//
// Initialize the child logger for
// the module
//
const log = require('../log').child({
  module: 'directChannels'
})

module.exports = function(context) {
  return new Promise(function(resolve /*, reject */) {
    log.info('streaming records')
    //
    // Array to accumulate the channel
    // member pairs
    //
    var channels = {}
    //
    // Query messages from Jabber and pipe
    // through the post transform and
    // then to the output. We use pipe to
    // handle very large data sets using
    // streams
    //
    context.jabber.pipe(
      //
      // Define the query
      //
      `SELECT DISTINCT to_jid, from_jid FROM dbo.jm
        WHERE msg_type = 'c'
          AND direction = 'I'
          AND (body_string != '' or datalength(body_text) > 0)`,
      //
      // Define the tranform
      //
      transform('direct channels', function(result, encoding, callback) {
        //
        // Generate the members array for the
        // direct channel
        //
        let members = Utils.members(
          context.values.users,
          result.to_jid,
          result.from_jid
        )
        //
        // If we haven't processed this pair already
        // AND the username pair are not the same, write
        // the object
        //
        var key = `${members[0]}|${members}[1]`
        if(!channels[key] && members[0] !== members[1]) {
          channels[key] = members

          log.info(`... writing ${members}`)
          context.output.write(
            Factory.directChannel({
              members
            })
          )
        }
        //
        // Invoke the call to mark that we are
        // done with the chunk
        //
        return callback()
      },
      //
      // Define the callback to be invoked
      // on finish
      //
      function() {
        log.info('... finished')
        resolve(context)
      })
    )
  })
}
