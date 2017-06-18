const fs = require('fs');

module.exports = function(basename='data') {
  return fs.createWriteStream(
    `${basename}.json`
  );
}
