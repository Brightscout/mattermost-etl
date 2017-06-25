const Factory = require('../factory')

module.exports = function(context) {
  //
  // Select all of the rooms
  //
  return context.jabber.fetch(
    context.config,
    `select
        msg_id,
        to_jid,
        from_jid,
        sent_date,
        body_string,
        body_text
    from dbo.tc_msgarchive where msg_type = 'g'`
  )
    //
    // The convert them to channels and
    // write them to the datafile
    //
    .then(function(results) {
      console.log(`posts: processing ${results.recordset.length} messages`)

      //
      // Convenience references
      //
      var values = context.values

      //
      // Iterate over the record set and
      // create a channel for each room
      //
      results.recordset.forEach(function(message) {
        //
        // Lookup the channel
        //
        var channel = lookup(
          'channel', values.channels, message.to_jid
        )
        //
        // Lookup the user
        //
        var user = lookup(
          'user', values.users, message.from_jid
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
          //
          // Write the channel data to the
          // output
          //
          context.output.write(
            Factory.post({
              team: values.team.name,
              channel: channel.name,
              user: user.username,
              message: body,
              create_at: new Date(message.sent_date).getTime()
            })
          )
        } else {
          console.log(`posts: ... skipping message ${message.msg_id}`)
        }
      })

      //
      // Resolve the promise
      //
      return context
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
