const fs = require('fs')
const os = require('os')
const { Transform } = require('stream')

module.exports = function(filename='data.json', onFinish=()=>{}) {
  //
  // Create an object to string transform
  // stream
  //
  var stream = new Transform({
    writableObjectMode: true,

    transform(chunk, encoding, callback) {
      this.push(JSON.stringify(chunk))
      this.push(os.EOL)
      return callback()
    }
  })
  //
  // Pipe that to the file write
  // stream and set up an onFinish
  // handler
  //
  stream.pipe(
    fs.createWriteStream(filename).on('finish', onFinish)
  )
  //
  // Return the new write stream
  //
  return stream
}
