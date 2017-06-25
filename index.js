const context = require('./context')
const modules = require('./lib/modules')

const {
  start,
  version,
  team,
  channels,
  users,
  end
} = modules

start(context)
  .then(version)
  .then(team)
  .then(channels)
  .then(users)
  .then(end)
  .catch(function(err) {
    console.error(err)
    process.exit(1)
  })
