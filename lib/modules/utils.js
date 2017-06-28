module.exports = {
  //
  // Removes trailing /<string> suffixes that
  // may exist in the user ids. This happens
  // if a user logs in to jabber more than
  // once at the same time
  //
  realJID: function (jid='') {
    return jid.split('/')[0]
  }
}
