const bunyan = require('bunyan')

module.exports = bunyan.createLogger({
  name: 'mm-etl',
  streams: [
    {
      level: 'info',
      stream: process.stdout
    },
    {
      level: 'info',
      path: 'mm-etl.log'
    }
  ]
})
