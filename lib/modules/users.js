const _ = require('lodash')
const Factory = require('../factory')
const Utils = require('./utils')

//
// Initialize the child logger for
// the module
//
const log = require('../log').child({
  module: 'users'
})

module.exports = function(context) {
  //
  // Select all of the users
  //
  const where = 'msg_type = \'c\''

  return context.jabber.fetch(`
      SELECT real_jid, room_jid FROM dbo.tc_users
      UNION ALL (
        SELECT from_jid AS real_jid, NULL AS room_jid FROM dbo.jm WHERE ${where}
        UNION
        SELECT to_jid AS real_jid, NULL AS room_jid FROM dbo.jm WHERE ${where}
      )
    `)
    //
    // Build up the user objects and then
    // write them to the output
    //
    .then(function(results) {
      log.info(`${results.recordset.length} records found`)
      //
      // Map of users
      //
      var users = {}

      //
      // Iterate over the record set and
      // assemble the user objects
      //
      results.recordset.forEach(function(record) {
        log.debug(record)
        //
        // Clean the real_jid to ensure we don't
        // have duplicates with /<string> suffixes
        //
        var real_jid = Utils.realJID(record.real_jid)
        //
        // Return a reference to the user in the user map
        // or add one if it doesn't yet exist
        //
        var user = users[real_jid] = _.get(users, real_jid, {
          username: toUsername(real_jid),
          email: real_jid,
          auth_service: context.config.define.user.auth_service,
          teams: [{
            name: context.values.team.name,
            channels: []
          }]
        })
        //
        // Look up the channel based on the
        // room id
        //
        var channel = context.values.channels[record.room_jid]
        //
        // Add it to the user
        //
        if (channel) {
          user.teams[0].channels = _.unionBy(user.teams[0].channels, [{
            name: channel.name
          }], 'name')
        }
      })

      //
      // Now that the users are assembled, write
      // them to the output
      //
      _.forEach(users, function(user) {
        log.info(`... writing ${user.username}`)
        context.output.write(
          Factory.user(user)
        )
      })

      //
      // Add the users map to the context
      //
      context.values.users = users
      //
      // Return the context
      //
      return context
    })
}

//
// Parse the username
//
const toUsername = function (jid='') {
  return jid.split('@')[0]
}
