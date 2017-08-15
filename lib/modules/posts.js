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
      transform(function(message, encoding, callback) {
        try {
          log.debug(message)
          //
          // Base post props
          //
          var post = {
            team: context.values.team.name,
            channel: Utils.channelName(
              context.values.channels, message.to_jid
            ),
            user: Utils.username(
              context.values.users, message.from_jid
            ),
            create_at: Utils.millis(message.sent_date)
          }
          //
          // Process each chunk
          //
          Utils.body(message).forEach(function(chunk) {
            //
            // Write the post object to the
            // output
            //
            context.output.write(
              Factory.post(Object.assign({}, post, {
                message: chunk
              }))
            )
            //
            // Log progress periodically
            //
            written += 1
            if(written % 1000 == 0) {
              log.info(`... wrote ${written} posts`)
            }
          })
        }
        catch(err) {
          log.error(`... ignoring message id:${message.msg_id} on error: ${err.message}.`)
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
