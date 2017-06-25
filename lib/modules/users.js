const _ = require('lodash')
const Factory = require('../factory')

module.exports = function(context) {
  return new Promise(
    function (resolve, reject) {
      //
      // Select all of the rooms
      //
      context.jabber.fetch(
        context.config,
        "select room_jid, real_jid from dbo.tc_users"
      )
      //
      // The convert them to channels and
      // write them to the datafile
      //
      .then(function(results) {
        console.log(`users: processing ${results.recordset.length} users`)
        //
        // Iterate over the record set and
        // create a channel for each room
        //
        results.recordset.forEach(function(user) {
          console.log(user)
        })
        //
        // Resolve the promise
        //
        resolve(context)
      })
      //
      // Handle query errors
      //
      .catch(function(err) {
        reject(err)
      })
    }
  )
}
