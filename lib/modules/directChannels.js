const { Transform } = require('stream')
const Factory = require('../factory')
const Utils = require('./utils')

module.exports = function(context) {
  return new Promise(function(resolve /*, reject */) {
    //
    // Array to accumulate the channel
    // member pairs
    //
    var channels = {}
    //
    // Set up the transform stream
    //
    const toDirectChannel = new Transform({
      readableObjectMode: true,
      writableObjectMode: true,
      transform: function(result, encoding, callback) {
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
      }
    }).on('finish', function() {
      console.log('direct channels: ... finished')
      resolve(context)
    })

    console.log('direct channels: streaming records')

    //
    // Query messages from Jabber and pipe
    // through the post transform and
    // then to the output. We use pipe to
    // handle very large data sets using
    // streams
    //
    context.jabber
      .pipe(`
        SELECT DISTINCT to_jid, from_jid FROM dbo.jm
          WHERE msg_type = 'c'
            AND direction = 'I'
            AND (body_string != '' or datalength(body_text) > 0)`,
        toDirectChannel
      )
  })
}
