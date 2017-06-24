const _ = require('lodash')
const slug = require('slug')
const XML = require('xmldoc')
const Streams = require('../streams')
const Factory = require('../factory')

module.exports = function(context) {

  return new Promise(
    function (resolve, reject) {
      //
      // Select all of the rooms
      //
      Streams.readable.mssql.fetch(
        context.config,
        'select * from dbo.tc_rooms'
      )
      //
      // The convert them to channels and
      // write them to the datafile
      //
      .then(function(results) {

        results.recordset.forEach(function(room) {
          context.datafile.write(
            Factory.channel({
              team: context.team.name,
              name: slug(name(room.room_jid)),
              display_name: name(room.room_jid),
              header: room.subject,
              purpose: room.subject,
              type: type(room.config)
            })
          )
        })

        resolve(context)
      })
      //
      // Handle query errors
      //
      .catch(function(err) {
        reject(err)
      });
    }
  )
}

//
// Parses the name from a room jid
//
const name = function (jib='') {
  return jib.substr(0, jib.indexOf('@')).replace(/\\20/g, ' ');
}

//
// Parses the channel type from the
// config field
//
const type = function (xml='<x/>') {
  //
  // Parse the config
  //
  var config = new XML.XmlDocument(xml);
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
  return value === '1' ? 'P' : 'O';
}
