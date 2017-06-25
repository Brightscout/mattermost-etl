const _ = require('lodash')
const slug = require('slug')
const XML = require('xmldoc')
const Factory = require('../factory')

module.exports = function(context) {
  //
  // Select all of the rooms
  //
  return context.jabber.fetch(
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
          name: slug(toName(room.room_jid)),
          display_name: toName(room.room_jid),
          header: toDescription(room.subject),
          purpose: toDescription(room.subject),
          type: toType(room.config)
        }
        //
        // Write the channel data to the
        // output
        //
        console.log(`channels: ... writing ${channel.name}`)
        context.output.write(
          Factory.channel(channel)
        )
      })
      //
      // Add the channel map to the context
      //
      context.values.channels = channels
      //
      // Resolve the promise
      //
      return context
    })
}


//
// Parses the name from a room jid
//
const toName = function (jid='') {
  return jid.substr(0, jid.indexOf('@')).replace(/\\20/g, ' ')
}

//
// Returns a description from the subject
//
const toDescription = function (subject='') {
  return subject
}

//
// Parses the channel type from the
// config field
//
const toType = function (xml='<x/>') {
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
