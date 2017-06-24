const os = require('os');
const { Transform } = require('stream');

module.exports = function() {
  return new Transform({
    writableObjectMode: true,

    transform(chunk, encoding, callback) {
      this.push(JSON.stringify(chunk));
      this.push(os.EOL);
      return callback();
    }
  });
}
