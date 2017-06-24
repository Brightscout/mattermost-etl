const context = require('./context')
const modules = require('./lib/modules')

const {
  start,
  version,
  team,
  channels,
  end
} = modules

start(context)
  .then(version)
  .then(team)
  .then(channels)
  .then(end)
  .catch(function(err) {
    console.error(err);
    process.exit(1);
  });
