const SQL = require('mssql')

//
// Declare internals
//
const internals = {}

//
// Connect to the db and create a connection
// pool
//
module.exports.connect = function(config) {
  return SQL.connect(config.source.uri)
    .then(function(pool) {
      internals.pool = pool
    })
}

//
// Returns all results in one batch
//
module.exports.fetch = function(query) {
  return internals.pool.request().query(query)
}

//
// Delivers results to the specified write
// stream. Use this for large result sets.
//
module.exports.pipe = function(query, writable) {
  //
  // Create the request
  //
  const request = internals.pool.request()
  //
  // Attach the writable stream
  //
  request.pipe(writable)
  //
  // Submit the query
  //
  request.query(query)
  //
  // Return the writable stream for
  // chaining
  //
  return writable
}

//
// Set up an error handler
//
SQL.on('error', function(err) {
  console.error(err)
})
