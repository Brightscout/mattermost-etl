const { Transform } = require('stream')
const Factory = require('../factory')

module.exports = function(context) {
  return new Promise(function(resolve /*, reject */) {
    //
    // Set up the transform stream
    //
    const toPost = new Transform({
      readableObjectMode: true,
      writableObjectMode: true,
      transform: function(message, encoding, callback) {
        //
        // Lookup the channel
        //
        var channel = lookup(
          'channel', context.values.channels, message.to_jid
        )
        //
        // Lookup the user
        //
        var user = lookup(
          'user', context.values.users, message.from_jid
        )
        //
        // Get the body
        //
        var body = getBody(message)
        //
        // If we have enough data, write the
        // post to the output
        //
        if(channel && user && body) {
          this.push(
            Factory.post({
              team: context.values.team.name,
              channel: channel.name,
              user: user.username,
              message: body,
              create_at: new Date(message.sent_date).getTime()
            })
          )
        } else {
          console.log(`posts: ... [!] skipping message ${message.msg_id}`)
        }

        return callback()
      }
    }).on('finish', function() {
      console.log('posts: ... finished')
      resolve(context)
    })

    //
    // Query messages from Jabber and pipe
    // through the post transform and
    // then to the output
    //
    context.jabber
      .pipe(
        `select
            msg_id,
            to_jid,
            from_jid,
            sent_date,
            body_string,
            body_text
        from dbo.tc_msgarchive where msg_type = 'g'`,
        toPost
      ).pipe(context.output)
  })
}

//
// Lookup values
//
const lookup = function (type, map, key) {
  var found = map[key]

  if(!found) {
    console.log(`posts: ... ${type} ${key} not found`)
  }

  return found
}

//
// Find the message body
//
const getBody = function (message) {
  var body = message.body_string || message.body_text

  if(!body) {
    console.log('posts: ... message body is empty')
  }

  return body
}
