const Factory = require('../factory')
const transform = require('./transform')
const Utils = require('./utils')

//
// Initialize the child logger for
// the module
//
const log = require('../log').child({
  module: 'directPosts'
})

module.exports = function(context) {
  return new Promise(function(resolve /*, reject */) {
    log.info('streaming records')
    //
    // Keep track of the number of posts
    // written for logging
    //
    var written = 0
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
      `SELECT to_jid, from_jid, sent_date, body_string, body_text FROM dbo.jm
          WHERE msg_type = 'c'
            AND direction = 'I'
            AND (body_string != '' or datalength(body_text) > 0)`,
      //
      // Define the tranform
      //
      transform(function(message, encoding, callback) {
        //
        // Generate the members array for the
        // direct channel
        //
        let members = Utils.members(
          context.values.users,
          message.to_jid,
          message.from_jid
        )
        //
        // Ensure we have at least two channel
        // members before we can write the message
        //
        if (Utils.membersAreValid(members)) {
          context.output.write(
            Factory.directPost({
              channel_members: members,
              user: Utils.username(context.values.users, message.from_jid),
              message: Utils.body(message),
              create_at: Utils.millis(message.sent_date)
            })
          )
          //
          // Log progress periodically
          //
          written += 1
          if(written % 1000 == 0) {
            log.info(`... wrote ${written} posts`)
          }
        } else {
          log.warn({
            to_jid: message.to_jid,
            from_jid: message.from_jid
          }, '... skipping message with invalid channel members')
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
        log.info(`... finished writing ${written} posts`)
        resolve(context)
      })
    )
  })
}
