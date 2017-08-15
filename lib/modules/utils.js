const _ = require('lodash')

//
// Declare utils object
//
const utils = {}

//
//
//
utils.chunk = function(body) {
  //
  // Max length
  //
  var max = 4000
  //
  // Use regex to create an array
  // of strings of max length
  //
  return body.match(new RegExp('.{1,' + max + '}', 'g'))
}

//
// Removes trailing /<string> suffixes that
// may exist in the user ids. This happens
// if a user logs in to jabber more than
// once at the same time
//
utils.realJID = function (jid='') {
  return jid.split('/')[0]
    .replace(/\\20+/g, '.')
    .replace(/\.\.+/, '.')
}

//
// Lookup values
//
utils.lookup = function (type, map, key) {
  var found = map[key]

  if(!found) {
    throw new Error(`${type} ${key} not found`)
  }

  return found
}

//
// Obtain the username from a jid
//
utils.username = function (users, jid) {
  return utils.lookup('user', users, utils.realJID(jid)).username
}

//
// Obtain the channel name from a jid
//
utils.channelName = function (channels, jid) {
  return utils.lookup('channel', channels, jid).name
}

//
// Find the message body
//
utils.body = function (message) {
  var body = message.body_string || message.body_text

  if(!body) {
    throw new Error(`message ${message.msg_id} body is empty`)
  }

  return utils.chunk(body)
}

//
// Coverts the to / from JIDs to a members
// array
//
utils.members = function(users, to, from) {
  //
  // We use uniq to remove duplicate
  // members in the same channel
  //
  return _.uniq(_.sortBy([
    utils.username(users, to),
    utils.username(users, from),
  ]))
}

//
// Checks if the members list is valid
//
utils.membersAreValid = function(members) {
  return _.isArray(members) && members.length > 1
}

//
// Convert ISO to millis
//
utils.millis = function(date) {
  return new Date(date).getTime()
}

//
// Export the functions
//
module.exports = utils
