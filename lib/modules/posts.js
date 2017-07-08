const Factory = require('../factory')
const transform = require('./transform')
const Utils = require('./utils')

//
// Initialize the child logger for
// the module
//
const log = require('../log').child({
  module: 'posts'
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
      `SELECT
            msg_id,
            to_jid,
            from_jid,
            sent_date,
            body_string,
            body_text
        FROM dbo.tc_msgarchive WHERE msg_type = 'g' AND (body_string != '' OR datalength(body_text) > 0) `,
      //
      // Define the tranform
      //
      transform('posts', function(message, encoding, callback) {
        log.debug(message)
        //
        // Lookup the channel
        //
        var channel = Utils.lookup(
          'channel', context.values.channels, message.to_jid
        )
        //
        // Lookup the user
        //
        var username = Utils.username(
          context.values.users, message.from_jid
        )
        //
        // Get the body
        //
        var body = Utils.body(message)
        //
        // If we have enough data, write the
        // post to the output
        //
        if(channel && username && body) {
          //
          // Write the post object to the
          // output
          //
          context.output.write(
            Factory.post({
              team: context.values.team.name,
              channel: channel.name,
              user: username,
              message: body,
              create_at: new Date(message.sent_date).getTime()
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
          log.warn(`... [!] skipping message ${message.msg_id}`)
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
