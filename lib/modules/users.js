const _ = require('lodash')
const Factory = require('../factory')

module.exports = function(context) {
  //
  // Select all of the rooms
  //
  return context.jabber.fetch(
    context.config,
    "select * from dbo.tc_users"
  )
  //
  // The convert them to channels and
  // write them to the datafile
  //
  .then(function(results) {
    console.log(`users: processing ${results.recordset.length} users`)
    //
    // Convenience references
    //
    var values = context.values
    var define = context.config.define

    //
    // Map of userss
    //
    var users = {}

    //
    // Iterate over the record set and
    // create a channel for each room
    //
    results.recordset.forEach(function(record) {
      //
      // Return a reference to the user in the user map
      // or add one if it doesn't yet exist
      //
      var user = users[record.real_jid] = _.get(users, record.real_jid, {
        username: toUsername(record.real_jid),
        email: toEmail(record.real_jid),
        auth_service: define.user.auth_service,
        auth_data: define.user.auth_data,
        teams: [{
          name: values.team.name,
          channels: []
        }]
      })
      //
      // Look up the channel and add it to the
      // user object if it exists
      //
      var channel = values.channels[record.room_jid];
      if(channel) {
        user.teams[0].channels.push({
          name: channel.name
        })
      }
      //
      // Write the channel data to the
      // output
      //
      console.log(`users: ... writing ${user.username}`)
      context.output.write(
        Factory.user(user)
      )
    })
    //
    // Add the users map to the context
    //
    context.values.users = users
    //
    // Resolve the promise
    //
    return context
  })
}

//
// Parse the email
//
const toEmail = function (jid='') {
  return jid.split('/')[0]
}
//
// Parse the username
//
const toUsername = function (jid='') {
  return jid.split('@')[0] // jid.substr(0, jid.indexOf('@'))
}
//
// Parse the first name
//
const toFirstName = function (username='') {
  return _.capitalize(username.substr(0, username.indexOf('.')))
}
//
// Parse the last name
//
const toLastName = function (username='') {
  return _.capitalize(username.substr(username.indexOf('.') + 1)).replace(/[0-9]/g, '')
}
