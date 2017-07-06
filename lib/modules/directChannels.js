const _  = require('lodash')
const { Transform } = require('stream')
const Factory = require('../factory')
const Utils = require('./utils')

module.exports = function(context) {
  return new Promise(function(resolve /*, reject */) {
    //
    // Array to accumulate the unique
    // pair of users
    //
    var members = []
    //
    // Set up the transform stream
    //
    const toDirectChannel = new Transform({
      readableObjectMode: true,
      writableObjectMode: true,
      transform: function(pairs, encoding, callback) {
        //
        // Convert the jabber jid to usernames and
        // sort them so it's easier to dedup. We
        // purposely allow an uncaught exception to be
        // thrown if the user lookup fails since
        // it should never happen. We want to terminate
        // the export
        //
        let sorted = _.sortBy(
          _.map(pairs, function(value) {
            return context.values.users[Utils.realJID(value)].username
          })
        )
        //
        // Ensure that we don't have a pair with the same
        // usernames
        //
        if(sorted[0] !== sorted[1]) {
          members.push(sorted)
        }
        //
        // Invoke the call to mark that we are
        // done with the chunk
        //
        return callback()
      }
    }).on('finish', function() {
      _.map(
        _.uniqBy(members, function(value) {
          return `${value[0]}|${value}[1]`
        }), function(value) {
          context.output.write(
            Factory.directChannel({
              members: value
            })
          )
        }
      )

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
