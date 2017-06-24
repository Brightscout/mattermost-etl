const Streams = require('../streams')

module.exports = function(context) {
  //
  // Create a strify stream
  //
  (context.datafile = Streams.transform.stringify())
    .pipe(
      Streams.writable.datafile(
        context.config.target.filename,
        process.exit
      )
    )

  //
  // Return a resolved promise
  //
  return Promise.resolve(context)
}
