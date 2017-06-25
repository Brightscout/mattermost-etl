const _ = require('lodash')
const slug = require('slug')
const XML = require('xmldoc')
const Factory = require('../factory')

module.exports = function(context) {
  return new Promise(
    function (resolve, reject) {
      //
      // Select all of the rooms
      //
      context.jabber.fetch(
        context.config,
        'select * from dbo.tc_rooms'
      )
      //
      // The convert them to channels and
      // write them to the datafile
      //
      .then(function(results) {
        console.log(`channels: processing ${results.recordset.length} rooms`)
        //
        // Define a map to hold the channels
        // info for downstream modules
        //
        var channels = {}
        //
        // Iterate over the record set and
        // create a channel for each room
        //
        results.recordset.forEach(function(room) {
          //
          // Define the channel and add
          // it to the context
          //
          var channel = channels[room.room_jid] = {
            team: context.values.team.name,
            name: slug(name(room.room_jid)),
            display_name: name(room.room_jid),
            header: room.subject,
            purpose: room.subject,
            type: type(room.config)
          }
          console.log(`channels: ... writing ${channel.name}`)
          //
          // Write the channel data to the
          // output
          //
          context.output.write(
            Factory.channel(channel)
          )
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

//
// Parses the name from a room jid
//
const name = function (jib='') {
  return jib.substr(0, jib.indexOf('@')).replace(/\\20/g, ' ')
}

//
// Parses the channel type from the
// config field
//
const type = function (xml='<x/>') {
  //
  // Parse the config
  //
  var config = new XML.XmlDocument(xml)
  //
  // Extract the value
  //
  var value = _.get(
    config.childWithAttribute('var', 'members-only'),
    'firstChild.val',
    '1'
  )
  //
  // If members-only is '1', return private
  // otherwise, return public
  //
  return value === '1' ? 'P' : 'O'
}
