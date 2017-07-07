const { Transform } = require('stream')
const Factory = require('../factory')
const Utils = require('./utils')

module.exports = function(context) {
  return new Promise(function(resolve /*, reject */) {
    //
    // Set up the transform stream
    //
    const toDirectPost = new Transform({
      readableObjectMode: true,
      writableObjectMode: true,
      transform: function(message, encoding, callback) {
        //
        // Write the direct post to the
        // output
        //
        context.output.write(
          Factory.directPost({
            channel_members: Utils.members(
              context.values.users,
              message.to_jid,
              message.from_jid
            ),
            user: Utils.username(context.values.users, message.from_jid),
            message: Utils.body(message),
            create_at: Utils.millis(message.sent_date)
          })
        )
        //
        // Invoke the call to mark that we are
        // done with the chunk
        //
        return callback()
      }
    }).on('finish', function() {
      console.log('direct posts: ... finished')
      resolve(context)
    })

    console.log('direct posts: streaming records')

    //
    // Query messages from Jabber and pipe
    // through the post transform and
    // then to the output. We use pipe to
    // handle very large data sets using
    // streams
    //
    context.jabber
      .pipe(`
        SELECT to_jid, from_jid, sent_date, body_string, body_text FROM dbo.jm
          WHERE msg_type = 'c'
            AND direction = 'I'
            AND (body_string != '' or datalength(body_text) > 0)`,
        toDirectPost
      )
  })
}
