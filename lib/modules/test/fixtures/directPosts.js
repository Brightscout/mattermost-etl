module.exports = [
  {
    to_jid: 'person.one@example.com/Jabber Messenger Desktop',
    from_jid: 'person.two@example.com/g1b9b8hs09',
    sent_date: '2017-06-10T03:50:28.513Z',
    body_string: 'message 01',
    body_text: ''
  }, {
    to_jid: 'person.one@example.com/Jabber Messenger Desktop',
    from_jid: 'person.three@example.com/g1b9b8hs09',
    sent_date: '2017-06-10T03:50:28.514Z',
    body_string: 'message 02',
    body_text: ''
  }, {
    to_jid: 'person.two@example.com/g1b9b8hs09',
    from_jid: 'person.one@example.com/Jabber Messenger Desktop',
    sent_date: '2017-06-10T03:50:28.515Z',
    body_string: '',
    body_text: 'message 03'
  }, {
    to_jid: 'person.two@example.com/g1b9b8hs09',
    from_jid: 'person.two@example.com/g1b9b8hs08',
    sent_date: '2017-06-10T03:50:28.515Z',
    body_string: 'This should not be exported',
    body_text: ''
  }
]
