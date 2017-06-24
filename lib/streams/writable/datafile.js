const fs = require('fs');

module.exports = function(filename='data.json', onFinish=()=>{}) {
  return fs.createWriteStream(filename)
    .on('finish', onFinish)
}
